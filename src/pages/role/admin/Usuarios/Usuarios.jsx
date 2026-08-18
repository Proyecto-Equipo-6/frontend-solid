import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoClientes } from '@/components/ui/Iconos/Iconos'

export default function Usuarios() {
  return (
    <VistaGestion
      titulo="Usuarios"
      descripcion="Gestiona los usuarios registrados en la plataforma: clientes, repartidores y administradores."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoClientes tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerá la lista de usuarios cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
