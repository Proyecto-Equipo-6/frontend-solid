const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const ENDPOINTS = {
  registrarUsuario: '/v1/users',
  iniciarSesion: '/v1/auth/login',
}

async function request(path, { metodo = 'GET', datos, encabezados } = {}) {
  const opciones = {
    method: metodo,
    credentials: 'include',
  }

  if (datos !== undefined) {
    opciones.body = JSON.stringify(datos)
    encabezados = { 'Content-Type': 'application/json', ...encabezados }
  }

  if (encabezados) opciones.headers = encabezados

  const res = await fetch(`${BASE_URL}${path}`, opciones)
  const cuerpo = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(mensajeError(cuerpo?.error, res.status))
  }

  return cuerpo
}

function mensajeError(mensaje, estado) {
  if (estado === 404) {
    return 'El servicio no está disponible por el momento.'
  }

  if (estado >= 500) {
    return 'Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.'
  }

  return mensaje || 'Por favor verifica los campos del formulario.'
}

export function registrarUsuario(datos) {
  return request(ENDPOINTS.registrarUsuario, { metodo: 'POST', datos })
}

export function iniciarSesion(credenciales) {
  return request(ENDPOINTS.iniciarSesion, { metodo: 'POST', datos: credenciales })
}
