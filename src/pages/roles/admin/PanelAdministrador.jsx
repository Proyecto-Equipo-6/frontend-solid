import Boton from '../../../components/ui/Boton/Boton'
import usePanelRol from '../usePanelRol'
import '../roles.css'
import './PanelAdministrador.css'

export default function PanelAdministrador() {
  const { sesion, rol, autorizado, cerrando, error, handleCerrarSesion } = usePanelRol(1)

  if (!autorizado) return null

  return (
    <div className="panel panel--admin">
      <p className="panel__etiqueta">Panel temporal</p>
      <h1 className="panel__titulo">Panel {rol?.nombre}</h1>
      <p className="panel__texto">Bienvenido(a), {sesion.nombre_apellido}</p>
      <p className="panel__texto">{sesion.email}</p>
      {error && <p className="panel__error">{error}</p>}
      <Boton cargando={cerrando} onClick={handleCerrarSesion}>
        {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </Boton>
    </div>
  )
}
