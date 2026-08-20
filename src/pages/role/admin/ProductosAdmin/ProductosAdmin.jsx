import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import FiltroEstado from '@/components/crud/FiltroEstado'
import { IconoPaquete, IconoRefrescar, IconoEditar, IconoEliminar, IconoReactivar, IconoAgregar } from '@/components/ui/Iconos/Iconos'
import {
  getProductosAdmin,
  crearProducto,
  editarProducto,
  eliminarProducto,
  ajustarStockProducto,
  getCategoriasAdmin,
  getProveedores,
} from '@/services/admin'
import { formatoPrecio } from '@/utils/formato'

const FORM_VACIO = {
  sku: '',
  nombre: '',
  descripcion: '',
  id_categoria: '',
  id_proveedor: '',
  precio: '',
  stock: '',
  imagen_url: '',
  estado: 1,
}

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')

  const [modal, setModal] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const [aAjustar, setAAjustar] = useState(null)
  const [ajuste, setAjuste] = useState({ cantidad_nueva: '', motivo: '' })

  const [filtro, setFiltro] = useState('activos')

  function cargarTodo() {
    setCargando(true)
    setError('')
    Promise.all([getProductosAdmin(), getCategoriasAdmin(), getProveedores()])
      .then(([productos, categorias, proveedores]) => {
        setProductos(productos)
        setCategorias(categorias)
        setProveedores(proveedores)
      })
      .catch((e) => setError(e.message || 'No se pudieron cargar los productos.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModal('form')
  }

  function abrirEdicion(producto) {
    setForm({
      sku: producto.sku,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      id_categoria: producto.id_categoria,
      id_proveedor: producto.id_proveedor,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      imagen_url: producto.imagen_url || '',
      estado: Number(producto.estado),
    })
    setEditandoId(producto.id_producto)
    setModal('form')
  }

  function cambiarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardarProducto(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      const datos = {
        sku: form.sku,
        id_categoria: Number(form.id_categoria),
        id_proveedor: Number(form.id_proveedor),
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagen_url: form.imagen_url || null,
        estado: Number(form.estado),
      }
      if (editandoId) {
        await editarProducto(editandoId, datos)
        setAlerta('Producto actualizado correctamente.')
      } else {
        await crearProducto(datos)
        setAlerta('Producto creado correctamente.')
      }
      setModal(null)
      setEditandoId(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminar() {
    setEliminando(true)
    setAlerta('')
    try {
      const resultado = await eliminarProducto(aEliminar.id_producto)
      setAlerta(resultado.mensaje || 'Producto desactivado correctamente.')
      setAEliminar(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setEliminando(false)
    }
  }

  async function guardarAjuste(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      await ajustarStockProducto(aAjustar.id_producto, {
        cantidad_nueva: Number(ajuste.cantidad_nueva),
        motivo: ajuste.motivo,
      })
      setAlerta('Stock ajustado correctamente.')
      setAAjustar(null)
      setAjuste({ cantidad_nueva: '', motivo: '' })
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const columnas = [
    {
      clave: 'nombre',
      etiqueta: 'Producto',
      render: (p) => (
        <div className="crud__celda-nombre">
          {p.imagen_url ? (
            <img className="crud__imagen" src={p.imagen_url} alt="" />
          ) : (
            <span className="crud__imagen crud__imagen--sin">
              <IconoPaquete tamano={18} />
            </span>
          )}
          <div>
            <div className="crud__texto-principal">{p.nombre}</div>
            <div className="crud__texto-secundario">{p.sku}</div>
          </div>
        </div>
      ),
    },
    { clave: 'categoria', etiqueta: 'Categoría' },
    { clave: 'proveedor', etiqueta: 'Proveedor' },
    {
      clave: 'precio',
      etiqueta: 'Precio',
      render: (p) => formatoPrecio(Number(p.precio)),
    },
    {
      clave: 'stock',
      etiqueta: 'Stock',
      render: (p) => (
        <span className={Number(p.stock) <= 0 ? 'crud__texto-secundario' : ''}>
          {Number(p.stock)}
        </span>
      ),
    },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      alineacion: 'centro',
      render: (p) => (
        <span className={`crud__badge crud__badge--${Number(p.estado) === 1 ? 'activo' : 'inactivo'}`}>
          {Number(p.estado) === 1 ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ]

  const acciones = (producto) => (
    <>
      {filtro === 'inactivos' ? (
        <button
          type="button"
          className="crud__icono crud__icono--reactivar"
          aria-label={`Activar ${producto.nombre}`}
          title="Activar"
          onClick={() => reactivarProducto(producto)}
        >
          <IconoReactivar tamano={18} />
        </button>
      ) : (
        <>
          <button
            type="button"
            className="crud__boton"
            onClick={() => {
              setAjuste({ cantidad_nueva: String(producto.stock), motivo: '' })
              setAAjustar(producto)
            }}
          >
            <IconoRefrescar tamano={18} />
            Ajustar stock
          </button>
          <button
            type="button"
            className="crud__icono crud__icono--editar"
            aria-label={`Editar ${producto.nombre}`}
            title="Editar"
            onClick={() => abrirEdicion(producto)}
          >
            <IconoEditar tamano={18} />
          </button>
          <button
            type="button"
            className="crud__icono crud__icono--eliminar"
            aria-label={`Eliminar ${producto.nombre}`}
            title="Eliminar"
            onClick={() => setAEliminar(producto)}
          >
            <IconoEliminar tamano={18} />
          </button>
        </>
      )}
    </>
  )

  async function reactivarProducto(producto) {
    setAlerta('')
    try {
      await editarProducto(producto.id_producto, {
        sku: producto.sku,
        id_categoria: Number(producto.id_categoria),
        id_proveedor: Number(producto.id_proveedor),
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: Number(producto.precio),
        stock: Number(producto.stock),
        imagen_url: producto.imagen_url || null,
        estado: 1,
      })
      setAlerta(`Producto "${producto.nombre}" activado correctamente.`)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    }
  }

  const esActivo = (p) => Number(p.estado) === 1
  const activos = productos.filter(esActivo)
  const inactivos = productos.filter((p) => !esActivo(p))
  const filas = filtro === 'activos' ? activos : inactivos

  return (
    <VistaGestion
      titulo="Productos"
      descripcion="Administra el catálogo: crea, edita y controla el stock de los productos."
    >
      <div className="gestion__cabecera">
        <FiltroEstado
          valor={filtro}
          onCambiar={setFiltro}
          conteos={{ activos: activos.length, inactivos: inactivos.length }}
        />
        <button type="button" className="crud__boton crud__boton--nuevo" onClick={abrirNuevo}>
          <IconoAgregar tamano={16} />
          Nuevo producto
        </button>
      </div>

      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={filas}
        claveFila={(p) => p.id_producto}
        cargando={cargando}
        error={error}
        acciones={acciones}
      />

      <ModalCrud abierto={modal === 'form'} titulo="Producto" onCerrar={() => setModal(null)}>
        <form className="crud__form" onSubmit={guardarProducto}>
          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label">SKU</label>
              <input
                className="crud__campo-input"
                value={form.sku}
                onChange={(e) => cambiarCampo('sku', e.target.value)}
                required
              />
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">Nombre</label>
              <input
                className="crud__campo-input"
                value={form.nombre}
                onChange={(e) => cambiarCampo('nombre', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="crud__campo">
            <label className="crud__campo-label">Descripción</label>
            <textarea
              className="crud__campo-textarea"
              value={form.descripcion}
              onChange={(e) => cambiarCampo('descripcion', e.target.value)}
            />
          </div>

          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label">Categoría</label>
              <select
                className="crud__campo-select"
                value={form.id_categoria}
                onChange={(e) => cambiarCampo('id_categoria', e.target.value)}
                required
              >
                <option value="">Selecciona…</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">Proveedor</label>
              <select
                className="crud__campo-select"
                value={form.id_proveedor}
                onChange={(e) => cambiarCampo('id_proveedor', e.target.value)}
                required
              >
                <option value="">Selecciona…</option>
                {proveedores.map((p) => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>
                    {p.razon_social}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="crud__fila--tres crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label">Precio</label>
              <input
                className="crud__campo-input"
                type="number"
                min="0"
                step="any"
                value={form.precio}
                onChange={(e) => cambiarCampo('precio', e.target.value)}
                required
              />
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">Stock</label>
              <input
                className="crud__campo-input"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => cambiarCampo('stock', e.target.value)}
                required
              />
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">Estado</label>
              <select
                className="crud__campo-select"
                value={form.estado}
                onChange={(e) => cambiarCampo('estado', Number(e.target.value))}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="crud__campo">
            <label className="crud__campo-label">URL de imagen (opcional)</label>
            <input
              className="crud__campo-input"
              type="url"
              value={form.imagen_url}
              onChange={(e) => cambiarCampo('imagen_url', e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="crud__form-acciones">
            <button type="button" className="crud__boton" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button type="submit" className="crud__boton" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </ModalCrud>

      <ModalCrud abierto={Boolean(aAjustar)} titulo="Ajustar stock" onCerrar={() => setAAjustar(null)}>
        <form className="crud__form" onSubmit={guardarAjuste}>
          <p className="crud__modal-texto">
            Producto: <strong>{aAjustar?.nombre}</strong>
          </p>
          <div className="crud__campo">
            <label className="crud__campo-label">Nueva cantidad</label>
            <input
              className="crud__campo-input"
              type="number"
              min="0"
              step="1"
              value={ajuste.cantidad_nueva}
              onChange={(e) => setAjuste((prev) => ({ ...prev, cantidad_nueva: e.target.value }))}
              required
            />
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label">Motivo</label>
            <input
              className="crud__campo-input"
              value={ajuste.motivo}
              onChange={(e) => setAjuste((prev) => ({ ...prev, motivo: e.target.value }))}
              placeholder="Ej: Reposición de inventario"
              required
            />
          </div>
          <div className="crud__form-acciones">
            <button type="button" className="crud__boton" onClick={() => setAAjustar(null)}>
              Cancelar
            </button>
            <button type="submit" className="crud__boton" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Ajustar'}
            </button>
          </div>
        </form>
      </ModalCrud>

      {aEliminar && (
        <Confirmar
          titulo="Eliminar producto"
          mensaje={`¿Desactivar "${aEliminar.nombre}" del catálogo?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </VistaGestion>
  )
}