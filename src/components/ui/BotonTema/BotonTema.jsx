import useTema from '@/hooks/useTema'
import { TEMA_OSCURO } from '@/services/tema'
import { IconoLuna, IconoSol } from '@/components/ui/Iconos/Iconos'
import './BotonTema.css'

export default function BotonTema({ tamano = 18 }) {
  const { tema, alternar } = useTema()
  const esOscuro = tema === TEMA_OSCURO
  const Icono = esOscuro ? IconoLuna : IconoSol
  const etiqueta = esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button
      type="button"
      className="boton-tema"
      aria-label={etiqueta}
      title={etiqueta}
      onClick={alternar}
    >
      <span className="boton-tema__icono" aria-hidden="true">
        <Icono tamano={tamano} />
      </span>
    </button>
  )
}