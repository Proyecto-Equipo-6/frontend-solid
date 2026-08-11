import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../../components/layout/AuthLayout/AuthLayout'
import Alerta from '../../../components/ui/Alerta/Alerta'
import Boton from '../../../components/ui/Boton/Boton'
import Campo from '../../../components/ui/Campo/Campo'
import { iniciarSesion } from '../../../servicios/api'
import { guardarSesion } from '../../../servicios/sesion'
import { esEmailValido, esPasswordValida } from '../../../servicios/validacion'
import { MARCA, ROLES } from '../../../config/aplicacion'
import './IniciarSesion.css'

export default function IniciarSesion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  function limpiarError(campo) {
    setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  function validar() {
    const siguientes = {}

    if (!esEmailValido(email)) {
      siguientes.email = 'Ingresa un correo electrónico válido.'
    }

    if (!password) {
      siguientes.password = 'La contraseña es obligatoria.'
    } else if (!esPasswordValida(password)) {
      siguientes.password = 'La contraseña debe tener entre 4 y 8 caracteres.'
    }

    setErrores(siguientes)
    return Object.keys(siguientes).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorServidor('')
    if (!validar()) return

    setEnviando(true)
    try {
      const respuesta = await iniciarSesion({ email, password })
      guardarSesion(respuesta.usuario)
      const rol = ROLES[respuesta.usuario.id_rol]
      navigate(rol?.panel ?? '/')
    } catch (error) {
      setErrorServidor(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout titulo="Iniciar sesión" subtitulo={`Bienvenido de nuevo a ${MARCA.nombre}`}>
      {errorServidor && <Alerta variante="error">{errorServidor}</Alerta>}

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <Campo
          etiqueta="Correo electrónico"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            limpiarError('email')
          }}
          placeholder="tu@correo.com"
          autoComplete="email"
          autoFocus
          requerido
          error={errores.email}
        />

        <Campo
          etiqueta="Contraseña"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            limpiarError('password')
          }}
          placeholder="Entre 4 y 8 caracteres"
          autoComplete="current-password"
          requerido
          error={errores.password}
        />

        <label className="login__recordar">
          <input type="checkbox" name="recordar" />{' '}
          Recordarme
        </label>

        <Boton completo tipo="submit" cargando={enviando}>
          {enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </Boton>

        <Link to="/recuperar" className="login__olvidada">
          ¿Olvidaste tu contraseña?
        </Link>
      </form>

      <p className="login__registrate">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="login__link">Regístrate</Link>
      </p>
    </AuthLayout>
  )
}
