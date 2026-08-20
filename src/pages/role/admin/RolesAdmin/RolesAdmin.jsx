import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import { getRoles, crearRol, actualizarRol, eliminarRol } from '@/services/admin'
import { IconoEditar, IconoEliminar, IconoAgregar } from '@/components/ui/Iconos/Iconos'

const FORM_VACIO = { name: '', description: '' }

export default function RolesAdmin() {
  const [roles, setRoles] = useState([])
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
    getRoles()
      .then(setRoles)
      .catch((e) => setError(e.message || 'No se pudieron cargar los roles.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModal(true)
  }

  function abrirEdicion(rol) {
    setForm({ name: rol.name, description: rol.description || '' })
    setEditandoId(rol.id)
    setModal(true)
  }

  async function guardarRol(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      const datos = { name: form.name, description: form.description }
      if (editandoId) {
        await actualizarRol({ id: editandoId, ...datos })
        setAlerta('Rol actualizado correctamente.')
      } else {
        await crearRol(datos)
        setAlerta('Rol creado correctamente.')
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
      await eliminarRol(aEliminar.id)
      setAlerta('Rol eliminado correctamente.')
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
      clave: 'id',
      etiqueta: 'ID',
      alineacion: 'centro',
      render: (r) => <span className="crud__texto-secundario">{r.id}</span>,
    },
    {
      clave: 'name',
      etiqueta: 'Rol',
      render: (r) => <span className="crud__texto-principal">{r.name}</span>,
    },
    { clave: 'description', etiqueta: 'Descripción' },
  ]

  const acciones = (rol) => (
    <>
      <button
        type="button"
        className="crud__icono crud__icono--editar"
        aria-label={`Editar ${rol.name}`}
        title="Editar"
        onClick={() => abrirEdicion(rol)}
      >
        <IconoEditar tamano={18} />
      </button>
      <button
        type="button"
        className="crud__icono crud__icono--eliminar"
        aria-label={`Eliminar ${rol.name}`}
        title="Eliminar"
        onClick={() => setAEliminar(rol)}
      >
        <IconoEliminar tamano={18} />
      </button>
    </>
  )

  return (
    <VistaGestion
      titulo="Roles"
      descripcion="Crea, edita y elimina los roles del sistema."
    >
      <div className="gestion__cabecera">
        <div />
        <button type="button" className="crud__boton crud__boton--nuevo" onClick={abrirNuevo}>
          <IconoAgregar tamano={16} />
          Nuevo rol
        </button>
      </div>

      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={roles}
        claveFila={(r) => r.id}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay roles registrados."
        acciones={acciones}
      />

      <ModalCrud abierto={modal} titulo={editandoId ? 'Editar rol' : 'Nuevo rol'} onCerrar={() => setModal(false)}>
        <form className="crud__form" onSubmit={guardarRol}>
          <div className="crud__campo">
            <label className="crud__campo-label">Nombre</label>
            <input
              className="crud__campo-input"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label">Descripción</label>
            <textarea
              className="crud__campo-textarea"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
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
          titulo="Eliminar rol"
          mensaje={`¿Eliminar el rol "${aEliminar.name}"?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </VistaGestion>
  )
}