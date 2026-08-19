import Boton from '@/components/ui/Boton/Boton'
import './Crud.css'

export default function Confirmar({ titulo = '¿Confirmar acción?', mensaje, onConfirmar, onCancelar, cargando = false }) {
  return (
    <div className="crud__velo">
      <div
        className="crud__modal crud__modal--confirmar"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <h3 className="crud__modal-titulo">{titulo}</h3>
        <p className="crud__modal-texto">{mensaje}</p>
        <div className="crud__modal-acciones">
          <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </Boton>
          <Boton variante="primario" className="crud__boton-peligro" onClick={onConfirmar} cargando={cargando}>
            Confirmar
          </Boton>
        </div>
      </div>
    </div>
  )
}