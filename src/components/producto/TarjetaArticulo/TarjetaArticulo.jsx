import { Link } from 'react-router-dom'
import { formatoPrecio, estadoStock, textoStock } from '@/utils/formato'
import './TarjetaArticulo.css'

export default function TarjetaArticulo({ articulo }) {
  const { id, titulo, imagen, descripcion, categoria, precio, stock, garantia } = articulo

  const estado = estadoStock(stock)

  return (
    <article className="tarjeta">
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
      </div>
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__titulo">{titulo}</h3>
        <p className="tarjeta__descripcion">{descripcion}</p>
        <div className="tarjeta__precio">
          <span className="tarjeta__precio-valor">{formatoPrecio(precio)}</span>
          <span className="tarjeta__precio-stock">{textoStock(stock)}</span>
        </div>
        <span className="tarjeta__garantia">Garantía: {garantia}</span>
        <Link className="tarjeta__boton" to={`/articulo/${id}`}>
          Ver producto
        </Link>
      </div>
    </article>
  )
}
