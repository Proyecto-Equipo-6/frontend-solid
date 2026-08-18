import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoProveedor } from '@/components/ui/Iconos/Iconos'

export default function Proveedores() {
  return (
    <VistaGestion
      titulo="Proveedores"
      descripcion="Administra los proveedores y las condiciones de abastecimiento."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoProveedor tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerán los proveedores cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
