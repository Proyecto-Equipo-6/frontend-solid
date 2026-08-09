import { Link } from 'react-router-dom'
import { MARCA } from '../../../config/aplicacion'
import './Marca.css'

export default function Marca() {
  return (
    <Link to="/" className="marca" aria-label={MARCA.nombre}>
      <span className="marca__logo" aria-hidden="true">{MARCA.logotipo}</span>
      <span className="marca__nombre">{MARCA.nombre}</span>
    </Link>
  )
}
