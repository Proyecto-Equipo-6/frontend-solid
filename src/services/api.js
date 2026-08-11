const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const ENDPOINTS = {
  registrarUsuario: '/v1/users',
  iniciarSesion: '/v1/auth/login',
  cerrarSesion: '/v1/auth/logout',
  solicitarRecuperacion: '/v1/auth/recuperar',
  restablecerContrasena: '/v1/auth/restablecer',
  productosPublicos: '/v1/productos/publico',
  productoDetalle: (id) => `/v1/productos/${id}`,
  categoriasPublicas: '/v1/categorias',
  carritoAgregar: '/v1/carrito',
  perfil: '/v1/users/perfil',
}

export async function request(path, { metodo = 'GET', datos, encabezados } = {}) {
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
    const error = new Error(mensajeError(cuerpo?.error, res.status))
    error.status = res.status
    throw error
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

export function cerrarSesion() {
  return request(ENDPOINTS.cerrarSesion, { metodo: 'POST' })
}

export function solicitarRecuperacion(email) {
  return request(ENDPOINTS.solicitarRecuperacion, { metodo: 'POST', datos: { email } })
}

export function restablecerContrasena(datos) {
  return request(ENDPOINTS.restablecerContrasena, { metodo: 'POST', datos })
}

export function getCategoriasPublicas() {
  return request(ENDPOINTS.categoriasPublicas)
}

export function obtenerPerfil() {
  return request(ENDPOINTS.perfil)
}

export function actualizarPerfil(datos) {
  return request(ENDPOINTS.perfil, { metodo: 'PUT', datos })
}
