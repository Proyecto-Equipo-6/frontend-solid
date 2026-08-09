import './Boton.css'

export default function Boton({
  variante = 'primario',
  tipo = 'button',
  completo,
  cargando,
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      className={`boton boton--${variante} ${completo ? 'boton--completo' : ''}`}
      type={tipo}
      disabled={cargando || disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
