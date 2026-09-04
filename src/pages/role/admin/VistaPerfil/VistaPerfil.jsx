import { useEffect, useState } from 'react'
import { obtenerPerfil, actualizarPerfil } from '@/services/api'
import { guardarSesion } from '@/services/sesion'
import { ROLES } from '@/config/aplicacion'
import { esEmailValido, esTelefonoValido } from '@/utils/validacion'
import './VistaPerfil.css'

const CAMPOS_PERFIL = [
  { etiqueta: 'Nombre completo', valor: (p) => p.nombre_apellido },
  { etiqueta: 'Correo electrónico', valor: (p) => p.email },
  { etiqueta: 'Tipo de documento', valor: (p) => p.tipo_documento },
  { etiqueta: 'Documento de identidad', valor: (p) => p.numero_documento },
  { etiqueta: 'Teléfono', valor: (p) => p.telefono },
  { etiqueta: 'Dirección', valor: (p) => p.direccion },
  { etiqueta: 'Rol', valor: (p) => (ROLES[p.id_rol] ? ROLES[p.id_rol].nombre : p.id_rol) },
]

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
  }

  if (!form.password) {
    errores.password = 'Ingresa tu contraseña actual para confirmar los cambios.'
  }

  return errores
}

export default function VistaPerfil({ sesion, onVolver }) {
  const [perfil, setPerfil] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    if (!sesion) {
      setError('Inicia sesión para ver tu perfil.')
      setCargando(false)
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
          setError('Tu sesión expiró. Inicia sesión nuevamente.')
        } else {
          setError('Error de conexión al cargar tu perfil.')
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [sesion])

  function iniciarEdicion() {
    if (!perfil) return
    setForm({
      nombre_apellido: perfil.nombre_apellido,
      email: perfil.email,
      telefono: perfil.telefono,
      direccion: perfil.direccion,
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

  if (cargando) {
    return <p className="dashboard__cargando">Cargando perfil…</p>
  }

  return (
    <section className="vista-perfil">
      <div className="vista-perfil__tarjeta">
        <p className="vista-perfil__etiqueta">Mi perfil</p>
        <h1 className="vista-perfil__titulo">{perfil?.nombre_apellido || sesion?.nombre_apellido || 'Administrador'}</h1>

        {mensaje && <p className="vista-perfil__alerta vista-perfil__alerta--exito">{mensaje}</p>}
        {error && <p className="vista-perfil__alerta vista-perfil__alerta--error">{error}</p>}

        {editando && perfil ? (
          <form className="vista-perfil__form" onSubmit={handleSubmit} noValidate>
            <div className="vista-perfil__grid">
              {[
                { nombre: 'nombre_apellido', etiqueta: 'Nombre completo', tipo: 'text', requerido: true, placeholder: 'Ej: Juan Pérez' },
                { nombre: 'email', etiqueta: 'Correo electrónico', tipo: 'email', requerido: true, placeholder: 'ejemplo@correo.com' },
                { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', requerido: true, placeholder: 'Ej: 3001234567', max: 10 },
                { nombre: 'direccion', etiqueta: 'Dirección', tipo: 'text', requerido: true, placeholder: 'Ej: Calle 10 # 5-20, Medellín' },
              ].map((campo) => (
                <div className="vista-perfil__campo" key={campo.nombre}>
                  <label className="vista-perfil__etiqueta-campo" htmlFor={`perfil-${campo.nombre}`}>
                    {campo.etiqueta}
                  </label>
                  <input
                    id={`perfil-${campo.nombre}`}
                    className="vista-perfil__input"
                    type={campo.tipo}
                    name={campo.nombre}
                    value={form[campo.nombre]}
                    onChange={handleChange}
                    placeholder={campo.placeholder}
                    inputMode={campo.nombre === 'telefono' ? 'numeric' : undefined}
                    maxLength={campo.max}
                    required={campo.requerido}
                  />
                  {errores[campo.nombre] && (
                    <span className="vista-perfil__error">{errores[campo.nombre]}</span>
                  )}
                </div>
              ))}

              <div className="vista-perfil__campo">
                <label className="vista-perfil__etiqueta-campo" htmlFor="perfil-password">
                  Contraseña actual
                </label>
                <input
                  id="perfil-password"
                  className="vista-perfil__input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña para confirmar"
                  autoComplete="new-password"
                  required
                />
                {errores.password && <span className="vista-perfil__error">{errores.password}</span>}
              </div>
            </div>

            <p className="vista-perfil__nota">
              El documento de identidad no se puede modificar. El cambio de contraseña se gestiona en un flujo independiente.
            </p>

            <div className="vista-perfil__acciones">
              <button type="submit" className="vista-perfil__boton" disabled={enviando}>
                {enviando ? 'Guardando…' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                className="vista-perfil__boton vista-perfil__boton--secundario"
                onClick={() => {
                  setEditando(false)
                  setError('')
                  setMensaje('')
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            {perfil && (
              <dl className="vista-perfil__lista">
                {CAMPOS_PERFIL.map(({ etiqueta, valor }) => (
                  <div className="vista-perfil__fila" key={etiqueta}>
                    <dt className="vista-perfil__fila-etiqueta">{etiqueta}</dt>
                    <dd className="vista-perfil__fila-valor">{valor(perfil)}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="vista-perfil__acciones">
              {perfil && (
                <button type="button" className="vista-perfil__boton" onClick={iniciarEdicion}>
                  Modificar perfil
                </button>
              )}
              <button type="button" className="vista-perfil__boton vista-perfil__boton--secundario" onClick={onVolver}>
                Volver al inicio
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}