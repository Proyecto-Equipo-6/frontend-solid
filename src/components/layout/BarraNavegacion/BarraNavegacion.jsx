import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Marca from '@/components/ui/Marca/Marca'
import BotonTema from '@/components/ui/BotonTema/BotonTema'
import { IconoCarrito } from '@/components/ui/Iconos/Iconos'
import { obtenerSesion } from '@/services/sesion'
import { NAVEGACION_PRINCIPAL } from '@/config/aplicacion'
import './BarraNavegacion.css'

export default function BarraNavegacion() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [carritoMovido, setCarritoMovido] = useState(false)
  const sesion = obtenerSesion()
  const esCliente = Boolean(sesion && Number(sesion.id_rol) === 2)

  useEffect(() => {
    function manejarCarrito() {
      setCarritoMovido(true)
      window.setTimeout(() => setCarritoMovido(false), 700)
    }
    window.addEventListener('nexbit:carrito', manejarCarrito)
    return () => window.removeEventListener('nexbit:carrito', manejarCarrito)
  }, [])

  const claseCarrito = `barra__boton barra__boton--borde barra__boton--carrito${
    carritoMovido ? ' barra__boton--carrito-activo' : ''
  }`

  return (
    <header className="barra">
      <div className="barra__toolbar">
        <nav className="barra__izquierda" aria-label="Navegación principal">
          <Marca cubo={false} />
          <ul className="barra__enlaces">
            {NAVEGACION_PRINCIPAL.map((enlace) => (
              <li key={enlace.nombre}>
                <Link to={enlace.destino} className="barra__enlace">
                  {enlace.nombre}
                </Link>
              </li>
            ))}
            {esCliente && (
              <li>
                <Link to="/mis-pedidos" className="barra__enlace">
                  Mis pedidos
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="barra__acciones">
          <BotonTema tamano={16} />
          {sesion ? (
            <>
              <Link
                to="/carrito"
                className={claseCarrito}
              >
                <span className="barra__carrito-icono" aria-hidden="true">
                  <IconoCarrito tamano={18} />
                </span>{' '}Carrito
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
          <div className="barra__panel-tema">
            <BotonTema tamano={16} />
          </div>
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
          {esCliente && (
            <Link
              to="/mis-pedidos"
              className="barra__enlace--panel"
              onClick={() => setMenuAbierto(false)}
            >
              Mis pedidos
            </Link>
          )}
          {sesion ? (
            <>
              <Link
                to="/carrito"
                className={claseCarrito}
                onClick={() => setMenuAbierto(false)}
              >
                <span className="barra__carrito-icono" aria-hidden="true">
                  <IconoCarrito tamano={18} />
                </span>{' '}Carrito
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
