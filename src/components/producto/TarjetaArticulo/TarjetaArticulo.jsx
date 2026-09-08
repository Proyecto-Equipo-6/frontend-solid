import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconoActivo, IconoFlecha, IconoCarrito } from '@/components/ui/Iconos/Iconos'
import { formatoPrecio, estadoStock, textoStock } from '@/utils/formato'
import { agregarAlCarrito } from '@/services/carrito'
import { obtenerSesion } from '@/services/sesion'
import './TarjetaArticulo.css'

export default function TarjetaArticulo({ articulo }) {
  const { id, titulo, imagen, descripcion, categoria, precio, stock, estado } = articulo
  const navigate = useNavigate()
  const [agregando, setAgregando] = useState(false)
  const [exito, setExito] = useState(false)
  const [mostrarCantidad, setMostrarCantidad] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  const estadoStockArticulo = estadoStock(stock)
  const inactivo = Number(estado) === 0
  const agotado = inactivo || estadoStockArticulo === 'agotado'

  function abrirSelector(evento) {
    evento.preventDefault()
    evento.stopPropagation()
    if (agotado) return
    if (!obtenerSesion()) {
      navigate('/login')
      return
    }
    setCantidad(1)
    setMostrarCantidad((valor) => !valor)
  }

  function cambiarCantidad(valor) {
    setCantidad(Math.max(1, Math.min(Number(valor) || 1, stock)))
  }

  async function confirmarAgregar(evento) {
    evento.preventDefault()
    evento.stopPropagation()
    if (agotado) return
    setAgregando(true)
    try {
      await agregarAlCarrito(articulo, cantidad)
      setExito(true)
      setMostrarCantidad(false)
      window.setTimeout(() => setExito(false), 1800)
    } catch {
      setExito(false)
    } finally {
      setAgregando(false)
    }
  }

  return (
    <article className="tarjeta">
      <Link
        className="tarjeta__enlace"
        to={`/articulo/${id}`}
        aria-label={`Ver detalles de ${titulo}`}
      >
        <div className="tarjeta__imagen">
          {imagen ? (
            <img src={imagen} alt={titulo} />
          ) : (
            <div className="tarjeta__imagen-vacia">Nexbit</div>
          )}
          <span className="tarjeta__categoria">{categoria}</span>
          {agotado && (
            <span className="tarjeta__sello tarjeta__sello--agotado">No disponible</span>
          )}
          {!agotado && (
            <button
              type="button"
              className="tarjeta__carrito"
              aria-label={`Agregar ${titulo} al carrito`}
              title="Agregar al carrito"
              onClick={abrirSelector}
            >
              <span className="tarjeta__carrito-icono">
                {exito ? <IconoActivo tamano={16} /> : <IconoCarrito tamano={16} />}
              </span>
            </button>
          )}
        </div>
        <div className="tarjeta__cuerpo">
          <h3 className="tarjeta__titulo">{titulo}</h3>
          <p className="tarjeta__descripcion">{descripcion}</p>
          <div className="tarjeta__precio">
            <span className="tarjeta__precio-valor">{formatoPrecio(precio)}</span>
            <span className={`tarjeta__precio-stock tarjeta__precio-stock--${estadoStockArticulo}`}>
              {textoStock(stock)}
            </span>
          </div>
          <span className="tarjeta__boton">
            {'Ver producto '}
            <span className="tarjeta__boton-flecha" aria-hidden="true">
              <IconoFlecha tamano={14} />
            </span>
          </span>
        </div>
      </Link>

      {mostrarCantidad && (
        <div className="tarjeta__cantidad">
          <button
            type="button"
            className="tarjeta__cantidad-boton"
            aria-label="Disminuir cantidad"
            disabled={cantidad <= 1}
            onClick={() => cambiarCantidad(cantidad - 1)}
          >
            −
          </button>
          <input
            className="tarjeta__cantidad-input"
            type="number"
            min="1"
            max={stock}
            value={cantidad}
            onChange={(evento) => cambiarCantidad(evento.target.value)}
          />
          <button
            type="button"
            className="tarjeta__cantidad-boton"
            aria-label="Aumentar cantidad"
            disabled={cantidad >= stock}
            onClick={() => cambiarCantidad(cantidad + 1)}
          >
            +
          </button>
          <button
            type="button"
            className="tarjeta__cantidad-agregar"
            disabled={agregando}
            onClick={confirmarAgregar}
          >
            {agregando ? 'Añadiendo…' : 'Añadir'}
          </button>
        </div>
      )}
    </article>
  )
}
