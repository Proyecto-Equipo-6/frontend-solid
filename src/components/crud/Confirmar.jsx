import { useEffect, useRef } from 'react'
import Boton from '@/components/ui/Boton/Boton'
import './Crud.css'

export default function Confirmar({ titulo = '¿Confirmar acción?', mensaje, onConfirmar, onCancelar, cargando = false, mensajeError }) {
  const dialogoRef = useRef(null)

  useEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo) return undefined

    dialogo.showModal()
    return () => dialogo.close()
  }, [])

  useEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo) return undefined

    const manejarCancelar = (evento) => {
      evento.preventDefault()
      onCancelar()
    }
    dialogo.addEventListener('cancel', manejarCancelar)
    return () => dialogo.removeEventListener('cancel', manejarCancelar)
  }, [onCancelar])

  return (
    <dialog
      ref={dialogoRef}
      className="crud__modal crud__modal--confirmar"
      aria-label={titulo}
    >
      <h3 className="crud__modal-titulo">{titulo}</h3>
      <p className="crud__modal-texto">{mensaje}</p>
      {mensajeError && <p className="crud__alerta crud__alerta--error">{mensajeError}</p>}
      <div className="crud__modal-acciones">
        <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Boton>
        <Boton variante="primario" className="crud__boton-peligro" onClick={onConfirmar} cargando={cargando}>
          Confirmar
        </Boton>
      </div>
    </dialog>
  )
}
