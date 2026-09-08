export const REGEX_EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
export const REGEX_SOLO_NUMEROS = /^\d+$/
export const REGEX_TELEFONO = /^\d{10}$/
export const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)+$/
export const REGEX_DIRECCION = /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])(?=.*\d)[A-Za-zÁÉÍÓÚáéíóúÑñ0-9üÜ.,#\-/ ]{8,120}$/

export const MIN_PASSWORD = 8
export const MAX_PASSWORD = 20

export function esEmailValido(valor) {
  return REGEX_EMAIL.test(valor.trim())
}

export function esNombreValido(valor) {
  const texto = valor.trim()
  return texto.length >= 3 && texto.length <= 80 && REGEX_NOMBRE.test(texto)
}

export function esDireccionValida(valor) {
  return REGEX_DIRECCION.test(valor.trim())
}

export function esPasswordValida(valor) {
  return (
    valor.length >= MIN_PASSWORD &&
    valor.length <= MAX_PASSWORD &&
    /[A-Z]/.test(valor) &&
    /[a-z]/.test(valor) &&
    /\d/.test(valor)
  )
}

export function esTelefonoValido(valor) {
  return REGEX_TELEFONO.test(valor.trim())
}
