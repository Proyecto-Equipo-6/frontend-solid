import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Alerta from '@/components/ui/Alerta/Alerta'
import Boton from '@/components/ui/Boton/Boton'
import { getProductoPublico } from '@/services/productos'
import { formatoPrecio, estadoStock, textoStock } from '@/utils/formato'
import { agregarAlCarrito } from '@/services/carrito'
import NoEncontrado from '@/pages/NoEncontrado/NoEncontrado'
import './ArticuloDetalle.css'

function FichaTecnica({ articulo }) {
  const filas = [
    ['Código del producto', articulo.sku],
    ['Categoría', articulo.categoria],
    ['Proveedor', articulo.proveedor],
    ['Disponibilidad', textoStock(articulo.stock)],
    ['Garantía', articulo.garantia],
  ]

  return (
    <dl className="detalle__ficha">
      {filas.map(([etiqueta, valor]) => (
        <div className="detalle__ficha-fila" key={etiqueta}>
          <dt className="detalle__ficha-etiqueta">{etiqueta}</dt>
          <dd className="detalle__ficha-valor">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function ArticuloDetalle() {
  const { id } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [agregando, setAgregando] = useState(false)
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

  async function handleAgregar() {
    setAviso(null)
    setAgregando(true)
    try {
      await agregarAlCarrito(articulo)
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

  function etiquetaBoton() {
    if (agregando) return 'Agregando…'
    if (agotado) return 'No disponible'
    return 'Agregar al carrito'
  }

  return (
    <div className="detalle">
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
        <p className="detalle__detalles">
          {textoStock(articulo.stock)} · Garantía: {articulo.garantia}
        </p>
        <Boton completo disabled={agotado} cargando={agregando} onClick={handleAgregar}>
          {etiquetaBoton()}
        </Boton>
        {aviso && <Alerta variante={aviso.variante}>{aviso.texto}</Alerta>}

        <div className="detalle__ficha-bloque">
          <h2 className="detalle__ficha-titulo">Ficha técnica</h2>
          <FichaTecnica articulo={articulo} />
        </div>
      </div>
    </div>
  )
}
