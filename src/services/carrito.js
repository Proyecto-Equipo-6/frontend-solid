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

function notificarCarrito() {
  window.dispatchEvent(new CustomEvent('nexbit:carrito'))
}

function normalizarItems(items) {
  return items.map((item) => ({
    id: item.idProducto,
    titulo: item.titulo,
    imagen: item.imagen,
    precio: Number(item.precio),
    cantidad: Number(item.cantidad),
    stock: item.stock,
    sku: item.sku,
  }))
}

export function obtenerCarrito() {
  if (USAR_MOCK) return Promise.resolve(leerCarrito())

  return request('/v1/carrito').then((resultado) => normalizarItems(resultado.items))
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
    notificarCarrito()
    return Promise.resolve({ ok: true })
  }

  return request(ENDPOINTS.carritoAgregar, {
    metodo: 'POST',
    datos: { productoId: producto.id, cantidad },
  }).then((resultado) => {
    notificarCarrito()
    return resultado
  })
}

export async function actualizarCantidad(productoId, cantidad) {
  if (USAR_MOCK) {
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

  if (cantidad <= 0) {
    return eliminarDelCarrito(productoId)
  }

  const resultado = await request(`/v1/carrito/${productoId}`, {
    metodo: 'PUT',
    datos: { cantidad },
  })
  return normalizarItems(resultado.carrito.items)
}

export async function eliminarDelCarrito(productoId) {
  if (USAR_MOCK) {
    const items = leerCarrito().filter((item) => String(item.id) !== String(productoId))
    guardarCarrito(items)
    return leerCarrito()
  }

  const resultado = await request(`/v1/carrito/${productoId}`, { metodo: 'DELETE' })
  return normalizarItems(resultado.carrito.items)
}

export function limpiarCarrito() {
  guardarCarrito([])
  return []
}