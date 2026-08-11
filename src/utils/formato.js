import { CATALOGO } from '@/config/aplicacion'

export function formatoPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio)
}

export function estadoStock(stock) {
  if (stock <= 0) return 'agotado'
  if (stock <= CATALOGO.stockBajo) return 'pocas'
  return 'disponible'
}

export function textoStock(stock) {
  if (stock <= 0) return 'No disponible'
  if (stock <= CATALOGO.stockBajo) return 'Pocas unidades disponibles'
  return `${stock} disponibles`
}
