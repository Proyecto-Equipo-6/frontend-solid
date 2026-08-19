import { request } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

function requestFormData(path, { metodo = 'POST', datos } = {}) {
  const cuerpo = new FormData()
  Object.entries(datos).forEach(([clave, valor]) => {
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
      const error = new Error(data?.error || 'Ocurrió un error en el servidor.')
      error.status = res.status
      throw error
    }
    return data
  })
}

// ---- Productos ----
export function getProductosAdmin() {
  return request('/v1/productos')
}

export function crearProducto(datos) {
  return request('/v1/productos', { metodo: 'POST', datos })
}

export function editarProducto(id, datos) {
  return request(`/v1/productos/${id}`, { metodo: 'PUT', datos })
}

export function eliminarProducto(id) {
  return request(`/v1/productos/${id}`, { metodo: 'DELETE' })
}

export function ajustarStockProducto(id, datos) {
  return request(`/v1/productos/${id}/ajustar-stock`, { metodo: 'PUT', datos })
}

// ---- Categorías ----
export function getCategoriasAdmin() {
  return request('/v1/categorias/todas')
}

export function crearCategoria(datos) {
  return request('/v1/categorias', { metodo: 'POST', datos })
}

export function editarCategoria(id, datos) {
  return request(`/v1/categorias/${id}`, { metodo: 'PUT', datos })
}

export function eliminarCategoria(id) {
  return request(`/v1/categorias/${id}`, { metodo: 'DELETE' })
}

// ---- Proveedores ----
export function getProveedores() {
  return request('/v1/proveedores/todos')
}

export function crearProveedor(datos) {
  return requestFormData('/v1/proveedores', { metodo: 'POST', datos })
}

export function editarProveedor(id, datos) {
  return requestFormData(`/v1/proveedores/${id}`, { metodo: 'PUT', datos })
}

export function eliminarProveedor(id) {
  return request(`/v1/proveedores/${id}`, { metodo: 'DELETE' })
}

// ---- Usuarios ----
export function getUsuarios(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.estado !== undefined) params.set('estado', filtros.estado)
  if (filtros.rol) params.set('rol', filtros.rol)
  if (filtros.busqueda) params.set('busqueda', filtros.busqueda)
  if (filtros.page) params.set('page', filtros.page)
  if (filtros.limit) params.set('limit', filtros.limit)

  const query = params.toString()
  return request(`/v1/admin/usuarios${query ? `?${query}` : ''}`)
}

export function actualizarEstadoUsuario(id, activo) {
  return request(`/v1/admin/usuarios/${id}/estado`, {
    metodo: 'PUT',
    datos: { activo },
  })
}

export function crearUsuarioAdmin(datos) {
  return request('/v1/admin/usuarios', { metodo: 'POST', datos })
}

export function actualizarUsuarioAdmin(id, datos) {
  return request(`/v1/admin/usuarios/${id}`, { metodo: 'PUT', datos })
}

export function eliminarUsuarioAdmin(id) {
  return request(`/v1/admin/usuarios/${id}`, { metodo: 'DELETE' })
}

// ---- Roles ----
export function getRoles() {
  return request('/v1/roles')
}

export function actualizarRol(datos) {
  return request('/v1/roles', { metodo: 'PUT', datos })
}

export function crearRol(datos) {
  return request('/v1/roles', { metodo: 'POST', datos })
}

export function eliminarRol(id) {
  return request(`/v1/roles/${id}`, { metodo: 'DELETE' })
}

// ---- Repartidores ----
export function getRepartidores(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.termino) params.set('termino', filtros.termino)
  if (filtros.estado) params.set('estado', filtros.estado)

  const query = params.toString()
  return request(`/v1/admin/repartidores${query ? `?${query}` : ''}`)
}

export function cambiarEstadoRepartidor(id, estado) {
  return request(`/v1/admin/repartidores/${id}/estado`, {
    metodo: 'PUT',
    datos: { estado },
  })
}

export function crearRepartidor(datos) {
  return request('/v1/admin/repartidores', { metodo: 'POST', datos })
}

export function actualizarRepartidor(id, datos) {
  return request(`/v1/admin/repartidores/${id}`, { metodo: 'PUT', datos })
}

export function eliminarRepartidor(id) {
  return request(`/v1/admin/repartidores/${id}`, { metodo: 'DELETE' })
}

// ---- Pedidos ----
export function getPedidos(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.estado) params.set('estado', filtros.estado)
  if (filtros.repartidor) params.set('repartidor', filtros.repartidor)
  if (filtros.page) params.set('page', filtros.page)
  if (filtros.limit) params.set('limit', filtros.limit)

  const query = params.toString()
  return request(`/v1/admin/pedidos${query ? `?${query}` : ''}`)
}

export function getDetallePedido(id) {
  return request(`/v1/admin/pedidos/${id}`)
}

export function actualizarEstadoPedido(id, estado) {
  return request(`/v1/admin/pedidos/${id}/estado`, {
    metodo: 'PUT',
    datos: { estado },
  })
}

export function cancelarPedido(id, motivo, opciones = {}) {
  return request(`/v1/admin/pedidos/${id}/cancelar`, {
    metodo: 'PUT',
    datos: { motivo_cancelacion: motivo, ...opciones },
  })
}

export function asignarRepartidorPedido(id, idRepartidor) {
  return request(`/v1/admin/pedidos/${id}/asignar`, {
    metodo: 'PUT',
    datos: { id_repartidor: idRepartidor },
  })
}

export function getTicketPedido(id) {
  return request(`/v1/admin/pedidos/${id}/ticket`)
}