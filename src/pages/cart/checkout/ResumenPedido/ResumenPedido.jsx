import { formatoPrecio } from '@/utils/formato'
import './ResumenPedido.css'

export default function ResumenPedido({ items, subtotal, total }) {
  const cantidadItems = items.reduce((suma, item) => suma + item.cantidad, 0)

  return (
    <div className="resumen-pedido">
      <p className="resumen-pedido__etiqueta">Total</p>
      <h2 className="resumen-pedido__total">{formatoPrecio(total)}</h2>

      <ul className="resumen-pedido__lista">
        {items.map((item) => (
          <li className="resumen-pedido__fila" key={item.id}>
            <div className="resumen-pedido__fila-info">
              <span className="resumen-pedido__fila-nombre">{item.titulo}</span>
              <span className="resumen-pedido__fila-detalle">
                {item.cantidad} × {formatoPrecio(item.precio)}
              </span>
            </div>
            <strong className="resumen-pedido__fila-precio">
              {formatoPrecio(item.precio * item.cantidad)}
            </strong>
          </li>
        ))}
      </ul>

      <div className="resumen-pedido__detalle-fila">
        <span>Artículos</span>
        <span>{cantidadItems}</span>
      </div>

      <div className="resumen-pedido__detalle-fila">
        <span>Subtotal</span>
        <span>{formatoPrecio(subtotal)}</span>
      </div>

      <div className="resumen-pedido__total-fila">
        <span>Total</span>
        <strong>{formatoPrecio(total)}</strong>
      </div>
    </div>
  )
}