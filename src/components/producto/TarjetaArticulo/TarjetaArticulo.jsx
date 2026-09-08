import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconoActivo, IconoFlecha } from '@/components/ui/Iconos/Iconos'
import Boton from '@/components/ui/Boton/Boton'
import { formatoPrecio, estadoStock, textoStock } from '@/utils/formato'
import { agregarAlCarrito } from '@/services/carrito'
import { obtenerSesion } from '@/services/sesion'
import './TarjetaArticulo.css'

export default function TarjetaArticulo({ articulo }) {
  const { id, titulo, imagen, descripcion, categoria, precio, stock, garantia, estado } = articulo
  const navigate = useNavigate()
  const [agregando, setAgregando] = useState(false)
  const [exito, setExito] = useState(false)

  const estadoStockArticulo = estadoStock(stock)
  const inactivo = Number(estado) === 0
  const agotado = inactivo || estadoStockArticulo === 'agotado'

  async function manejarAgregar(evento) {
    evento.preventDefault()
    evento.stopPropagation()
    if (agotado) return

    if (!obtenerSesion()) {
      navigate('/login')
      return
    }

    setAgregando(true)
    try {
      await agregarAlCarrito(articulo)
      setExito(true)
      window.setTimeout(() => setExito(false), 1800)
    } catch {
      setExito(false)
    } finally {
      setAgregando(false)
    }
  }

  const etiquetaBoton = agotado
    ? 'No disponible'
    : exito
      ? '¡Agregado!'
      : agregando
        ? 'Agregando…'
        : 'Añadir al carrito'

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
          <span className="tarjeta__garantia">Garantía: {garantia}</span>
          <span className="tarjeta__boton">
            {'Ver producto '}
            <span className="tarjeta__boton-flecha" aria-hidden="true">
              <IconoFlecha tamano={14} />
            </span>
          </span>
        </div>
      </Link>

      <motion.div
        className="tarjeta__accion"
        animate={exito ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Boton
          variante="carrito"
          completo
          disabled={agotado}
          cargando={agregando}
          className={exito ? 'boton--exito' : ''}
          onClick={manejarAgregar}
        >
          {exito && (
            <motion.span
              className="boton__check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
              <IconoActivo tamano={16} />
            </motion.span>
          )}
          {etiquetaBoton}
        </Boton>
      </motion.div>
    </article>
  )
}
