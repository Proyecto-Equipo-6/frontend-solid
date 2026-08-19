import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import { getUsuarios, actualizarEstadoUsuario, getRoles } from '@/services/admin'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')
  const [cambiandoId, setCambiandoId] = useState(null)

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
    <button
      type="button"
      className={Number(usuario.activo) === 1 ? 'crud__boton--eliminar' : 'crud__boton--editar'}
      onClick={() => alternarEstado(usuario)}
      disabled={cambiandoId === usuario.id_usuario}
    >
      {cambiandoId === usuario.id_usuario
        ? 'Procesando…'
        : Number(usuario.activo) === 1
          ? 'Desactivar'
          : 'Activar'}
    </button>
  )

  return (
    <VistaGestion
      titulo="Usuarios"
      descripcion="Consulta los usuarios registrados y activa o desactiva su acceso."
    >
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
    </VistaGestion>
  )
}