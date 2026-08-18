import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoRepartidor } from '@/components/ui/Iconos/Iconos'

export default function RepartidoresAdmin() {
  return (
    <VistaGestion
      titulo="Repartidores"
      descripcion="Gestiona a los repartidores y su disponibilidad para entregas."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoRepartidor tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerán los repartidores cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
