import { Link } from 'react-router-dom'
import './Ayuda.css'

export default function Ayuda() {
  return (
    <section className="ayuda">
      <p className="ayuda__etiqueta">Centro de ayuda</p>
      <h1 className="ayuda__titulo">Ayuda / PQRS</h1>
      <p className="ayuda__texto">
        Esta es una vista temporal. Aquí se gestionarán peticiones, quejas, reclamos y
        sugerencias de los clientes.
      </p>
      <Link to="/" className="ayuda__boton">
        Volver al inicio
      </Link>
    </section>
  )
}