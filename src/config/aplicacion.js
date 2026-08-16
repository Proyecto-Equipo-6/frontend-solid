export const MARCA = {
  nombre: 'Nexbit',
  logotipo: 'Nx',
  descripcion:
    'Tu tienda en línea con productos verificados, precios justos y entrega segura en todo el país.',
}

export const NAVEGACION_PRINCIPAL = [{ nombre: 'Catálogo', destino: '/#catalogo' }]

export const PROVEEDORES_SOCIALES = ['Google', 'Facebook']

export const TIPOS_DOCUMENTO = ['CC', 'Pasaporte', 'CE', 'Otro']

export const OPCIONES_ENVIO = [
  { id: 'estandar', nombre: 'Estándar', costo: 0 },
  { id: 'express', nombre: 'Exprés', costo: 12000 },
]

export const CATALOGO = {
  productosPorPagina: 8,
  stockBajo: 10,
  minimoBusqueda: 2,
}

export const ROLES = {
  1: { nombre: 'Administrador', panel: '/admin' },
  2: { nombre: 'Cliente', panel: '/cliente' },
  3: { nombre: 'Repartidor', panel: '/repartidor' },
}

export const METODOS_PAGO = [
  {
    id: 'nequi',
    nombre: 'Nequi',
    descripcion: 'Monedero virtual. Paga al número 300 123 4567 (Nexbit).',
    requiereComprobante: true,
  },
  {
    id: 'daviplata',
    nombre: 'Daviplata',
    descripcion: 'Monedero virtual. Paga a la llave 300 123 4567.',
    requiereComprobante: true,
  },
  {
    id: 'bancolombia',
    nombre: 'Bancolombia',
    descripcion: 'Transferencia a la cuenta de ahorros 123-456789-01.',
    requiereComprobante: true,
  },
  {
    id: 'contraentrega',
    nombre: 'Contra entrega',
    descripcion: 'Pagas en efectivo cuando recibes tu pedido.',
    requiereComprobante: false,
  },
]
