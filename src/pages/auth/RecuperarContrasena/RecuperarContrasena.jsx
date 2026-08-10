import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../../components/layout/AuthLayout/AuthLayout'
import Alerta from '../../../components/ui/Alerta/Alerta'
import Boton from '../../../components/ui/Boton/Boton'
import Campo from '../../../components/ui/Campo/Campo'
import { solicitarRecuperacion } from '../../../servicios/api'
import { esEmailValido } from '../../../servicios/validacion'
import { MARCA } from '../../../config/aplicacion'
import './RecuperarContrasena.css'

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [errorServidor, setErrorServidor] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(event) {
    setEmail(event.target.value)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorServidor('')
    setExito('')

    if (!esEmailValido(email)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    setEnviando(true)
    try {
      const respuesta = await solicitarRecuperacion(email)
      setExito(respuesta.mensaje)
      setEmail('')
    } catch (e) {
      setErrorServidor(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Recuperar contraseña"
      subtitulo={`Te enviaremos un enlace para restablecer tu contraseña de ${MARCA.nombre}`}
    >
      {errorServidor && <Alerta variante="error">{errorServidor}</Alerta>}
      {exito && <Alerta variante="exito">{exito}</Alerta>}

      <form className="recuperar__form" onSubmit={handleSubmit} noValidate>
        <Campo
          etiqueta="Correo electrónico"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="tu@correo.com"
          autoComplete="email"
          autoFocus
          requerido
          error={error}
        />

        <Boton completo tipo="submit" cargando={enviando}>
          {enviando ? 'Enviando…' : 'Enviar enlace de recuperación'}
        </Boton>
      </form>

      <p className="recuperar__volver">
        <Link to="/login" className="recuperar__link">Volver a iniciar sesión</Link>
      </p>
    </AuthLayout>
  )
}
