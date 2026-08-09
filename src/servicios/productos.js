import { ENDPOINTS, request } from './api'
import { PRODUCTOS_MOCK } from './mocks/productos'

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK !== 'false'

export function getProductosPublicos() {
  if (USAR_MOCK) return Promise.resolve(PRODUCTOS_MOCK)

  return request(ENDPOINTS.productosPublicos)
}

export function getProductoPublico(id) {
  if (USAR_MOCK) {
    return Promise.resolve(
      PRODUCTOS_MOCK.find((producto) => String(producto.id) === String(id)) ?? null,
    )
  }

  return request(ENDPOINTS.productoDetalle(id))
}
