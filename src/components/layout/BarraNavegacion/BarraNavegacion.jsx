import { useState } from 'react'
import { Link } from 'react-router-dom'
import Marca from '../../ui/Marca/Marca'
import './BarraNavegacion.css'

const ENLACES = [{ nombre: 'Catálogo', destino: '/#catalogo' }]

export default function BarraNavegacion() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="barra">
      <div className="barra__toolbar">
        <nav className="barra__izquierda" aria-label="Navegación principal">
          <Marca />
          <ul className="barra__enlaces">
            {ENLACES.map((enlace) => (
              <li key={enlace.nombre}>
                <Link to={enlace.destino} className="barra__enlace">
                  {enlace.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="barra__acciones">
          <Link to="/login" className="barra__boton barra__boton--texto">
            Iniciar sesión
          </Link>
          <Link to="/register" className="barra__boton barra__boton--relleno">
            Registrarse
          </Link>
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
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.nombre}
              to={enlace.destino}
              className="barra__enlace--panel"
              onClick={() => setMenuAbierto(false)}
            >
              {enlace.nombre}
            </Link>
          ))}
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
        </div>
      )}
    </header>
  )
}
