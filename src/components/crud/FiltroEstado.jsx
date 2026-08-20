import { IconoActivo, IconoInactivo } from '@/components/ui/Iconos/Iconos'

const OPCIONES_DEFECTO = [
  { clave: 'activos', etiqueta: 'Activos', icono: IconoActivo, clase: 'activo' },
  { clave: 'inactivos', etiqueta: 'Inactivos', icono: IconoInactivo, clase: 'inactivo' },
]

export default function FiltroEstado({ valor, onCambiar, conteos, opciones = OPCIONES_DEFECTO }) {
  return (
    <div className="crud__filtro" role="tablist" aria-label="Filtrar por estado">
      {opciones.map((opcion) => {
        const activo = valor === opcion.clave
        const Icono = opcion.icono
        const conteo = conteos?.[opcion.clave]
        return (
          <button
            key={opcion.clave}
            type="button"
            role="tab"
            aria-selected={activo}
            className={`crud__filtro-boton ${activo ? 'crud__filtro-boton--activo' : ''}`}
            onClick={() => onCambiar(opcion.clave)}
          >
            <span
              className={`crud__filtro-icono crud__filtro-icono--${opcion.clase} ${
                activo ? 'crud__filtro-icono--marcado' : ''
              }`}
              aria-hidden="true"
            >
              <Icono tamano={15} />
            </span>
            {opcion.etiqueta}
            {conteo !== undefined && <span className="crud__filtro-conteo">{conteo}</span>}
          </button>
        )
      })}
    </div>
  )
}