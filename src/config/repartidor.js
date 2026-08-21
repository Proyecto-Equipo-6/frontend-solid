export const NAVEGACION_REPARTIDOR = [
  { clave: 'inicio', nombre: 'Pedidos del día', icono: 'inicio' },
  { clave: 'historial', nombre: 'Historial', icono: 'historial' },
]

export const ESTADOS_REPARTIDOR = {
  ASIGNADO: 'Asignado',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  CANCELADO: 'Cancelado',
}

export const COLORES_ESTADOS_REPARTIDOR = {
  ASIGNADO: '#a78bfa',
  EN_CAMINO: '#22d3ee',
  ENTREGADO: '#22c55e',
  NO_ENTREGADO: '#ef4444',
  CANCELADO: '#6b7280',
}

export const DIAGRAMA_SEGUIMIENTO = ['ASIGNADO', 'EN_CAMINO', 'ENTREGADO']

export const METODO_PAGO_REPARTIDOR = { 1: 'Contra entrega' }