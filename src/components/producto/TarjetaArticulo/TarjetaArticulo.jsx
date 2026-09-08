import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconoFlecha, IconoCarrito, IconoActivo } from '@/components/ui/Iconos/Iconos'
import { agregarAlCarrito } from '@/services/carrito'
import { obtenerSesion } from '@/services/sesion'
import { formatoPrecio, estadoStock, textoStock } from '@/utils/formato'
import './TarjetaArticulo.css'

export default function TarjetaArticulo({ articulo }) {
  const { id, titulo, imagen, descripcion, categoria, precio, stock, garantia } = articulo
  const navigate = useNavigate()
  const [agregando, setAgregando] = useState(false)
  const [agregado, setAgregado] = useState(false)

  const estado = estadoStock(stock)

  async function handleAgregar(evento) {
    evento.preventDefault()
    evento.stopPropagation()
    if (!obtenerSesion()) {
      navigate('/login')
      return
    }
    if (estado === 'agotado') return
    setAgregando(true)
    try {
      await agregarAlCarrito(articulo, 1)
      setAgregado(true)
      setTimeout(() => setAgregado(false), 1200)
    } catch {
      // Sin feedback extra: el badge del carrito no se actualiza si falla.
    } finally {
      setAgregando(false)
    }
  }

  return (
    <Link
      className="tarjeta"
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
        {estado === 'agotado' && (
          <span className="tarjeta__sello tarjeta__sello--agotado">No disponible</span>
        )}
        {estado !== 'agotado' && (
          <button
            type="button"
            className="tarjeta__carrito"
            aria-label={`Agregar ${titulo} al carrito`}
            title="Agregar al carrito"
            disabled={agregando}
            onClick={handleAgregar}
          >
            <span className="tarjeta__carrito-icono">
              {agregado ? <IconoActivo tamano={16} /> : <IconoCarrito tamano={16} />}
            </span>
          </button>
        )}
      </div>
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__titulo">{titulo}</h3>
        <p className="tarjeta__descripcion">{descripcion}</p>
        <div className="tarjeta__precio">
          <span className="tarjeta__precio-valor">{formatoPrecio(precio)}</span>
          <span className={`tarjeta__precio-stock tarjeta__precio-stock--${estado}`}>{textoStock(stock)}</span>
        </div>
        <span className="tarjeta__garantia">Garantía: {garantia}</span>
        <span className="tarjeta__boton">
          {'Ver producto '}
          <span className="tarjeta__boton-flecha" aria-hidden="true">
            <IconoFlecha tamano={14} />
          </span>
        </span>
      </div>
    </Link>
  )
}