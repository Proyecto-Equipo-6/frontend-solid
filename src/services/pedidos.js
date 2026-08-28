import { request } from './api'

export function getMisPedidos(estado = '') {
  const params = estado ? `?estado=${encodeURIComponent(estado)}` : ''
  return request(`/v1/pedidos${params}`)
}

export function cancelarPedidoCliente(idPedido, motivo) {
  return request(`/v1/pedidos/${idPedido}`, {
    metodo: 'DELETE',
    datos: { motivo },
  })
}

export function crearPedido(datos) {
  return request('/v1/pedidos', {
    metodo: 'POST',
    datos,
  })
}

export function getTicketPedido(idPedido) {
  return request(`/v1/pedidos/${idPedido}/ticket`)
}

export function getDetallePedidoCliente(idPedido) {
  return request(`/v1/pedidos/${idPedido}`)
}