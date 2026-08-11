import { ENDPOINTS, request } from './api'
import { PRODUCTOS_MOCK } from './mocks/productos'

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK !== 'false'

export function normalizarProducto(producto) {
  if (producto.titulo !== undefined) return producto

  return {
    id: producto.id_producto,
    titulo: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    precio: Number(producto.precio),
    stock: producto.stock,
    garantia: producto.garantia,
    imagen: producto.imagen_url,
    sku: producto.sku,
    proveedor: producto.proveedor,
  }
}

export function getProductosPublicos() {
  if (USAR_MOCK) return Promise.resolve(PRODUCTOS_MOCK)

  return request(ENDPOINTS.productosPublicos).then((productos) =>
    productos.map(normalizarProducto),
  )
}

export function getProductoPublico(id) {
  if (USAR_MOCK) {
    return Promise.resolve(
      PRODUCTOS_MOCK.find((producto) => String(producto.id) === String(id)) ?? null,
    )
  }

  return request(ENDPOINTS.productoDetalle(id)).then(normalizarProducto)
}

export function getCategoriasPublicas() {
  if (USAR_MOCK) {
    return Promise.resolve(
      [...new Set(PRODUCTOS_MOCK.map((producto) => producto.categoria))].map(
        (nombre, indice) => ({ id_categoria: indice + 1, nombre }),
      ),
    )
  }

  return request(ENDPOINTS.categoriasPublicas)
}
