import { Link } from 'react-router-dom'
import Boton from '../../ui/Boton/Boton'
import { GoogleIcon, FacebookIcon } from '../../ui/Iconos/Iconos'
import './AuthLayout.css'

const PROVEEDORES = [
  { nombre: 'Google', icono: <GoogleIcon /> },
  { nombre: 'Facebook', icono: <FacebookIcon /> },
]

export default function AuthLayout({
  titulo,
  subtitulo,
  ancho = 'medio',
  accionRedes = 'Continuar con',
  children,
}) {
  return (
    <div className="auth">
      <div className={`auth__tarjeta auth__tarjeta--${ancho}`}>
        <Link to="/" className="auth__logo" aria-label="Nexbit — volver al inicio">
          Nx
        </Link>

        <h1 className="auth__titulo">{titulo}</h1>
        {subtitulo && <p className="auth__subtitulo">{subtitulo}</p>}

        {children}

        <div className="auth__divisor">o</div>
        <div className="auth__redes">
          {PROVEEDORES.map((proveedor) => (
            <Boton key={proveedor.nombre} variante="secundario" completo>
              {proveedor.icono} {accionRedes} {proveedor.nombre}
            </Boton>
          ))}
        </div>
      </div>
    </div>
  )
}
