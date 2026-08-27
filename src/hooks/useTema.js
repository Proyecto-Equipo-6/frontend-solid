import { useCallback, useEffect, useState } from 'react'
import { TEMA_CLARO, TEMA_OSCURO, obtenerTemaInicial, aplicarTema } from '@/services/tema'

export default function useTema() {
  const [tema, setTema] = useState(obtenerTemaInicial)

  useEffect(() => {
    aplicarTema(tema)
  }, [tema])

  useEffect(() => {
    function sincronizar(evento) {
      setTema(evento.detail.tema)
    }
    window.addEventListener('nexbit:tema', sincronizar)
    return () => window.removeEventListener('nexbit:tema', sincronizar)
  }, [])

  const alternar = useCallback(() => {
    setTema((actual) => (actual === TEMA_OSCURO ? TEMA_CLARO : TEMA_OSCURO))
  }, [])

  return { tema, alternar }
}