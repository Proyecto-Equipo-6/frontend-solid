import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../components/ui/Boton/Boton'
import { cerrarSesion } from '../../servicios/api'
import { obtenerSesion, limpiarSesion } from '../../servicios/sesion'
import { ROLES } from '../../config/aplicacion'
import './PanelRol.css'

export default function PanelRol({ rolEsperado }) {
  const navigate = useNavigate()
  const [sesion] = useState(obtenerSesion)
  const [cerrando, setCerrando] = useState(false)
  const [error, setError] = useState('')

  const rol = sesion ? ROLES[sesion.id_rol] : null

  useEffect(() => {
    if (!sesion) {
      navigate('/login', { replace: true })
      return
    }
    if (sesion.id_rol !== rolEsperado) {
      navigate(rol?.panel ?? '/', { replace: true })
    }
  }, [sesion, rolEsperado, rol, navigate])

  async function handleCerrarSesion() {
    setCerrando(true)
    setError('')
    try {
      await cerrarSesion()
    } catch {
      setError('No se pudo cerrar la sesión en el servidor.')
    } finally {
      limpiarSesion()
      navigate('/', { replace: true })
    }
  }

  if (!sesion || sesion.id_rol !== rolEsperado) return null

  return (
    <div className="panel">
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
