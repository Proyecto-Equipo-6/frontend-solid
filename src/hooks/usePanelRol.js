import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cerrarSesion } from '@/services/api'
import { obtenerSesion, limpiarSesion } from '@/services/sesion'
import { ROLES } from '@/config/aplicacion'

export default function usePanelRol(rolEsperado, { accesoLibre = false } = {}) {
  const navigate = useNavigate()
  const [sesion] = useState(obtenerSesion)
  const [cerrando, setCerrando] = useState(false)
  const [error, setError] = useState('')

  const rol = sesion ? ROLES[sesion.id_rol] : null

  useEffect(() => {
    if (!sesion) {
      if (!accesoLibre) navigate('/login', { replace: true })
      return
    }
    if (sesion.id_rol !== rolEsperado) {
      navigate(rol?.panel ?? '/', { replace: true })
    }
  }, [sesion, rolEsperado, rol, navigate, accesoLibre])

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

  const autorizado = accesoLibre
    ? Boolean(!sesion || sesion.id_rol === rolEsperado)
    : Boolean(sesion && sesion.id_rol === rolEsperado)

  return { sesion, rol, autorizado, cerrando, error, handleCerrarSesion }
}
