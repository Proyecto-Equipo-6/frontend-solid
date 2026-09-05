const CLAVE_SESION = 'nexbit_sesion'

export function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function guardarToken(token) {
  const sesion = obtenerSesion() || {}
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...sesion, token }))
}

export function obtenerToken() {
  return obtenerSesion()?.token || null
}

export function limpiarToken() {
  const sesion = obtenerSesion()
  if (sesion) {
    delete sesion.token
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  }
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}
