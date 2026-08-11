import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alerta from '../../components/ui/Alerta/Alerta'
import Boton from '../../components/ui/Boton/Boton'
import { obtenerPerfil, cerrarSesion } from '../../servicios/api'
import { obtenerSesion, guardarSesion, limpiarSesion } from '../../servicios/sesion'
import { ROLES } from '../../config/aplicacion'
import './Perfil.css'

const CAMPOS_PERFIL = [
  { etiqueta: 'Nombre completo', valor: (p) => p.nombre_apellido },
  { etiqueta: 'Correo electrónico', valor: (p) => p.email },
  { etiqueta: 'Tipo de documento', valor: (p) => p.tipo_documento },
  { etiqueta: 'Documento de identidad', valor: (p) => p.numero_documento },
  { etiqueta: 'Teléfono', valor: (p) => p.telefono },
  { etiqueta: 'Dirección', valor: (p) => p.direccion },
  { etiqueta: 'Rol', valor: (p) => (ROLES[p.id_rol] ? ROLES[p.id_rol].nombre : p.id_rol) },
]

function camposIncompletos(perfil) {
  return ['nombre_apellido', 'tipo_documento', 'numero_documento', 'telefono', 'direccion'].filter(
    (campo) => !perfil[campo],
  )
}

export default function Perfil() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [cerrando, setCerrando] = useState(false)

  useEffect(() => {
    let activo = true

    if (!obtenerSesion()) {
      navigate('/login', { replace: true })
      return
    }

    obtenerPerfil()
      .then((datos) => {
        if (!activo) return
        setPerfil(datos)
        guardarSesion(datos)
      })
      .catch((err) => {
        if (!activo) return
        if (err.status === 401) {
          limpiarSesion()
          navigate('/login', { replace: true })
        } else {
          setError('Error de conexión')
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [navigate])

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

  if (cargando) {
    return <div className="perfil perfil--cargando">Cargando perfil…</div>
  }

  if (!perfil) return null

  return (
    <section className="perfil">
      <div className="perfil__tarjeta">
        <p className="perfil__etiqueta">Mi perfil</p>
        <h1 className="perfil__titulo">{perfil.nombre_apellido}</h1>

        {error && <Alerta variante="error">{error}</Alerta>}
        {camposIncompletos(perfil).length > 0 && (
          <Alerta variante="exito">
            Tu perfil está incompleto. Completa tu información para una mejor experiencia.
          </Alerta>
        )}

        <dl className="perfil__lista">
          {CAMPOS_PERFIL.map(({ etiqueta, valor }) => (
            <div className="perfil__fila" key={etiqueta}>
              <dt className="perfil__fila-etiqueta">{etiqueta}</dt>
              <dd className="perfil__fila-valor">{valor(perfil)}</dd>
            </div>
          ))}
        </dl>

        <div className="perfil__acciones">
          <Boton completo onClick={() => navigate('/perfil/editar')}>
            Editar perfil
          </Boton>
          <Boton completo variante="secundario" cargando={cerrando} onClick={handleCerrarSesion}>
            {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Boton>
        </div>
      </div>
    </section>
  )
}
