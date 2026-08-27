import {
  IconoInicio,
  IconoPedido,
  IconoCerrarSesion,
} from '@/components/ui/Iconos/Iconos'
import BotonTema from '@/components/ui/BotonTema/BotonTema'
import { NAVEGACION_REPARTIDOR } from '@/config/repartidor'
import './BarraLateralRepartidor.css'

const ICONOS = {
  inicio: IconoInicio,
  historial: IconoPedido,
}

function ItemNavegacion({ item, activo, onNavegar }) {
  const Icono = ICONOS[item.icono] || IconoInicio
  return (
    <li>
      <button
        type="button"
        className={`barra-lat-rep__enlace ${activo ? 'barra-lat-rep__enlace--activo' : ''}`}
        onClick={() => onNavegar(item.clave)}
      >
        <span className="barra-lat-rep__enlace-icono">
          <Icono />
        </span>
        <span className="barra-lat-rep__enlace-texto">{item.nombre}</span>
      </button>
    </li>
  )
}

export default function BarraLateralRepartidor({ sesion, activo, onNavegar, onCerrarSesion, cerrando, abierto, onCerrar }) {
  const nombre = sesion?.nombre_apellido || 'Repartidor'
  const email = sesion?.email || ''
  const inicial = nombre.charAt(0).toUpperCase()

  return (
    <>
      {abierto && <button type="button" className="barra-lat-rep__velo" aria-label="Cerrar menú" onClick={onCerrar} />}
      <aside className={`barra-lat-rep ${abierto ? 'barra-lat-rep--abierta' : ''}`}>
        <nav className="barra-lat-rep__nav" aria-label="Navegación del repartidor">
          <ul className="barra-lat-rep__grupo">
            {NAVEGACION_REPARTIDOR.map((item) => (
              <ItemNavegacion
                key={item.clave}
                item={item}
                activo={activo === item.clave}
                onNavegar={(clave) => {
                  onNavegar(clave)
                  onCerrar()
                }}
              />
            ))}
          </ul>
        </nav>

        <div className="barra-lat-rep__pie">
          <div className="barra-lat-rep__tema">
            <BotonTema tamano={16} />
            <span className="barra-lat-rep__tema-texto">Modo claro / oscuro</span>
          </div>

          <button
            type="button"
            className="barra-lat-rep__cerrar"
            onClick={onCerrarSesion}
            disabled={cerrando}
          >
            <span className="barra-lat-rep__cerrar-icono" aria-hidden="true">
              <IconoCerrarSesion tamano={16} />
            </span>
            {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>

          <div className="barra-lat-rep__perfil">
            <span className="barra-lat-rep__avatar">{inicial}</span>
            <div className="barra-lat-rep__perfil-info">
              <span className="barra-lat-rep__perfil-nombre">{nombre}</span>
              {email && <span className="barra-lat-rep__perfil-correo">{email}</span>}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}