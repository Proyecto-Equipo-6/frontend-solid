import { useState } from 'react'
import { Link } from 'react-router-dom'
import Marca from '@/components/ui/Marca/Marca'
import { IconoCarrito } from '@/components/ui/Iconos/Iconos'
import { obtenerSesion } from '@/services/sesion'
import { NAVEGACION_PRINCIPAL } from '@/config/aplicacion'
import './BarraNavegacion.css'

export default function BarraNavegacion() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const sesion = obtenerSesion()

  return (
    <header className="barra">
      <div className="barra__toolbar">
        <nav className="barra__izquierda" aria-label="Navegación principal">
          <Marca />
          <ul className="barra__enlaces">
            {NAVEGACION_PRINCIPAL.map((enlace) => (
              <li key={enlace.nombre}>
                <Link to={enlace.destino} className="barra__enlace">
                  {enlace.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="barra__acciones">
          {sesion ? (
            <>
              <Link
                to="/carrito"
                className="barra__boton barra__boton--borde barra__boton--carrito"
              >
                <span className="barra__carrito-icono" aria-hidden="true">
                  <IconoCarrito tamano={18} />
                </span>
                Carrito
              </Link>
              <Link to="/perfil" className="barra__boton barra__boton--relleno">
                Mi perfil
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="barra__boton barra__boton--texto">
                Iniciar sesión
              </Link>
              <Link to="/register" className="barra__boton barra__boton--relleno">
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          className="barra__menu"
          type="button"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
      </div>

      {menuAbierto && (
        <div className="barra__panel">
          {NAVEGACION_PRINCIPAL.map((enlace) => (
            <Link
              key={enlace.nombre}
              to={enlace.destino}
              className="barra__enlace--panel"
              onClick={() => setMenuAbierto(false)}
            >
              {enlace.nombre}
            </Link>
          ))}
          {sesion ? (
            <>
              <Link
                to="/carrito"
                className="barra__boton barra__boton--borde barra__boton--carrito"
                onClick={() => setMenuAbierto(false)}
              >
                <span className="barra__carrito-icono" aria-hidden="true">
                  <IconoCarrito tamano={18} />
                </span>
                Carrito
              </Link>
              <Link
                to="/perfil"
                className="barra__boton barra__boton--relleno"
                onClick={() => setMenuAbierto(false)}
              >
                Mi perfil
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="barra__boton barra__boton--borde"
                onClick={() => setMenuAbierto(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="barra__boton barra__boton--relleno"
                onClick={() => setMenuAbierto(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
