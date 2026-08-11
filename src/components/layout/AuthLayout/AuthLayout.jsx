import { Link } from 'react-router-dom'
import Boton from '@/components/ui/Boton/Boton'
import { GoogleIcon, FacebookIcon } from '@/components/ui/Iconos/Iconos'
import { MARCA, PROVEEDORES_SOCIALES } from '@/config/aplicacion'
import './AuthLayout.css'

const ICONOS_PROVEEDORES = {
  Google: <GoogleIcon />,
  Facebook: <FacebookIcon />,
}

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
        <Link to="/" className="auth__logo" aria-label={`${MARCA.nombre} — volver al inicio`}>
          {MARCA.logotipo}
        </Link>

        <h1 className="auth__titulo">{titulo}</h1>
        {subtitulo && <p className="auth__subtitulo">{subtitulo}</p>}

        {children}

        <div className="auth__divisor">o</div>
        <div className="auth__redes">
          {PROVEEDORES_SOCIALES.map((proveedor) => (
            <Boton key={proveedor} variante="secundario" completo>
              {ICONOS_PROVEEDORES[proveedor]} {accionRedes} {proveedor}
            </Boton>
          ))}
        </div>
      </div>
    </div>
  )
}
