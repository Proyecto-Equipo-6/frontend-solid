import './Alerta.css'

export default function Alerta({ variante = 'error', children }) {
  return (
    <p
      className={`alerta alerta--${variante}`}
      role={variante === 'exito' ? 'status' : 'alert'}
    >
      {children}
    </p>
  )
}
