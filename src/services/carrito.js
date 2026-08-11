import { ENDPOINTS, request } from './api'

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK !== 'false'

export function agregarAlCarrito(productoId, cantidad = 1) {
  if (USAR_MOCK) return Promise.resolve({ ok: true })

  return request(ENDPOINTS.carritoAgregar, {
    metodo: 'POST',
    datos: { productoId, cantidad },
  })
}
