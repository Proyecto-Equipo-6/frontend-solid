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

  useEffect(() => {
    if (!abierto) return undefined

    const manejarClic = (evento) => {
      const dialogo = dialogoRef.current
      if (dialogo && evento.target === dialogo) onCerrar()
    }
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }

    document.addEventListener('click', manejarClic)
    document.addEventListener('keydown', manejarTecla)
    return () => {
      document.removeEventListener('click', manejarClic)
      document.removeEventListener('keydown', manejarTecla)
    }
  }, [abierto, onCerrar])

  return (
    <dialog ref={dialogoRef} className="crud__modal" aria-label={titulo}>
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