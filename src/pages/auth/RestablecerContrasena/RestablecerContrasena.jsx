import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../../components/layout/AuthLayout/AuthLayout'
import Alerta from '../../../components/ui/Alerta/Alerta'
import Boton from '../../../components/ui/Boton/Boton'
import Campo from '../../../components/ui/Campo/Campo'
import { restablecerContrasena } from '../../../servicios/api'
import { esPasswordValida } from '../../../servicios/validacion'
import './RestablecerContrasena.css'

const INICIAL = { nueva_password: '', confirmar_password: '' }

export default function RestablecerContrasena() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)
  const temporizador = useRef(null)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
  }

  function validar() {
    const siguientes = {}

    if (!esPasswordValida(form.nueva_password)) {
      siguientes.nueva_password = 'La contraseña debe tener entre 4 y 8 caracteres.'
    }

    if (!form.confirmar_password) {
      siguientes.confirmar_password = 'Confirma tu nueva contraseña.'
    } else if (form.confirmar_password !== form.nueva_password) {
      siguientes.confirmar_password = 'Las contraseñas no coinciden.'
    }

    setErrores(siguientes)
    return Object.keys(siguientes).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorServidor('')
    setExito('')

    if (!validar()) return

    setEnviando(true)
    try {
      const respuesta = await restablecerContrasena({
        token,
        nueva_password: form.nueva_password,
      })
      setExito(respuesta.mensaje)
      temporizador.current = setTimeout(() => navigate('/login'), 1800)
    } catch (e) {
      setErrorServidor(e.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout titulo="Enlace no válido" subtitulo="No se encontró el token de recuperación.">
        <Alerta variante="error">
          El enlace de recuperación es inválido o incompleto. Solicita uno nuevo.
        </Alerta>
        <Link to="/recuperar" className="restablecer__enlace">
          Solicitar un nuevo enlace
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout titulo="Nueva contraseña" subtitulo="Ingresa y confirma tu nueva contraseña">
      {errorServidor && <Alerta variante="error">{errorServidor}</Alerta>}
      {exito && <Alerta variante="exito">{exito}</Alerta>}

      <form className="restablecer__form" onSubmit={handleSubmit} noValidate>
        <Campo
          etiqueta="Nueva contraseña"
          type="password"
          id="nueva_password"
          name="nueva_password"
          value={form.nueva_password}
          onChange={handleChange}
          placeholder="Entre 4 y 8 caracteres"
          autoComplete="new-password"
          autoFocus
          requerido
          error={errores.nueva_password}
        />

        <Campo
          etiqueta="Confirmar contraseña"
          type="password"
          id="confirmar_password"
          name="confirmar_password"
          value={form.confirmar_password}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          requerido
          error={errores.confirmar_password}
        />

        <Boton completo tipo="submit" cargando={enviando}>
          {enviando ? 'Guardando…' : 'Guardar contraseña'}
        </Boton>
      </form>

      <p className="restablecer__volver">
        <Link to="/login" className="restablecer__link">Volver a iniciar sesión</Link>
      </p>
    </AuthLayout>
  )
}
