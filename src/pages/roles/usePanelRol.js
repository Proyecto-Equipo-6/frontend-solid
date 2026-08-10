import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cerrarSesion } from '../../servicios/api'
import { obtenerSesion, limpiarSesion } from '../../servicios/sesion'
import { ROLES } from '../../config/aplicacion'

export default function usePanelRol(rolEsperado) {
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

  const autorizado = Boolean(sesion && sesion.id_rol === rolEsperado)

  return { sesion, rol, autorizado, cerrando, error, handleCerrarSesion }
}
