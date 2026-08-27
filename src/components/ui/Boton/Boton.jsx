import { motion } from 'framer-motion'
import './Boton.css'

const CLASES_SEMANTICAS = {
  primario: 'accion-verde',
  carrito: 'accion-verde',
  peligro: 'accion-roja',
  cancelar: 'accion-roja',
}

export default function Boton({
  variante = 'primario',
  tipo = 'button',
  completo,
  cargando,
  disabled,
  children,
  className,
  ...rest
}) {
  const semantica = CLASES_SEMANTICAS[variante] || ''
  return (
    <motion.button
      className={`boton boton--${variante} ${semantica} ${completo ? 'boton--completo' : ''} ${className || ''}`}
      type={tipo}
      disabled={cargando || disabled}
      whileHover={disabled || cargando ? undefined : { scale: 1.02 }}
      whileTap={disabled || cargando ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}