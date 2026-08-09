import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Alerta from '../../components/ui/Alerta/Alerta'
import Boton from '../../components/ui/Boton/Boton'
import { getProductoPublico, formatoPrecio } from '../../servicios/productos'
import NoEncontrado from '../NoEncontrado/NoEncontrado'
import './ArticuloDetalle.css'

export default function ArticuloDetalle() {
  const { id } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState('')

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
        <Boton
          completo
          disabled={articulo.stock <= 0}
          onClick={() => setAviso('El carrito de compras estará disponible próximamente.')}
        >
          Agregar al carrito
        </Boton>
        {aviso && <Alerta variante="exito">{aviso}</Alerta>}
      </div>
    </div>
  )
}
