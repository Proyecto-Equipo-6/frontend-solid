import { Link } from 'react-router-dom'
import './NoEncontrado.css'

export default function NoEncontrado() {
  return (
    <div className="no-encontrado">
      <p className="no-encontrado__codigo">404</p>
      <h1 className="no-encontrado__titulo">Página no encontrada</h1>
      <p className="no-encontrado__texto">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="no-encontrado__boton">Volver al inicio</Link>
    </div>
  )
}
