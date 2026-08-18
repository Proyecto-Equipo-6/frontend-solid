import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import { IconoCategorias } from '@/components/ui/Iconos/Iconos'

export default function Categorias() {
  return (
    <VistaGestion
      titulo="Categorías"
      descripcion="Organiza los productos por categorías y subcategorías."
    >
      <div className="gestion__tarjeta">
        <span className="gestion__tarjeta-icono">
          <IconoCategorias tamano={40} />
        </span>
        <h3 className="gestion__tarjeta-titulo">Aún no hay registros</h3>
        <p className="gestion__tarjeta-texto">
          Aquí aparecerán las categorías cuando el módulo se conecte al backend.
        </p>
      </div>
    </VistaGestion>
  )
}
