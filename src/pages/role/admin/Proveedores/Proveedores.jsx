import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import {
  getProveedores,
  crearProveedor,
  editarProveedor,
  eliminarProveedor,
} from '@/services/admin'
import { IconoEditar, IconoEliminar, IconoAgregar } from '@/components/ui/Iconos/Iconos'

const FORM_VACIO = {
  nit_proveedor: '',
  razon_social: '',
  telefono: '',
  email: '',
  estado: 1,
}

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')

  const [modal, setModal] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  function cargarTodo() {
    setCargando(true)
    setError('')
    getProveedores()
      .then(setProveedores)
      .catch((e) => setError(e.message || 'No se pudieron cargar los proveedores.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModal(true)
  }

  function abrirEdicion(proveedor) {
    setForm({
      nit_proveedor: proveedor.nit_proveedor,
      razon_social: proveedor.razon_social,
      telefono: proveedor.telefono,
      email: proveedor.email || '',
      estado: Number(proveedor.estado),
    })
    setEditandoId(proveedor.id_proveedor)
    setModal(true)
  }

  function cambiarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardarProveedor(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      if (editandoId) {
        await editarProveedor(editandoId, form)
        setAlerta('Proveedor actualizado correctamente.')
      } else {
        await crearProveedor(form)
        setAlerta('Proveedor creado correctamente.')
      }
      setModal(false)
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
      await eliminarProveedor(aEliminar.id_proveedor)
      setAlerta('Proveedor desactivado correctamente.')
      setAEliminar(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setEliminando(false)
    }
  }

  const columnas = [
    {
      clave: 'razon_social',
      etiqueta: 'Proveedor',
      render: (p) => (
        <div className="crud__celda-nombre">
          {p.imagen_url ? (
            <img className="crud__imagen" src={p.imagen_url} alt="" />
          ) : (
            <span className="crud__imagen crud__imagen--sin">S</span>
          )}
          <div>
            <div className="crud__texto-principal">{p.razon_social}</div>
            <div className="crud__texto-secundario">{p.nit_proveedor}</div>
          </div>
        </div>
      ),
    },
    { clave: 'email', etiqueta: 'Email' },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      render: (p) => (
        <span className={`crud__badge crud__badge--${Number(p.estado) === 1 ? 'activo' : 'inactivo'}`}>
          {Number(p.estado) === 1 ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ]

  const acciones = (proveedor) => (
    <>
      <button
        type="button"
        className="crud__icono crud__icono--editar"
        aria-label={`Editar ${proveedor.razon_social}`}
        title="Editar"
        onClick={() => abrirEdicion(proveedor)}
      >
        <IconoEditar tamano={18} />
      </button>
      <button
        type="button"
        className="crud__icono crud__icono--eliminar"
        aria-label={`Eliminar ${proveedor.razon_social}`}
        title="Eliminar"
        onClick={() => setAEliminar(proveedor)}
      >
        <IconoEliminar tamano={18} />
      </button>
    </>
  )

  return (
    <VistaGestion
      titulo="Proveedores"
      descripcion="Administra los proveedores y las condiciones de abastecimiento."
    >
      <div className="gestion__cabecera">
        <div />
        <button type="button" className="crud__boton crud__boton--nuevo" onClick={abrirNuevo}>
          <IconoAgregar tamano={16} />
          Nuevo proveedor
        </button>
      </div>

      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={proveedores}
        claveFila={(p) => p.id_proveedor}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay proveedores registrados."
        acciones={acciones}
      />

      <ModalCrud abierto={modal} titulo="Proveedor" onCerrar={() => setModal(false)}>
        <form className="crud__form" onSubmit={guardarProveedor}>
          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label">NIT</label>
              <input
                className="crud__campo-input"
                value={form.nit_proveedor}
                onChange={(e) => cambiarCampo('nit_proveedor', e.target.value)}
                placeholder="900123456-7"
                required
              />
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">Razón social</label>
              <input
                className="crud__campo-input"
                value={form.razon_social}
                onChange={(e) => cambiarCampo('razon_social', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label">Teléfono</label>
              <input
                className="crud__campo-input"
                value={form.telefono}
                onChange={(e) => cambiarCampo('telefono', e.target.value)}
                placeholder="6012345678"
                required
              />
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">Email</label>
              <input
                className="crud__campo-input"
                type="email"
                value={form.email}
                onChange={(e) => cambiarCampo('email', e.target.value)}
                required
              />
            </div>
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

          <div className="crud__form-acciones">
            <button type="button" className="crud__boton" onClick={() => setModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="crud__boton" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </ModalCrud>

      {aEliminar && (
        <Confirmar
          titulo="Desactivar proveedor"
          mensaje={`¿Desactivar a "${aEliminar.razon_social}"?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </VistaGestion>
  )
}