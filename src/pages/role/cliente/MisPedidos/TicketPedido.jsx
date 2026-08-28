import { formatoPrecio } from '@/utils/formato'

export default function TicketPedido({
  idPedido,
  fecha,
  estado,
  total,
  productos = [],
  cliente = 'Tú',
}) {
  const fechaCorta = fecha instanceof Date
    ? fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : String(fecha)
  const hora = fecha instanceof Date
    ? fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''

  return (
    <div className="mis-recibo">
      <div className="mis-recibo__comercio">NEXBIT</div>
      <div className="mis-recibo__linea">Lorem Ipsum, 23-10</div>
      <div className="mis-recibo__linea">Tel: 11223344</div>

      <div className="mis-recibo__sep" aria-hidden="true">- - - - - - - - - - - - - - - - - - - -</div>

      <div className="mis-recibo__fila">
        <span className="mis-recibo__label">Pedido</span>
        <span className="mis-recibo__valor">#{idPedido}</span>
      </div>
      <div className="mis-recibo__fila">
        <span className="mis-recibo__label">Fecha</span>
        <span className="mis-recibo__valor">{fechaCorta} {hora}</span>
      </div>
      <div className="mis-recibo__fila">
        <span className="mis-recibo__label">Cliente</span>
        <span className="mis-recibo__valor">{cliente}</span>
      </div>
      <div className="mis-recibo__fila">
        <span className="mis-recibo__label">Estado</span>
        <span className="mis-recibo__valor">{estado}</span>
      </div>

      <div className="mis-recibo__sep" aria-hidden="true">- - - - - - - - - - - - - - - - - - - -</div>

      {productos.map((producto) => (
        <div className="mis-recibo__item" key={producto.id_producto}>
          <div className="mis-recibo__item-fila">
            <span className="mis-recibo__item-nombre">{producto.nombre}</span>
            <span className="mis-recibo__item-subtotal">
              {formatoPrecio(Number(producto.subtotal))}
            </span>
          </div>
          <div className="mis-recibo__item-detalle">
            {producto.cantidad} x {formatoPrecio(Number(producto.precio_unitario))}
          </div>
        </div>
      ))}

      <div className="mis-recibo__sep" aria-hidden="true">- - - - - - - - - - - - - - - - - - - -</div>

      <div className="mis-recibo__fila mis-recibo__total">
        <span>TOTAL</span>
        <span>{formatoPrecio(total)}</span>
      </div>
      <div className="mis-recibo__fila">
        <span className="mis-recibo__label">Efectivo</span>
        <span className="mis-recibo__valor">{formatoPrecio(total)}</span>
      </div>
      <div className="mis-recibo__fila">
        <span className="mis-recibo__label">Cambio</span>
        <span className="mis-recibo__valor">{formatoPrecio(0)}</span>
      </div>

      <div className="mis-recibo__sep" aria-hidden="true">- - - - - - - - - - - - - - - - - - - -</div>

      <div className="mis-recibo__pie">Gracias por su compra</div>
      <div className="mis-recibo__pie">Nexbit - Sistema Comercial</div>
    </div>
  )
}