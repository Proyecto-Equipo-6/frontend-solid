export const TEMA_OSCURO = 'oscuro'
export const TEMA_CLARO = 'claro'

const CLAVE_TEMA = 'nexbit_tema'

export function obtenerTemaInicial() {
  try {
    return localStorage.getItem(CLAVE_TEMA) === TEMA_CLARO ? TEMA_CLARO : TEMA_OSCURO
  } catch {
    return TEMA_OSCURO
  }
}

export function aplicarTema(tema) {
  const raiz = document.documentElement
  if (raiz.dataset.tema === tema) return

  raiz.dataset.tema = tema
  try {
    localStorage.setItem(CLAVE_TEMA, tema)
  } catch {
    // El almacenamiento local puede no estar disponible; el tema se mantiene igual.
  }
  window.dispatchEvent(new CustomEvent('nexbit:tema', { detail: { tema } }))
}