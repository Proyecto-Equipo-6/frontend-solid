import { Link } from 'react-router-dom'
import { formatoPrecio } from '../../../servicios/formato'
import './TarjetaArticulo.css'

export default function TarjetaArticulo({ articulo }) {
  const { id, titulo, imagen, descripcion, categoria, precio, stock, garantia } = articulo

  return (
    <article className="tarjeta">
      <div className="tarjeta__imagen">
        <img src={imagen} alt={titulo} />
        <span className="tarjeta__categoria">{categoria}</span>
      </div>
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__titulo">{titulo}</h3>
        <p className="tarjeta__descripcion">{descripcion}</p>
        <div className="tarjeta__precio">
          <span className="tarjeta__precio-valor">{formatoPrecio(precio)}</span>
          <span className="tarjeta__precio-stock">
            {stock > 0 ? `${stock} disponibles` : 'Agotado'}
          </span>
        </div>
        <span className="tarjeta__garantia">Garantía: {garantia}</span>
        <Link className="tarjeta__boton" to={`/articulo/${id}`}>
          Ver producto
        </Link>
      </div>
    </article>
  )
}
