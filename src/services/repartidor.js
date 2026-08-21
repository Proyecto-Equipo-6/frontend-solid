import { request } from './api'

export function getDashboardRepartidor() {
  return request('/v1/repartidor/dashboard')
}

export function getDetallePedidoRepartidor(pedidoId) {
  return request(`/v1/repartidor/pedidos/${pedidoId}/detalle`)
}

export function actualizarEstadoPedidoRepartidor(pedidoId, datos) {
  return request(`/v1/repartidor/pedidos/${pedidoId}/estado`, {
    metodo: 'PATCH',
    datos,
  })
}

export function getHistorialRepartidor(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.estado) params.set('estado', filtros.estado)
  if (filtros.orden) params.set('orden', filtros.orden)

  const query = params.toString()
  return request(`/v1/repartidor/historial${query ? `?${query}` : ''}`)
}