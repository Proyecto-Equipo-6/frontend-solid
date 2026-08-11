import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alerta from '../../components/ui/Alerta/Alerta'
import Boton from '../../components/ui/Boton/Boton'
import Campo from '../../components/ui/Campo/Campo'
import { actualizarPerfil, obtenerPerfil } from '../../servicios/api'
import { obtenerSesion, guardarSesion } from '../../servicios/sesion'
import { esEmailValido, esTelefonoValido } from '../../servicios/validacion'
import './EditarPerfil.css'

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

export default function EditarPerfil() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [errorServidor, setErrorServidor] = useState('')
  const [exito, setExito] = useState('')
  const temporizador = useRef(null)

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
        setForm((prev) => ({
          ...prev,
          nombre_apellido: datos.nombre_apellido,
          email: datos.email,
          telefono: datos.telefono,
          direccion: datos.direccion,
        }))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
      clearTimeout(temporizador.current)
    }
  }, [navigate])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorServidor('')
    setExito('')

    const erroresCampos = validar(form)
    setErrores(erroresCampos)
    if (Object.keys(erroresCampos).length > 0) return

    setEnviando(true)
    try {
      const resultado = await actualizarPerfil(form)
      guardarSesion(resultado.perfil)
      setExito(resultado.mensaje)
      temporizador.current = setTimeout(() => navigate('/perfil'), 1500)
    } catch (error) {
      setErrorServidor(error.message)
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return <div className="editar-perfil editar-perfil--cargando">Cargando perfil…</div>
  }

  return (
    <section className="editar-perfil">
      <div className="editar-perfil__tarjeta">
        <p className="editar-perfil__etiqueta">Editar perfil</p>
        <h1 className="editar-perfil__titulo">{perfil?.nombre_apellido}</h1>

        {errorServidor && <Alerta variante="error">{errorServidor}</Alerta>}
        {exito && <Alerta variante="exito">{exito}</Alerta>}

        <form className="editar-perfil__form" onSubmit={handleSubmit} noValidate>
          <div className="editar-perfil__grid">
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
              autoComplete="email"
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
              etiqueta="Tipo de documento"
              id="tipo_documento"
              value={perfil?.tipo_documento ?? ''}
              readOnly
            />

            <Campo
              etiqueta="Número de documento"
              id="numero_documento"
              value={perfil?.numero_documento ?? ''}
              readOnly
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
              autoComplete="current-password"
              requerido
              error={errores.password}
            />
          </div>

          <p className="editar-perfil__nota">
            El documento de identidad no se puede modificar. El cambio de contraseña
            se gestiona en un flujo independiente.
          </p>

          <div className="editar-perfil__acciones">
            <Boton completo tipo="submit" cargando={enviando}>
              {enviando ? 'Guardando…' : 'Guardar cambios'}
            </Boton>
            <Boton completo variante="secundario" onClick={() => navigate('/perfil')}>
              Cancelar
            </Boton>
          </div>
        </form>
      </div>
    </section>
  )
}
