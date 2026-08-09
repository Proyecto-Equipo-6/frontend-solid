import { Link } from 'react-router-dom'
import Marca from '../../ui/Marca/Marca'
import './PiePagina.css'

export default function PiePagina() {
  return (
    <footer className="pie">
      <div className="pie__contenido">
        <div className="pie__fila">
          <div className="pie__marca">
            <Marca />
            <p className="pie__descripcion">
              Tu tienda en línea con productos verificados, precios justos y
              entrega segura en todo el país.
            </p>
          </div>

          <div className="pie__columna">
            <h3 className="pie__titulo">Navegación</h3>
            <Link className="pie__enlace" to="/#catalogo">Catálogo</Link>
          </div>
        </div>
        <p className="pie__copyright">
          © {new Date().getFullYear()} Nexbit. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
