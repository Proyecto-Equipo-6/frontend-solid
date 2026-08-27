import './Boton.css'

import { motion } from 'framer-motion'
import './Boton.css'

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
  return (
    <motion.button
      className={`boton boton--${variante} ${completo ? 'boton--completo' : ''} ${className || ''}`}
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
