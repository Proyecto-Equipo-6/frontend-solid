import './Campo.css'

export default function Campo({
  etiqueta,
  error,
  requerido,
  completo,
  as: Etiqueta = 'input',
  id,
  name,
  children,
  ...rest
}) {
  return (
    <div className={`campo ${completo ? 'campo--completo' : ''}`}>
      <label className="campo__etiqueta" htmlFor={id || name}>
        {etiqueta}
        {requerido && <span className="campo__obligatorio" aria-hidden="true">*</span>}
      </label>
      <Etiqueta
        className={`campo__control ${error ? 'campo__control--error' : ''}`}
        id={id}
        name={name}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      >
        {children}
      </Etiqueta>
      {error && <p className="campo__ayuda" role="alert">{error}</p>}
    </div>
  )
}
