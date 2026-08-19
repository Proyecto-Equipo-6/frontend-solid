import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import { getRoles, actualizarRol } from '@/services/admin'

export default function RolesAdmin() {
  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')

  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [guardando, setGuardando] = useState(false)

  function cargarTodo() {
    setCargando(true)
    setError('')
    getRoles()
      .then(setRoles)
      .catch((e) => setError(e.message || 'No se pudieron cargar los roles.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function abrirEdicion(rol) {
    setForm({ name: rol.name, description: rol.description || '' })
    setEditando(rol)
  }

  async function guardarRol(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      await actualizarRol({ id: editando.id, ...form })
      setAlerta(`Rol "${form.name}" actualizado correctamente.`)
      setEditando(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const columnas = [
    {
      clave: 'id',
      etiqueta: 'ID',
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
    <button type="button" className="crud__boton--editar" onClick={() => abrirEdicion(rol)}>
      Editar
    </button>
  )

  return (
    <VistaGestion
      titulo="Roles"
      descripcion="Consulta y actualiza la descripción de los roles del sistema."
    >
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

      <ModalCrud abierto={Boolean(editando)} titulo="Editar rol" onCerrar={() => setEditando(null)}>
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
            <button type="button" className="crud__boton" onClick={() => setEditando(null)}>
              Cancelar
            </button>
            <button type="submit" className="crud__boton" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </ModalCrud>
    </VistaGestion>
  )
}