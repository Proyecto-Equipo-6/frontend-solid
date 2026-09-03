import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import FiltroEstado from '@/components/crud/FiltroEstado'
import HistorialRepartidor from './HistorialRepartidor'
import { getRepartidores } from '@/services/admin'
import {
  IconoBuscar,
  IconoOjo,
  IconoActivo,
  IconoInactivo,
  IconoRepartidor,
} from '@/components/ui/Iconos/Iconos'

const OPCIONES_ESTADO = [
  { clave: 'activos', etiqueta: 'Activos', icono: IconoActivo, clase: 'activo' },
  { clave: 'inactivos', etiqueta: 'Inactivos', icono: IconoInactivo, clase: 'inactivo' },
  { clave: 'todos', etiqueta: 'Todos', icono: IconoRepartidor, clase: 'todos' },
]

const ESTADOS_BADGE = {
  INACTIVO: { clase: 'inactivo', texto: 'Inactivo' },
  OCUPADO: { clase: 'activo', texto: 'Activo' },
  DISPONIBLE: { clase: 'activo', texto: 'Activo' },
}

export default function RepartidoresAdmin() {
  const [repartidores, setRepartidores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [filtro, setFiltro] = useState('activos')
  const [busqueda, setBusqueda] = useState('')
  const [historialRepartidor, setHistorialRepartidor] = useState(null)

  function cargarTodo() {
    setCargando(true)
    setError('')
    getRepartidores({ estado: 'Todos' })
      .then(setRepartidores)
      .catch((e) => setError(e.message || 'No se pudieron cargar los repartidores.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  const esActivo = (r) => r.estado === 'DISPONIBLE' || r.estado === 'OCUPADO'

  const filtradosPorEstado = repartidores.filter((r) => {
    if (filtro === 'activos') return esActivo(r)
    if (filtro === 'inactivos') return !esActivo(r)
    return true
  })

  const termino = busqueda.trim().toLowerCase()
  const filas = termino
    ? filtradosPorEstado.filter(
        (r) =>
          String(r.id_repartidor).includes(termino) ||
          (r.nombre || r.nombre_apellido || '').toLowerCase().includes(termino)
      )
    : filtradosPorEstado

  const conteos = {
    activos: repartidores.filter(esActivo).length,
    inactivos: repartidores.filter((r) => !esActivo(r)).length,
    todos: repartidores.length,
  }

  const columnas = [
    {
      clave: 'id_repartidor',
      etiqueta: 'ID Repartidor',
      alineacion: 'centro',
      render: (r) => <span className="crud__texto-secundario">{r.id_repartidor}</span>,
    },
    {
      clave: 'nombre',
      etiqueta: 'Nombre',
      render: (r) => <span className="crud__texto-principal">{r.nombre || r.nombre_apellido}</span>,
    },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'email', etiqueta: 'Correo' },
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
    {
      clave: 'pedidos_hoy',
      etiqueta: 'Pedidos Hoy',
      alineacion: 'centro',
      render: (r) => r.pedidos_hoy ?? '—',
    },
    {
      clave: 'pedidos_semana',
      etiqueta: 'Pedidos Semana',
      alineacion: 'centro',
      render: (r) => r.pedidos_semana ?? '—',
    },
    {
      clave: 'pedidos_mes',
      etiqueta: 'Pedidos Mes',
      alineacion: 'centro',
      render: (r) => r.pedidos_mes ?? '—',
    },
  ]

  const acciones = (repartidor) => (
    <button
      type="button"
      className="crud__icono"
      aria-label={`Ver historial de ${repartidor.nombre || repartidor.nombre_apellido}`}
      title="Ver historial"
      onClick={() => setHistorialRepartidor(repartidor)}
    >
      <IconoOjo tamano={26} />
    </button>
  )

  if (historialRepartidor) {
    return (
      <HistorialRepartidor
        repartidor={historialRepartidor}
        onVolver={() => setHistorialRepartidor(null)}
      />
    )
  }

  return (
    <VistaGestion
      titulo="Repartidores"
      descripcion="Consulta la flota de repartidores, sus métricas de pedidos y su historial individual."
    >
      <div className="gestion__cabecera">
        <FiltroEstado
          valor={filtro}
          onCambiar={setFiltro}
          conteos={conteos}
          opciones={OPCIONES_ESTADO}
        />
        <label className="crud__buscar">
          <span className="crud__buscar-icono">
            <IconoBuscar tamano={16} />
          </span>
          <input
            className="crud__buscar-input"
            type="search"
            placeholder="Buscar por ID o nombre…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar repartidor por ID o nombre"
          />
        </label>
      </div>

      <TablaCrud
        columnas={columnas}
        filas={filas}
        claveFila={(r) => r.id_repartidor}
        cargando={cargando}
        error={error}
        mensajeVacio={
          termino
            ? 'No se encontraron repartidores con ese criterio.'
            : 'No hay repartidores registrados.'
        }
        acciones={acciones}
      />
    </VistaGestion>
  )
}