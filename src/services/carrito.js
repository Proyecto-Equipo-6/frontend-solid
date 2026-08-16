import { ENDPOINTS, request } from './api'

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK !== 'false'
const CLAVE_CARRITO = 'nexbit_carrito'

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO))
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function guardarCarrito(items) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
}

export function obtenerCarrito() {
  return leerCarrito()
}

export function agregarAlCarrito(producto, cantidad = 1) {
  if (USAR_MOCK) {
    const items = leerCarrito()
    const indice = items.findIndex((item) => String(item.id) === String(producto.id))

    if (indice >= 0) {
      items[indice].cantidad += cantidad
    } else {
      items.push({
        id: producto.id,
        titulo: producto.titulo,
        imagen: producto.imagen,
        precio: Number(producto.precio),
        categoria: producto.categoria,
        sku: producto.sku,
        variante: producto.variante,
        cantidad,
      })
    }

    guardarCarrito(items)
    return Promise.resolve({ ok: true })
  }

  return request(ENDPOINTS.carritoAgregar, {
    metodo: 'POST',
    datos: { productoId: producto.id, cantidad },
  })
}

export function actualizarCantidad(productoId, cantidad) {
  const items = leerCarrito()
  const indice = items.findIndex((item) => String(item.id) === String(productoId))

  if (indice >= 0) {
    if (cantidad <= 0) {
      items.splice(indice, 1)
    } else {
      items[indice].cantidad = cantidad
    }
    guardarCarrito(items)
  }

  return leerCarrito()
}

export function eliminarDelCarrito(productoId) {
  const items = leerCarrito().filter((item) => String(item.id) !== String(productoId))
  guardarCarrito(items)
  return leerCarrito()
}

export function limpiarCarrito() {
  guardarCarrito([])
  return []
}