import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoTicket } from '@/components/ui/Iconos/Iconos'

export default function Tickets() {
  return (
    <VistaGestion
      titulo="Tickets"
      descripcion="Revisa y responde los tickets de soporte de los usuarios."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoTicket tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerán los tickets de soporte cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
