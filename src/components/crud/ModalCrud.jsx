import { useEffect, useRef } from 'react'
import './Crud.css'

export default function ModalCrud({ abierto, titulo, onCerrar, children }) {
  const dialogoRef = useRef(null)

  useEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo) return undefined

    if (abierto && !dialogo.open) {
      dialogo.showModal()
    } else if (!abierto && dialogo.open) {
      dialogo.close()
    }
  }, [abierto])

  return (
    <dialog
      ref={dialogoRef}
      className="crud__modal"
      aria-label={titulo}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
      onCancel={(evento) => {
        evento.preventDefault()
        onCerrar()
      }}
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
    </dialog>
  )
}