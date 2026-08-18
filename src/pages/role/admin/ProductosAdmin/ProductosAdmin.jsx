import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoPaquete } from '@/components/ui/Iconos/Iconos'

export default function ProductosAdmin() {
  return (
    <VistaGestion
      titulo="Productos"
      descripcion="Administra el catálogo: crea, edita y controla el stock de los productos."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoPaquete tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerá el catálogo completo cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
