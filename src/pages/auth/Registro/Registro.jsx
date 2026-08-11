import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout'
import Alerta from '@/components/ui/Alerta/Alerta'
import Boton from '@/components/ui/Boton/Boton'
import Campo from '@/components/ui/Campo/Campo'
import { registrarUsuario } from '@/services/api'
import { MARCA, TIPOS_DOCUMENTO } from '@/config/aplicacion'
import {
  REGEX_SOLO_NUMEROS,
  esEmailValido,
  esPasswordValida,
  esTelefonoValido,
} from '@/utils/validacion'
import './Registro.css'

const INICIAL = {
  nombre_apellido: '',
  tipo_documento: '',
  numero_documento: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
}

function validar(form) {
  const errores = {}

  if (!form.nombre_apellido.trim()) {
    errores.nombre_apellido = 'El nombre es obligatorio.'
  }

  if (!form.tipo_documento) {
    errores.tipo_documento = 'Selecciona un tipo de documento.'
  }

  if (!form.numero_documento.trim()) {
    errores.numero_documento = 'El número de documento es obligatorio.'
  } else if (!REGEX_SOLO_NUMEROS.test(form.numero_documento)) {
    errores.numero_documento = 'El número de documento debe ser numérico.'
  }

  if (!esEmailValido(form.email)) {
    errores.email = 'Ingresa un correo electrónico válido.'
  }

  if (!esPasswordValida(form.password)) {
    errores.password = 'La contraseña debe tener entre 4 y 8 caracteres.'
  }

  if (!form.telefono.trim()) {
    errores.telefono = 'El teléfono es obligatorio.'
  } else if (!esTelefonoValido(form.telefono)) {
    errores.telefono = 'El teléfono debe tener exactamente 10 dígitos.'
  }

  if (!form.direccion.trim()) {
    errores.direccion = 'La dirección es obligatoria.'
  }

  return errores
}

export default function Registro() {
  const navigate = useNavigate()
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

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorServidor('')
    setExito('')

    const erroresCampos = validar(form)
    setErrores(erroresCampos)
    if (Object.keys(erroresCampos).length > 0) return

    setEnviando(true)
    try {
      await registrarUsuario(form)
      setExito('Usuario registrado con éxito. Por favor inicia sesión.')
      temporizador.current = setTimeout(() => navigate('/login'), 1800)
    } catch (error) {
      setErrorServidor(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Crear cuenta"
      subtitulo={`Únete a ${MARCA.nombre} y comienza a realizar pedidos`}
      ancho="grande"
      accionRedes="Registrarse con"
    >
      {errorServidor && <Alerta variante="error">{errorServidor}</Alerta>}
      {exito && <Alerta variante="exito">{exito}</Alerta>}

      <form className="registro__form" onSubmit={handleSubmit} noValidate>
        <div className="registro__grid">
          <Campo
            completo
            etiqueta="Nombre y apellido"
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
            as="select"
            etiqueta="Tipo de documento"
            id="tipo_documento"
            name="tipo_documento"
            value={form.tipo_documento}
            onChange={handleChange}
            requerido
            error={errores.tipo_documento}
          >
            <option value="" disabled>Seleccione…</option>
            {TIPOS_DOCUMENTO.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </Campo>

          <Campo
            etiqueta="Número de documento"
            id="numero_documento"
            name="numero_documento"
            value={form.numero_documento}
            onChange={handleChange}
            placeholder="Ej: 1010123456"
            inputMode="numeric"
            requerido
            error={errores.numero_documento}
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
            etiqueta="Contraseña"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Entre 4 y 8 caracteres"
            autoComplete="new-password"
            requerido
            error={errores.password}
          />
        </div>

        <Boton completo tipo="submit" cargando={enviando}>
          {enviando ? 'Registrando…' : 'Crear cuenta'}
        </Boton>
      </form>

      <p className="registro__ingresar">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="registro__link">Inicia sesión</Link>
      </p>
    </AuthLayout>
  )
}
