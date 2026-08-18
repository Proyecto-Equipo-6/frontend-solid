import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoRoles } from '@/components/ui/Iconos/Iconos'

export default function RolesAdmin() {
  return (
    <VistaGestion
      titulo="Roles"
      descripcion="Configura los roles y los permisos de acceso de cada perfil."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoRoles tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerán los roles y permisos cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
