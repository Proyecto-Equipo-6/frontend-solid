import { useEffect } from 'react'
import './Crud.css'

export default function ModalCrud({ abierto, titulo, onCerrar, children }) {
  useEffect(() => {
    if (!abierto) return undefined
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', manejarTecla)
    return () => document.removeEventListener('keydown', manejarTecla)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="crud__velo" onClick={onCerrar}>
      <div
        className="crud__modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="crud__modal-cabecera">
          <h3 className="crud__modal-titulo">{titulo}</h3>
          <button
            type="button"
            className="crud__modal-cerrar"
            aria-label="Cerrar"
            onClick={onCerrar}
          >
            ×
          </button>
        </div>
        <div className="crud__modal-cuerpo">{children}</div>
      </div>
    </div>
  )
}