import {
  IconoInicio,
  IconoClientes,
  IconoPaquete,
  IconoCategorias,
  IconoPedido,
  IconoProveedor,
  IconoRepartidor,
  IconoRoles,
  IconoCerrarSesion,
} from '@/components/ui/Iconos/Iconos'
import BotonTema from '@/components/ui/BotonTema/BotonTema'
import { NAVEGACION_PRINCIPAL_DASHBOARD } from '@/config/dashboard'
import './BarraLateral.css'

const ICONOS = {
  inicio: IconoInicio,
  clientes: IconoClientes,
  paquete: IconoPaquete,
  categorias: IconoCategorias,
  pedido: IconoPedido,
  proveedor: IconoProveedor,
  repartidor: IconoRepartidor,
  roles: IconoRoles,
}

function ItemNavegacion({ item, activo, onNavegar }) {
  const Icono = ICONOS[item.icono] || IconoInicio
  return (
    <li>
      <button
        type="button"
        className={`barra-lat__enlace ${activo ? 'barra-lat__enlace--activo' : ''}`}
        onClick={() => onNavegar(item.clave)}
      >
        <span className="barra-lat__enlace-icono">
          <Icono />
        </span>
        <span className="barra-lat__enlace-texto">{item.nombre}</span>
      </button>
    </li>
  )
}

function Perfil({ sesion, onVerPerfil, onCerrar }) {
  const nombre = sesion?.nombre_apellido || 'Administrador'
  const email = sesion?.email || 'admin@nexbit.com'
  const inicial = nombre.charAt(0).toUpperCase()

  return (
    <button
      type="button"
      className="barra-lat__perfil"
      onClick={() => {
        onVerPerfil()
        onCerrar()
      }}
    >
      <span className="barra-lat__avatar">{inicial}</span>
      <div className="barra-lat__perfil-info">
        <span className="barra-lat__perfil-nombre">{nombre}</span>
        <span className="barra-lat__perfil-correo">{email}</span>
        <span className="barra-lat__perfil-editar">Modificar perfil</span>
      </div>
    </button>
  )
}

export default function BarraLateral({ sesion, activo, onNavegar, onVerPerfil, onCerrarSesion, cerrando, abierto, onCerrar }) {
  return (
    <>
      {abierto && <button type="button" className="barra-lat__velo" aria-label="Cerrar menú" onClick={onCerrar} />}
      <aside className={`barra-lat ${abierto ? 'barra-lat--abierta' : ''}`}>
        <nav className="barra-lat__nav" aria-label="Navegación del panel">
          <ul className="barra-lat__grupo">
            {NAVEGACION_PRINCIPAL_DASHBOARD.map((item) => (
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

        <div className="barra-lat__pie">
          <div className="barra-lat__tema">
            <BotonTema tamano={16} />
            <span className="barra-lat__tema-texto">Modo claro / oscuro</span>
          </div>

          <button
            type="button"
            className="barra-lat__cerrar"
            onClick={onCerrarSesion}
            disabled={cerrando}
          >
            <span className="barra-lat__cerrar-icono" aria-hidden="true">
              <IconoCerrarSesion tamano={16} />
            </span>
            {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>

          <Perfil sesion={sesion} onVerPerfil={onVerPerfil} onCerrar={onCerrar} />
        </div>
      </aside>
    </>
  )
}