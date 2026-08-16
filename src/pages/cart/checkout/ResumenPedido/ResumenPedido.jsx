import { formatoPrecio } from '@/utils/formato'
import './ResumenPedido.css'

export default function ResumenPedido({ items, subtotal, envio, total, onEnvio }) {
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

      <div className="resumen-pedido__envio">
        <label htmlFor="envio">Envío:</label>
        <div className="resumen-pedido__select">
          <select
            id="envio"
            value={envio.id}
            onChange={(evento) => onEnvio(evento.target.value)}
            aria-label="Método de envío"
          >
            <option value="estandar">Estándar</option>
            <option value="express">Exprés (+{formatoPrecio(12000)})</option>
          </select>
          <svg
            className="resumen-pedido__select-flecha"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 5.25 7 8.75l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="resumen-pedido__detalle-fila">
        <span>Subtotal</span>
        <span>{formatoPrecio(subtotal)}</span>
      </div>

      <div className="resumen-pedido__detalle-fila">
        <span>Envío</span>
        <span>{envio.costo ? formatoPrecio(envio.costo) : 'Gratis'}</span>
      </div>

      <div className="resumen-pedido__total-fila">
        <span>Total</span>
        <strong>{formatoPrecio(total)}</strong>
      </div>
    </div>
  )
}