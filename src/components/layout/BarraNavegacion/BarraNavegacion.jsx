import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Marca from '@/components/ui/Marca/Marca'
import BotonTema from '@/components/ui/BotonTema/BotonTema'
import { IconoCarrito, IconoCategorias, IconoPedido, IconoUsuario } from '@/components/ui/Iconos/Iconos'
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
  const claseCarritoIcono = `barra__icono${carritoMovido ? ' barra__boton--carrito-activo' : ''}`

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

        <div className="barra__iconos">
          <Link
            to="/#catalogo"
            className="barra__icono"
            aria-label="Catálogo"
            title="Catálogo"
          >
            <IconoCategorias tamano={18} />
          </Link>
          {esCliente && (
            <Link
              to="/mis-pedidos"
              className="barra__icono"
              aria-label="Mis pedidos"
              title="Mis pedidos"
            >
              <IconoPedido tamano={18} />
            </Link>
          )}
          <BotonTema tamano={16} />
          {sesion && (
            <>
              <Link to="/carrito" className={claseCarritoIcono} aria-label="Carrito" title="Carrito">
                <span className="barra__carrito-icono" aria-hidden="true">
                  <IconoCarrito tamano={18} />
                </span>
              </Link>
              <Link to="/perfil" className="barra__icono" aria-label="Mi perfil" title="Mi perfil">
                <IconoUsuario tamano={18} />
              </Link>
            </>
          )}
        </div>

        {!sesion && (
          <button
            className="barra__menu"
            type="button"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            {menuAbierto ? '✕' : '☰'}
          </button>
        )}
      </div>

      {!sesion && menuAbierto && (
        <div className="barra__panel">
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
