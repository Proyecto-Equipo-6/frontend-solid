import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alerta from '@/components/ui/Alerta/Alerta'
import Boton from '@/components/ui/Boton/Boton'
import Campo from '@/components/ui/Campo/Campo'
import { obtenerPerfil, cerrarSesion, actualizarPerfil } from '@/services/api'
import { obtenerSesion, guardarSesion, limpiarSesion } from '@/services/sesion'
import { esDireccionValida, esEmailValido, esNombreValido, esTelefonoValido } from '@/utils/validacion'
import { ROLES } from '@/config/aplicacion'
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

const INICIAL = {
  nombre_apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  password: '',
}

function validar(form) {
  const errores = {}

  if (!form.nombre_apellido.trim()) {
    errores.nombre_apellido = 'El nombre es obligatorio.'
  } else if (!esNombreValido(form.nombre_apellido)) {
    errores.nombre_apellido = 'Ingresa tu nombre y apellido (solo letras).'
  }

  if (!esEmailValido(form.email)) {
    errores.email = 'Ingresa un correo electrónico válido.'
  }

  if (!form.telefono.trim()) {
    errores.telefono = 'El teléfono es obligatorio.'
  } else if (!esTelefonoValido(form.telefono)) {
    errores.telefono = 'El teléfono debe tener exactamente 10 dígitos.'
  }

  if (!form.direccion.trim()) {
    errores.direccion = 'La dirección es obligatoria.'
  } else if (!esDireccionValida(form.direccion)) {
    errores.direccion = 'Ingresa una dirección válida (ej: Calle 10 # 5-20, Medellín).'
  }

  if (!form.password) {
    errores.password = 'Ingresa tu contraseña actual para confirmar los cambios.'
  }

  return errores
}

export default function Perfil() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
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

  function iniciarEdicion() {
    if (!perfil) return
    setForm({
      nombre_apellido: perfil.nombre_apellido || '',
      email: perfil.email || '',
      telefono: perfil.telefono || '',
      direccion: perfil.direccion || '',
      password: '',
    })
    setErrores({})
    setMensaje('')
    setError('')
    setEditando(true)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMensaje('')
    setError('')

    const erroresCampos = validar(form)
    setErrores(erroresCampos)
    if (Object.keys(erroresCampos).length > 0) return

    setEnviando(true)
    try {
      const resultado = await actualizarPerfil(form)
      guardarSesion(resultado.perfil)
      setPerfil(resultado.perfil)
      setMensaje(resultado.mensaje)
      setEditando(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

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
        {mensaje && <Alerta variante="exito">{mensaje}</Alerta>}
        {camposIncompletos(perfil).length > 0 && !editando && (
          <Alerta variante="exito">
            Tu perfil está incompleto. Completa tu información para una mejor experiencia.
          </Alerta>
        )}

        {editando ? (
          <form className="perfil__form" onSubmit={handleSubmit} noValidate>
            <div className="perfil__grid">
              <Campo
                completo
                etiqueta="Nombre completo"
                id="nombre_apellido"
                name="nombre_apellido"
                value={form.nombre_apellido}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                requerido
                error={errores.nombre_apellido}
              />
              <Campo
                completo
                etiqueta="Correo electrónico"
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                autoComplete="off"
                requerido
                error={errores.email}
              />
              <Campo
                etiqueta="Teléfono"
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
                inputMode="numeric"
                maxLength={10}
                requerido
                error={errores.telefono}
              />
              <Campo
                completo
                etiqueta="Dirección"
                id="direccion"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle 10 # 5-20, Medellín"
                requerido
                error={errores.direccion}
              />
              <Campo
                completo
                etiqueta="Contraseña actual"
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña para confirmar"
                autoComplete="new-password"
                requerido
                error={errores.password}
              />
            </div>

            <p className="perfil__nota">
              El documento de identidad no se puede modificar. El cambio de contraseña
              se gestiona en un flujo independiente.
            </p>

            <div className="perfil__acciones">
              <Boton completo tipo="submit" cargando={enviando}>
                {enviando ? 'Guardando…' : 'Guardar cambios'}
              </Boton>
              <Boton completo variante="secundario" onClick={() => setEditando(false)}>
                Cancelar
              </Boton>
            </div>
          </form>
        ) : (
          <>
            <dl className="perfil__lista">
              {CAMPOS_PERFIL.map(({ etiqueta, valor }) => (
                <div className="perfil__fila" key={etiqueta}>
                  <dt className="perfil__fila-etiqueta">{etiqueta}</dt>
                  <dd className="perfil__fila-valor">{valor(perfil)}</dd>
                </div>
              ))}
            </dl>

            <div className="perfil__acciones">
              <Boton completo onClick={iniciarEdicion}>
                Editar perfil
              </Boton>
              <Boton completo variante="secundario" cargando={cerrando} onClick={handleCerrarSesion}>
                {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </Boton>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
