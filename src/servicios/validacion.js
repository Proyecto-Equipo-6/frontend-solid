export const REGEX_EMAIL = /\S+@\S+\.\S+/
export const REGEX_SOLO_NUMEROS = /^\d+$/
export const REGEX_TELEFONO = /^\d{10}$/

export const MIN_PASSWORD = 8
export const MAX_PASSWORD = 72

export function esEmailValido(valor) {
  return REGEX_EMAIL.test(valor.trim())
}

export function esPasswordValida(valor) {
  return valor.length >= MIN_PASSWORD && valor.length <= MAX_PASSWORD
}

export function esTelefonoValido(valor) {
  return REGEX_TELEFONO.test(valor.trim())
}
