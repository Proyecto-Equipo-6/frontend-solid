import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconoActivo, IconoPaquete } from '@/components/ui/Iconos/Iconos'
import '../Checkout.css'

export default function ConfirmacionPedido({ pedido }) {
  const numeroPedido = pedido?.id_pedido
    ? `#${pedido.id_pedido}`
    : `#NEX-${Date.now().toString().slice(-6)}`

  return (
    <section className="checkout">
      <motion.div
        className="checkout__gracias"
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        <motion.span
          className="checkout__gracias-icono"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.15 }}
        >
          <IconoPaquete tamano={26} />
          <motion.span
            className="checkout__gracias-check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.45 }}
          >
            <IconoActivo tamano={14} />
          </motion.span>
        </motion.span>

        <motion.h1
          className="checkout__gracias-titulo"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
        >
          ¡Gracias por tu pedido!
        </motion.h1>

        <motion.p
          className="checkout__gracias-texto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35, ease: 'easeOut' }}
        >
          Tu número de pedido es <strong>{numeroPedido}</strong>. Te hemos enviado la
          confirmación por correo y te avisaremos cuando esté en camino.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.35, ease: 'easeOut' }}
        >
          <Link to="/mis-pedidos" className="checkout__accion">
            Ver mis pedidos
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}