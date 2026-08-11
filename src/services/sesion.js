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

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}
