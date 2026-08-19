import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import {
  getUsuarios,
  actualizarEstadoUsuario,
  crearUsuarioAdmin,
  actualizarUsuarioAdmin,
  eliminarUsuarioAdmin,
  getRoles,
} from '@/services/admin'
import { IconoPower, IconoEditar, IconoEliminar, IconoAgregar } from '@/components/ui/Iconos/Iconos'

const TIPOS_DOCUMENTO = ['CC', 'CE', 'Pasaporte', 'Otro']

const FORM_VACIO = {
  id_rol: '',
  nombre_apellido: '',
  tipo_documento: 'CC',
  numero_documento: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')
  const [cambiandoId, setCambiandoId] = useState(null)

  const [modal, setModal] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  function cargarTodo() {
    setCargando(true)
    setError('')
    Promise.all([getUsuarios({ limit: 500 }), getRoles()])
      .then(([usuarios, roles]) => {
        setUsuarios(usuarios)
        setRoles(roles)
      })
      .catch((e) => setError(e.message || 'No se pudieron cargar los usuarios.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function nombreRol(idRol) {
    return roles.find((r) => Number(r.id) === Number(idRol))?.name || `Rol ${idRol}`
  }

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModal(true)
  }

  function abrirEdicion(usuario) {
    setForm({
      id_rol: String(usuario.id_rol),
      nombre_apellido: usuario.nombre_apellido || '',
      tipo_documento: usuario.tipo_documento || 'CC',
      numero_documento: usuario.numero_documento || '',
      email: usuario.email || '',
      password: '',
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || '',
    })
    setEditandoId(usuario.id_usuario)
    setModal(true)
  }

  function cambiarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardarUsuario(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      const datos = {
        id_rol: Number(form.id_rol),
        nombre_apellido: form.nombre_apellido,
        tipo_documento: form.tipo_documento,
        numero_documento: form.numero_documento,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
      }
      if (editandoId) {
        await actualizarUsuarioAdmin(editandoId, datos)
        setAlerta('Usuario actualizado correctamente.')
      } else {
        await crearUsuarioAdmin({ ...datos, password: form.password })
        setAlerta('Usuario creado correctamente.')
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
      await eliminarUsuarioAdmin(aEliminar.id_usuario)
      setAlerta('Usuario eliminado correctamente.')
      setAEliminar(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setEliminando(false)
    }
  }

  async function alternarEstado(usuario) {
    setCambiandoId(usuario.id_usuario)
    setAlerta('')
    try {
      const activo = Number(usuario.activo) !== 1
      await actualizarEstadoUsuario(usuario.id_usuario, activo)
      setAlerta(
        activo
          ? `Usuario "${usuario.nombre_apellido}" activado correctamente.`
          : `Usuario "${usuario.nombre_apellido}" desactivado correctamente.`
      )
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setCambiandoId(null)
    }
  }

  const columnas = [
    {
      clave: 'id_usuario',
      etiqueta: 'ID',
      render: (u) => <span className="crud__texto-secundario">{u.id_usuario}</span>,
    },
    {
      clave: 'nombre_apellido',
      etiqueta: 'Usuario',
      render: (u) => <span className="crud__texto-principal">{u.nombre_apellido}</span>,
    },
    { clave: 'email', etiqueta: 'Email' },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    {
      clave: 'rol',
      etiqueta: 'Rol',
      render: (u) => nombreRol(u.id_rol),
    },
    {
      clave: 'activo',
      etiqueta: 'Estado',
      render: (u) => (
        <span className={`crud__badge crud__badge--${Number(u.activo) === 1 ? 'activo' : 'inactivo'}`}>
          {Number(u.activo) === 1 ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ]

  const acciones = (usuario) => (
    <>
      <button
        type="button"
        className={Number(usuario.activo) === 1 ? 'crud__boton' : 'crud__boton crud__boton--nuevo'}
        onClick={() => alternarEstado(usuario)}
        disabled={cambiandoId === usuario.id_usuario}
      >
        <IconoPower tamano={18} />
        {cambiandoId === usuario.id_usuario
          ? 'Procesando…'
          : Number(usuario.activo) === 1
            ? 'Desactivar'
            : 'Activar'}
      </button>
      <button
        type="button"
        className="crud__icono crud__icono--editar"
        aria-label={`Editar ${usuario.nombre_apellido}`}
        title="Editar"
        onClick={() => abrirEdicion(usuario)}
      >
        <IconoEditar tamano={18} />
      </button>
      <button
        type="button"
        className="crud__icono crud__icono--eliminar"
        aria-label={`Eliminar ${usuario.nombre_apellido}`}
        title="Eliminar"
        onClick={() => setAEliminar(usuario)}
      >
        <IconoEliminar tamano={18} />
      </button>
    </>
  )

  return (
    <VistaGestion
      titulo="Usuarios"
      descripcion="Administra los usuarios del sistema: crea, edita, elimina y controla su acceso."
    >
      <div className="gestion__cabecera">
        <div />
        <button type="button" className="crud__boton crud__boton--nuevo" onClick={abrirNuevo}>
          <IconoAgregar tamano={16} />
          Nuevo usuario
        </button>
      </div>

      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={usuarios}
        claveFila={(u) => u.id_usuario}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay usuarios registrados."
        acciones={acciones}
      />

      <ModalCrud
        abierto={modal}
        titulo={editandoId ? 'Editar usuario' : 'Nuevo usuario'}
        onCerrar={() => setModal(false)}
      >
        <form className="crud__form" onSubmit={guardarUsuario}>
          <div className="crud__campo">
            <label className="crud__campo-label">Rol</label>
            <select
              className="crud__campo-input"
              value={form.id_rol}
              onChange={(e) => cambiarCampo('id_rol', e.target.value)}
              required
            >
              <option value="">Selecciona un rol…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="crud__campo">
            <label className="crud__campo-label">Nombre completo</label>
            <input
              className="crud__campo-input"
              value={form.nombre_apellido}
              onChange={(e) => cambiarCampo('nombre_apellido', e.target.value)}
              required
            />
          </div>

          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label">Tipo de documento</label>
              <select
                className="crud__campo-input"
                value={form.tipo_documento}
                onChange={(e) => cambiarCampo('tipo_documento', e.target.value)}
              >
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label">N° de documento</label>
              <input
                className="crud__campo-input"
                value={form.numero_documento}
                onChange={(e) => cambiarCampo('numero_documento', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="crud__fila">
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
            <div className="crud__campo">
              <label className="crud__campo-label">Teléfono</label>
              <input
                className="crud__campo-input"
                value={form.telefono}
                onChange={(e) => cambiarCampo('telefono', e.target.value)}
                placeholder="10 dígitos, ej: 6012345678"
                required
              />
            </div>
          </div>

          <div className="crud__campo">
            <label className="crud__campo-label">Dirección</label>
            <input
              className="crud__campo-input"
              value={form.direccion}
              onChange={(e) => cambiarCampo('direccion', e.target.value)}
              required
            />
          </div>

          {!editandoId && (
            <div className="crud__campo">
              <label className="crud__campo-label">Contraseña</label>
              <input
                className="crud__campo-input"
                type="password"
                value={form.password}
                onChange={(e) => cambiarCampo('password', e.target.value)}
                placeholder="Entre 8 y 20 caracteres"
                required
              />
            </div>
          )}

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
          titulo="Eliminar usuario"
          mensaje={`¿Eliminar al usuario "${aEliminar.nombre_apellido}"?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </VistaGestion>
  )
}