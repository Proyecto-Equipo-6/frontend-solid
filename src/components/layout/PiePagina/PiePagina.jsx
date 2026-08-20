import { Link } from 'react-router-dom'
import Marca from '@/components/ui/Marca/Marca'
import { MARCA, NAVEGACION_PRINCIPAL } from '@/config/aplicacion'
import './PiePagina.css'

export default function PiePagina() {
  return (
    <footer className="pie">
      <div className="pie__contenido">
        <div className="pie__fila">
          <div className="pie__marca">
            <Marca cubo={false} />
            <p className="pie__descripcion">{MARCA.descripcion}</p>
          </div>

          <div className="pie__columna">
            <h3 className="pie__titulo">Navegación</h3>
            {NAVEGACION_PRINCIPAL.map((enlace) => (
              <Link key={enlace.nombre} className="pie__enlace" to={enlace.destino}>
                {enlace.nombre}
              </Link>
            ))}
          </div>

          <div className="pie__columna">
            <h3 className="pie__titulo">¿Necesitas ayuda?</h3>
            <p className="pie__texto">
              Cuéntanos tus dudas, quejas o reclamos y te responderemos lo antes posible.
            </p>
            <Link to="/ayuda" className="pie__boton">
              Ayuda / PQRS
            </Link>
          </div>
        </div>
        <p className="pie__copyright">
          © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
