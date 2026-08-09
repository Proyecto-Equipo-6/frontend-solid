import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Alerta from '../../components/ui/Alerta/Alerta'
import Boton from '../../components/ui/Boton/Boton'
import { getProductoPublico } from '../../servicios/productos'
import { formatoPrecio } from '../../servicios/formato'
import { agregarAlCarrito } from '../../servicios/carrito'
import NoEncontrado from '../NoEncontrado/NoEncontrado'
import './ArticuloDetalle.css'

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
      await agregarAlCarrito(articulo.id)
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

  return (
    <div className="detalle">
      <div className="detalle__imagen">
        <img src={articulo.imagen} alt={articulo.titulo} />
      </div>

      <div className="detalle__cuerpo">
        <span className="detalle__categoria">{articulo.categoria}</span>
        <h1 className="detalle__titulo">{articulo.titulo}</h1>
        <p className="detalle__descripcion">{articulo.descripcion}</p>
        <p className="detalle__precio">{formatoPrecio(articulo.precio)}</p>
        <p className="detalle__detalles">
          {articulo.stock > 0 ? `${articulo.stock} disponibles` : 'Agotado'} · Garantía:{' '}
          {articulo.garantia}
        </p>
        <Boton completo disabled={articulo.stock <= 0} cargando={agregando} onClick={handleAgregar}>
          {agregando ? 'Agregando…' : 'Agregar al carrito'}
        </Boton>
        {aviso && <Alerta variante={aviso.variante}>{aviso.texto}</Alerta>}
      </div>
    </div>
  )
}
