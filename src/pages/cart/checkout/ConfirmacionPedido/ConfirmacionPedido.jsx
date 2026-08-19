import { Link } from 'react-router-dom'
import { IconoPaquete } from '@/components/ui/Iconos/Iconos'
import '../Checkout.css'

export default function ConfirmacionPedido({ pedido }) {
  const numeroPedido = pedido?.id_pedido
    ? `#${pedido.id_pedido}`
    : `#NEX-${Date.now().toString().slice(-6)}`

  return (
    <section className="checkout">
      <div className="checkout__gracias">
        <span className="checkout__gracias-icono" aria-hidden="true">
          <IconoPaquete tamano={26} />
        </span>
        <h1 className="checkout__gracias-titulo">¡Gracias por tu pedido!</h1>
        <p className="checkout__gracias-texto">
          Tu número de pedido es <strong>{numeroPedido}</strong>. Te hemos enviado la
          confirmación por correo y te avisaremos cuando esté en camino.
        </p>
        <Link to="/mis-pedidos" className="checkout__accion">
          Ver mis pedidos
        </Link>
      </div>
    </section>
  )
}
