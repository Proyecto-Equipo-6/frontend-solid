import { request } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

function requestFormData(path, { metodo = 'PATCH', campos = {} } = {}) {
  const cuerpo = new FormData()
  Object.entries(campos).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null) {
      cuerpo.append(clave, valor)
    }
  })

  return fetch(`${BASE_URL}${path}`, {
    method: metodo,
    credentials: 'include',
    body: cuerpo,
  }).then(async (res) => {
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const error = new Error(data?.message || data?.error || 'Ocurrió un error en el servidor.')
      error.status = res.status
      throw error
    }
    return data
  })
}

export function getDashboardRepartidor() {
  return request('/v1/repartidor/dashboard')
}

export function getDetallePedidoRepartidor(pedidoId) {
  return request(`/v1/repartidor/pedidos/${pedidoId}/detalle`)
}

export function actualizarEstadoPedidoRepartidor(pedidoId, { estado, estadoAnterior, foto, observacion }) {
  if (foto) {
    return requestFormData(`/v1/repartidor/pedidos/${pedidoId}/estado`, {
      metodo: 'PATCH',
      campos: {
        estado,
        estadoAnterior,
        fotoEvidencia: foto,
        observacion: observacion || '',
      },
    })
  }

  return request(`/v1/repartidor/pedidos/${pedidoId}/estado`, {
    metodo: 'PATCH',
    datos: { estado, estadoAnterior, observacion },
  })
}

export function getHistorialRepartidor(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.estado) params.set('estado', filtros.estado)
  if (filtros.orden) params.set('orden', filtros.orden)

  const query = params.toString()
  return request(`/v1/repartidor/historial${query ? `?${query}` : ''}`)
}