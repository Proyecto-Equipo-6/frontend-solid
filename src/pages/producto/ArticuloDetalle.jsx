import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Alerta from '@/components/ui/Alerta/Alerta'
import Boton from '@/components/ui/Boton/Boton'
import { IconoActivo, IconoAtras } from '@/components/ui/Iconos/Iconos'
import { getProductoPublico } from '@/services/productos'
import { formatoPrecio, estadoStock, textoStock } from '@/utils/formato'
import { agregarAlCarrito } from '@/services/carrito'
import NoEncontrado from '@/pages/NoEncontrado/NoEncontrado'
import './ArticuloDetalle.css'

const EnlaceAtras = motion(Link)

function FichaTecnica({ articulo }) {
  const estado = estadoStock(articulo.stock)
  const filas = [
    ['Código del producto', articulo.sku],
    ['Categoría', articulo.categoria],
    ['Proveedor', articulo.proveedor],
    ['Disponibilidad', textoStock(articulo.stock)],
    ['Garantía', articulo.garantia],
  ]

  return (
    <dl className="detalle__ficha">
      {filas.map(([etiqueta, valor]) => {
        const claseDisponibilidad =
          etiqueta === 'Disponibilidad' ? ` detalle__ficha-valor--${estado}` : ''
        return (
          <div className="detalle__ficha-fila" key={etiqueta}>
            <dt className="detalle__ficha-etiqueta">{etiqueta}</dt>
            <dd className={`detalle__ficha-valor${claseDisponibilidad}`}>{valor}</dd>
          </div>
        )
      })}
    </dl>
  )
}

export default function ArticuloDetalle() {
  const { id } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [agregando, setAgregando] = useState(false)
  const [exito, setExito] = useState(false)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    getProductoPublico(id)
      .then((producto) => {
        if (activo) setArticulo(producto)
      })
      .catch(() => {
        if (activo) setArticulo(null)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  useEffect(() => {
    if (!exito) return undefined
    const temporizador = setTimeout(() => setExito(false), 1800)
    return () => clearTimeout(temporizador)
  }, [exito])

  async function handleAgregar() {
    setAviso(null)
    setAgregando(true)
    try {
      await agregarAlCarrito(articulo)
      setExito(true)
      setAviso({ variante: 'exito', texto: 'Producto agregado al carrito.' })
    } catch {
      setAviso({
        variante: 'error',
        texto: 'No se pudo agregar el producto. Inténtalo de nuevo.',
      })
    } finally {
      setAgregando(false)
    }
  }

  if (cargando) {
    return <div className="detalle detalle--cargando">Cargando producto…</div>
  }

  if (!articulo) {
    return <NoEncontrado />
  }

  const agotado = estadoStock(articulo.stock) === 'agotado'
  const estado = estadoStock(articulo.stock)

  function etiquetaBoton() {
    if (agregando) return 'Agregando…'
    if (exito) return '¡Agregado!'
    if (agotado) return 'No disponible'
    return 'Agregar al carrito'
  }

  return (
    <div className="detalle">
      <div className="detalle__cabecera">
        <EnlaceAtras
          to="/#catalogo"
          className="detalle__atras"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <span className="detalle__atras-icono" aria-hidden="true">
            <IconoAtras tamano={16} />
          </span>
          {' Volver al catálogo'}
        </EnlaceAtras>
      </div>

      <div className="detalle__imagen">
        {articulo.imagen ? (
          <img src={articulo.imagen} alt={articulo.titulo} />
        ) : (
          <div className="detalle__imagen-vacia">Nexbit</div>
        )}
      </div>

      <div className="detalle__cuerpo">
        <span className="detalle__categoria">{articulo.categoria}</span>
        <h1 className="detalle__titulo">{articulo.titulo}</h1>
        <p className="detalle__descripcion">{articulo.descripcion}</p>
        <p className="detalle__precio">{formatoPrecio(articulo.precio)}</p>
        <p className={`detalle__detalles detalle__detalles--${estado}`}>
          {textoStock(articulo.stock)} · Garantía: {articulo.garantia}
        </p>
        <motion.div
          animate={exito ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Boton
            variante="carrito"
            completo
            disabled={agotado}
            cargando={agregando}
            className={exito ? 'boton--exito' : ''}
            onClick={handleAgregar}
          >
            {exito ? (
              <>
                <motion.span
                  className="boton__check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                >
                  <IconoActivo tamano={16} />
                </motion.span>
                {etiquetaBoton()}
              </>
            ) : (
              etiquetaBoton()
            )}
          </Boton>
        </motion.div>
        {aviso && <Alerta variante={aviso.variante}>{aviso.texto}</Alerta>}

        <div className="detalle__ficha-bloque">
          <h2 className="detalle__ficha-titulo">Ficha técnica</h2>
          <FichaTecnica articulo={articulo} />
        </div>
      </div>
    </div>
  )
}
