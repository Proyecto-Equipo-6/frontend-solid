import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import FiltroEstado from '@/components/crud/FiltroEstado'
import {
  getRepartidores,
  cambiarEstadoRepartidor,
  crearRepartidor,
  actualizarRepartidor,
  eliminarRepartidor,
} from '@/services/admin'
import {
  IconoEditar,
  IconoEliminar,
  IconoReactivar,
  IconoAgregar,
} from '@/components/ui/Iconos/Iconos'

const FORM_VACIO = {
  nombre_apellido: '',
  email: '',
  password: '',
  telefono: '',
}

const ESTADOS_BADGE = {
  INACTIVO: { clase: 'inactivo', texto: 'Inactivo' },
  OCUPADO: { clase: 'ocupado', texto: 'Ocupado' },
  DISPONIBLE: { clase: 'activo', texto: 'Disponible' },
}

export default function RepartidoresAdmin() {
  const [repartidores, setRepartidores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')

  const [modal, setModal] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const [filtro, setFiltro] = useState('activos')

  function cargarTodo() {
    setCargando(true)
    setError('')
    getRepartidores({ estado: 'Todos' })
      .then(setRepartidores)
      .catch((e) => setError(e.message || 'No se pudieron cargar los repartidores.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModal(true)
  }

  function abrirEdicion(repartidor) {
    setForm({
      nombre_apellido: repartidor.nombre_apellido || repartidor.nombre || '',
      email: repartidor.email || '',
      password: '',
      telefono: repartidor.telefono || '',
    })
    setEditandoId(repartidor.id_repartidor)
    setModal(true)
  }

  function cambiarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardarRepartidor(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      const datos = {
        nombre_apellido: form.nombre_apellido,
        email: form.email,
        telefono: form.telefono,
      }
      if (editandoId) {
        await actualizarRepartidor(editandoId, datos)
        setAlerta('Repartidor actualizado correctamente.')
      } else {
        await crearRepartidor({ ...datos, password: form.password })
        setAlerta('Repartidor creado correctamente.')
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
      await eliminarRepartidor(aEliminar.id_repartidor)
      setAlerta('Repartidor eliminado correctamente.')
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
      clave: 'id_repartidor',
      etiqueta: 'ID',
      alineacion: 'centro',
      render: (r) => <span className="crud__texto-secundario">{r.id_repartidor}</span>,
    },
    {
      clave: 'nombre',
      etiqueta: 'Repartidor',
      render: (r) => <span className="crud__texto-principal">{r.nombre}</span>,
    },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'email', etiqueta: 'Email' },
    {
      clave: 'pedidos_hoy',
      etiqueta: 'Hoy',
      render: (r) => r.pedidos_hoy ?? '—',
    },
    {
      clave: 'pedidos_semana',
      etiqueta: 'Semana',
      render: (r) => r.pedidos_semana ?? '—',
    },
    {
      clave: 'pedidos_mes',
      etiqueta: 'Mes',
      render: (r) => r.pedidos_mes ?? '—',
    },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      alineacion: 'centro',
      render: (r) => {
        const badge = ESTADOS_BADGE[r.estado] || ESTADOS_BADGE.DISPONIBLE
        return (
          <span className={`crud__badge crud__badge--${badge.clase}`}>
            {badge.texto}
          </span>
        )
      },
    },
  ]

  const acciones = (repartidor) => (
    <>
      {filtro === 'inactivos' ? (
        <button
          type="button"
          className="crud__icono crud__icono--reactivar"
          aria-label={`Activar ${repartidor.nombre}`}
          title="Activar"
          onClick={() => reactivarRepartidor(repartidor)}
        >
          <IconoReactivar tamano={18} />
        </button>
      ) : (
        <>
          <button
            type="button"
            className="crud__icono crud__icono--editar"
            aria-label={`Editar ${repartidor.nombre}`}
            title="Editar"
            onClick={() => abrirEdicion(repartidor)}
          >
            <IconoEditar tamano={18} />
          </button>
          <button
            type="button"
            className="crud__icono crud__icono--eliminar"
            aria-label={`Eliminar ${repartidor.nombre}`}
            title="Eliminar"
            onClick={() => setAEliminar(repartidor)}
          >
            <IconoEliminar tamano={18} />
          </button>
        </>
      )}
    </>
  )

  async function reactivarRepartidor(repartidor) {
    setAlerta('')
    try {
      await cambiarEstadoRepartidor(repartidor.id_repartidor, 'DISPONIBLE')
      setAlerta(`Repartidor "${repartidor.nombre}" puesto en disponible.`)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    }
  }

  const esActivo = (r) => r.estado === 'DISPONIBLE' || r.estado === 'OCUPADO'
  const activos = repartidores.filter(esActivo)
  const inactivos = repartidores.filter((r) => !esActivo(r))
  const filas = filtro === 'activos' ? activos : inactivos

  return (
    <VistaGestion
      titulo="Repartidores"
      descripcion="Administra los repartidores: crea, edita, elimina y controla su estado operativo."
    >
      <div className="gestion__cabecera">
        <FiltroEstado
          valor={filtro}
          onCambiar={setFiltro}
          conteos={{ activos: activos.length, inactivos: inactivos.length }}
        />
        <button type="button" className="crud__boton crud__boton--nuevo" onClick={abrirNuevo}>
          <IconoAgregar tamano={16} />
          Nuevo repartidor
        </button>
      </div>

      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={filas}
        claveFila={(r) => r.id_repartidor}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay repartidores registrados."
        acciones={acciones}
      />

      <ModalCrud
        abierto={modal}
        titulo={editandoId ? 'Editar repartidor' : 'Nuevo repartidor'}
        onCerrar={() => setModal(false)}
      >
        <form className="crud__form" onSubmit={guardarRepartidor}>
          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label" htmlFor="repartidor-nombre">Nombre completo</label>
              <input
                id="repartidor-nombre"
                className="crud__campo-input"
                value={form.nombre_apellido}
                onChange={(e) => cambiarCampo('nombre_apellido', e.target.value)}
                required
              />
            </div>
            <div className="crud__campo">
              <label className="crud__campo-label" htmlFor="repartidor-email">Email</label>
              <input
                id="repartidor-email"
                className="crud__campo-input"
                type="email"
                value={form.email}
                onChange={(e) => cambiarCampo('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="crud__fila">
            <div className="crud__campo">
              <label className="crud__campo-label" htmlFor="repartidor-telefono">Teléfono</label>
              <input
                id="repartidor-telefono"
                className="crud__campo-input"
                value={form.telefono}
                onChange={(e) => cambiarCampo('telefono', e.target.value)}
                placeholder="6012345678"
                required
              />
            </div>
           
          </div>

          {!editandoId && (
            <div className="crud__campo">
              <label className="crud__campo-label" htmlFor="repartidor-password">Contraseña</label>
              <input
                id="repartidor-password"
                className="crud__campo-input"
                type="password"
                value={form.password}
                onChange={(e) => cambiarCampo('password', e.target.value)}
                placeholder="Mínimo 4 caracteres"
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
          titulo="Eliminar repartidor"
          mensaje={`¿Eliminar al repartidor "${aEliminar.nombre}"?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </VistaGestion>
  )
}