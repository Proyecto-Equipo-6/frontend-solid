import { Link } from 'react-router-dom'
import BotonTema from '@/components/ui/BotonTema/BotonTema'
import TransicionVista from '@/components/ui/TransicionVista/TransicionVista'
import { MARCA } from '@/config/aplicacion'
import './AuthLayout.css'

export default function AuthLayout({
  titulo,
  subtitulo,
  ancho = 'medio',
  children,
}) {
  return (
    <div className="auth">
      <div className="auth__tema">
        <BotonTema tamano={16} />
      </div>
      <TransicionVista clave="auth" className="auth__contenido">
        <div className={`auth__tarjeta auth__tarjeta--${ancho}`}>
          <Link to="/" className="auth__logo" aria-label={`${MARCA.nombre} — volver al inicio`}>
            {MARCA.logotipo}
          </Link>

          <h1 className="auth__titulo">{titulo}</h1>
          {subtitulo && <p className="auth__subtitulo">{subtitulo}</p>}

          {children}
        </div>
      </TransicionVista>
    </div>
  )
}
