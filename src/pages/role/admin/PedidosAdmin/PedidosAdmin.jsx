import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import DetallePedidoAdmin from '@/pages/role/admin/PedidosAdmin/DetallePedidoAdmin'
import {
  getPedidos,
  getRepartidores,
} from '@/services/admin'
import { IconoOjo } from '@/components/ui/Iconos/Iconos'
import { formatoPrecio } from '@/utils/formato'

const ETIQUETAS_ESTADO = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ASIGNADO: 'Asignado',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  CANCELADO: 'Cancelado',
}

const LIMITE_POR_PAGINA = 10

function obtenerBadge(estado) {
  const mapa = {
    PENDIENTE: 'pendiente',
    CONFIRMADO: 'confirmado',
    ASIGNADO: 'asignado',
    EN_CAMINO: 'en-camino',
    ENTREGADO: 'activo',
    NO_ENTREGADO: 'inactivo',
    CANCELADO: 'cancelado',
  }
  return mapa[estado] || 'cancelado'
}

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [repartidorFiltro, setRepartidorFiltro] = useState('')
  const [repartidores, setRepartidores] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [vistaDetalle, setVistaDetalle] = useState(null)

  function cargarTodo() {
    setCargando(true)
    setError('')
    const filtros = { page, limit: LIMITE_POR_PAGINA }
    if (estadoFiltro) filtros.estado = estadoFiltro
    if (repartidorFiltro) filtros.repartidor = repartidorFiltro
    getPedidos(filtros)
      .then((resultado) => {
        setPedidos(resultado.data)
        setTotal(resultado.total)
      })
      .catch((e) => setError(e.message || 'No se pudieron cargar los pedidos.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [page, estadoFiltro, repartidorFiltro])

  useEffect(() => {
    getRepartidores()
      .then(setRepartidores)
      .catch(() => setRepartidores([]))
  }, [])

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_POR_PAGINA))

  function cambiarPagina(nueva) {
    if (nueva < 1 || nueva > totalPaginas) return
    setPage(nueva)
  }

  const columnas = [
    {
      clave: 'id_pedido',
      etiqueta: 'N°',
      alineacion: 'centro',
      render: (p) => <span className="crud__texto-principal">#{p.id_pedido}</span>,
    },
    {
      clave: 'fecha_pedido',
      etiqueta: 'Fecha',
      render: (p) =>
        new Date(p.fecha_pedido).toLocaleString('es-CO', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
    {
      clave: 'cliente',
      etiqueta: 'Cliente',
      render: (p) => (
        <div>
          <div className="crud__texto-principal">{p.clienteNombre}</div>
          <div className="crud__texto-secundario">{p.clienteTelefono}</div>
        </div>
      ),
    },
    { clave: 'direccion_entrega', etiqueta: 'Dirección' },
    {
      clave: 'total',
      etiqueta: 'Total',
      render: (p) => formatoPrecio(Number(p.total)),
    },
    {
      clave: 'id_repartidor',
      etiqueta: 'Repartidor',
      render: (p) =>
        p.id_repartidor ? (
          <span className="crud__texto-secundario">
            {repartidores.find((r) => Number(r.id_repartidor) === Number(p.id_repartidor))?.nombre ||
              `#${p.id_repartidor}`}
          </span>
        ) : (
          <span className="crud__texto-secundario">—</span>
        ),
    },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      alineacion: 'centro',
      render: (p) => (
        <span className={`crud__badge crud__badge--${obtenerBadge(p.estado)}`}>
          {ETIQUETAS_ESTADO[p.estado] || p.estado}
        </span>
      ),
    },
  ]

  const acciones = (pedido) => (
    <>
      <button
        type="button"
        className="crud__icono"
        aria-label={`Ver detalle del pedido ${pedido.id_pedido}`}
        title="Ver detalle"
        onClick={() => setVistaDetalle(pedido.id_pedido)}
      >
        <IconoOjo tamano={18} />
      </button>
    </>
  )

  if (vistaDetalle) {
    return (
      <DetallePedidoAdmin
        pedidoId={vistaDetalle}
        onVolver={() => setVistaDetalle(null)}
        onActualizado={cargarTodo}
      />
    )
  }

  return (
    <VistaGestion
      titulo="Pedidos"
      descripcion="Consulta, confirma, asigna repartidor y gestiona el estado de los pedidos."
    >
      <div className="gestion__cabecera">
        <div className="crud__fila">
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="pedido-estado-filtro">Estado</label>
            <select
              id="pedido-estado-filtro"
              className="crud__campo-select"
              value={estadoFiltro}
              onChange={(e) => {
                setPage(1)
                setEstadoFiltro(e.target.value)
              }}
            >
              <option value="">Todos</option>
              {Object.entries(ETIQUETAS_ESTADO).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="pedido-repartidor-filtro">Repartidor</label>
            <select
              id="pedido-repartidor-filtro"
              className="crud__campo-select"
              value={repartidorFiltro}
              onChange={(e) => {
                setPage(1)
                setRepartidorFiltro(e.target.value)
              }}
            >
              <option value="">Todos</option>
              {repartidores.map((r) => (
                <option key={r.id_repartidor} value={r.id_repartidor}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <TablaCrud
        columnas={columnas}
        filas={pedidos}
        claveFila={(p) => p.id_pedido}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay pedidos registrados."
        acciones={acciones}
      />

      <div className="crud__paginacion">
        <span className="crud__texto-secundario">
          Página {page} de {totalPaginas} · {total} pedidos
        </span>
        <div>
          <button
            type="button"
            className="crud__boton"
            onClick={() => cambiarPagina(page - 1)}
            disabled={page <= 1 || cargando}
          >
            Anterior
          </button>
          <button
            type="button"
            className="crud__boton"
            onClick={() => cambiarPagina(page + 1)}
            disabled={page >= totalPaginas || cargando}
          >
            Siguiente
          </button>
        </div>
      </div>
    </VistaGestion>
  )
}