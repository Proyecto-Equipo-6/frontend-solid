export const MARCA = {
  nombre: 'Nexbit',
  logotipo: 'Nx',
  descripcion:
    'Tu tienda en línea con productos verificados, precios justos y entrega segura en todo el país.',
}

export const APK_URL =
  'https://expo.dev/artifacts/eas/EphL8f4PHTtfucV7q060-BE50hTVPiBKqRSPOFb8owM.apk'

export const NAVEGACION_PRINCIPAL = [{ nombre: 'Catálogo', destino: '/#catalogo' }]

export const TIPOS_DOCUMENTO = ['CC', 'Pasaporte', 'CE', 'Otro']

export const OPCIONES_ENVIO = [
  { id: 'estandar', nombre: 'Estándar', costo: 0 },
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
    id: 'contraentrega',
    nombre: 'Contra entrega',
    requiereComprobante: false,
  },
]
