import { Link } from 'react-router-dom'
import './Marca.css'

export default function Marca() {
  return (
    <Link to="/" className="marca" aria-label="Nexbit">
      <span className="marca__logo" aria-hidden="true">Nx</span>
      <span className="marca__nombre">Nexbit</span>
    </Link>
  )
}
