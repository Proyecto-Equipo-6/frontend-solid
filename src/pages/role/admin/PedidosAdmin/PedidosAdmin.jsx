import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import {
  getPedidos,
  getDetallePedido,
  actualizarEstadoPedido,
  cancelarPedido,
  asignarRepartidorPedido,
  getTicketPedido,
  getRepartidores,
} from '@/services/admin'
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

const TRANSICIONES = {
  PENDIENTE: [{ valor: 'CONFIRMADO', etiqueta: 'Confirmar' }],
  CONFIRMADO: [{ valor: 'ASIGNADO', etiqueta: 'Asignar a repartidor' }],
  ASIGNADO: [{ valor: 'EN_CAMINO', etiqueta: 'Marcar en camino' }],
  EN_CAMINO: [
    { valor: 'ENTREGADO', etiqueta: 'Marcar entregado' },
    { valor: 'NO_ENTREGADO', etiqueta: 'Marcar no entregado' },
  ],
  NO_ENTREGADO: [],
  ENTREGADO: [],
  CANCELADO: [],
}

const MOTIVOS_CANCELACION = [
  'Cliente canceló',
  'Pago no confirmado',
  'Producto no disponible',
  'Error en el pedido',
  'Otro',
]

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
  const [alerta, setAlerta] = useState('')
  const [cambiandoId, setCambiandoId] = useState(null)

  const [detalle, setDetalle] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [aAsignar, setAAsignar] = useState(null)
  const [repartidorSel, setRepartidorSel] = useState('')
  const [asignando, setAsignando] = useState(false)

  const [aCancelar, setACancelar] = useState(null)
  const [cancelForm, setCancelForm] = useState({ motivo: MOTIVOS_CANCELACION[0], observaciones: '', reintegrar: true })
  const [cancelando, setCancelando] = useState(false)

  const [aTicket, setATicket] = useState(null)

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

  function aplicarTransicion(pedido, estado) {
    setCambiandoId(pedido.id_pedido)
    setAlerta('')
    actualizarEstadoPedido(pedido.id_pedido, estado)
      .then(() => {
        setAlerta(`Pedido #${pedido.id_pedido} actualizado a "${ETIQUETAS_ESTADO[estado]}".`)
        cargarTodo()
      })
      .catch((e) => setAlerta(e.message))
      .finally(() => setCambiandoId(null))
  }

  function verDetalle(pedido) {
    setDetalle(null)
    setCargandoDetalle(true)
    getDetallePedido(pedido.id_pedido)
      .then((data) => {
        const repartidor = repartidores.find((r) => Number(r.id_repartidor) === Number(data.id_repartidor))
        setDetalle({ ...data, repartidorNombre: repartidor?.nombre })
      })
      .catch((e) => setAlerta(e.message))
      .finally(() => setCargandoDetalle(false))
  }

  async function guardarAsignacion(evento) {
    evento.preventDefault()
    setAsignando(true)
    setAlerta('')
    try {
      await asignarRepartidorPedido(aAsignar.id_pedido, Number(repartidorSel))
      setAlerta(`Pedido #${aAsignar.id_pedido} asignado al repartidor.`)
      setAAsignar(null)
      setRepartidorSel('')
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setAsignando(false)
    }
  }

  async function guardarCancelacion(evento) {
    evento.preventDefault()
    setCancelando(true)
    setAlerta('')
    try {
      const opciones = { reintegrar_stock: cancelForm.reintegrar }
      if (cancelForm.observaciones.trim()) opciones.observaciones = cancelForm.observaciones.trim()
      await cancelarPedido(aCancelar.id_pedido, cancelForm.motivo, opciones)
      setAlerta(`Pedido #${aCancelar.id_pedido} cancelado correctamente.`)
      setACancelar(null)
      setCancelForm({ motivo: MOTIVOS_CANCELACION[0], observaciones: '', reintegrar: true })
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setCancelando(false)
    }
  }

  function abrirTicket(pedido) {
    setATicket(pedido.id_pedido)
    setAlerta('')
    getTicketPedido(pedido.id_pedido)
      .then((ticket) => {
        const ventana = window.open('', '_blank')
        if (ventana) {
          ventana.document.write(ticket.html)
          ventana.document.close()
          ventana.print()
        }
      })
      .catch((e) => setAlerta(e.message))
      .finally(() => setATicket(null))
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
        p.id_repartidor
          ? `#${p.id_repartidor}`
          : <span className="crud__texto-secundario">—</span>,
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
      <button type="button" onClick={() => verDetalle(pedido)}>
        Ver
      </button>
      {TRANSICIONES[pedido.estado]?.length > 0 && (
        <button
          type="button"
          onClick={() => aplicarTransicion(pedido, TRANSICIONES[pedido.estado][0].valor)}
          disabled={cambiandoId === pedido.id_pedido}
        >
          {TRANSICIONES[pedido.estado][0].etiqueta}
        </button>
      )}
      {pedido.estado === 'CONFIRMADO' && (
        <button
          type="button"
          onClick={() => {
            setRepartidorSel('')
            setAAsignar(pedido)
          }}
        >
          Asignar
        </button>
      )}
      {pedido.estado === 'CONFIRMADO' && (
        <button
          type="button"
          className="crud__boton--editar"
          onClick={() => abrirTicket(pedido)}
          disabled={aTicket === pedido.id_pedido}
        >
          {aTicket === pedido.id_pedido ? 'Generando…' : 'Ticket'}
        </button>
      )}
      {!['ENTREGADO', 'CANCELADO', 'EN_CAMINO'].includes(pedido.estado) && (
        <button
          type="button"
          className="crud__boton--eliminar"
          onClick={() => {
            setCancelForm({ motivo: MOTIVOS_CANCELACION[0], observaciones: '', reintegrar: true })
            setACancelar(pedido)
          }}
        >
          Cancelar
        </button>
      )}
    </>
  )

  return (
    <VistaGestion
      titulo="Pedidos"
      descripcion="Consulta, confirma, asigna repartidor y gestiona el estado de los pedidos."
    >
      <div className="gestion__cabecera">
        <div className="crud__fila">
          <div className="crud__campo">
            <label className="crud__campo-label">Estado</label>
            <select
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
            <label className="crud__campo-label">Repartidor</label>
            <select
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

      {alerta && <p className="crud__alerta">{alerta}</p>}

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

      <ModalCrud abierto={Boolean(detalle) || cargandoDetalle} titulo="Detalle del pedido" onCerrar={() => setDetalle(null)}>
        {cargandoDetalle ? (
          <p className="crud__mensaje">Cargando detalle…</p>
        ) : (
          detalle && (
            <div className="crud__resumen">
              <div className="crud__resumen-fila">
                <span>Pedido</span>
                <strong>#{detalle.id_pedido}</strong>
              </div>
              <div className="crud__resumen-fila">
                <span>Estado</span>
                <strong>
                  <span className={`crud__badge crud__badge--${obtenerBadge(detalle.estado)}`}>
                    {ETIQUETAS_ESTADO[detalle.estado] || detalle.estado}
                  </span>
                </strong>
              </div>
              <div className="crud__resumen-fila">
                <span>Cliente</span>
                <strong>{detalle.cliente?.nombre}</strong>
              </div>
              <div className="crud__resumen-fila">
                <span>Teléfono</span>
                <strong>{detalle.cliente?.telefono}</strong>
              </div>
              <div className="crud__resumen-fila">
                <span>Dirección</span>
                <strong>{detalle.direccion_entrega}</strong>
              </div>
              {detalle.repartidorNombre && (
                <div className="crud__resumen-fila">
                  <span>Repartidor</span>
                  <strong>{detalle.repartidorNombre}</strong>
                </div>
              )}
              <div className="crud__resumen-productos">
                <span>Productos</span>
                {detalle.productos.map((producto) => (
                  <div key={producto.id_producto} className="crud__resumen-producto">
                    <span>
                      {producto.producto_nombre || `Producto #${producto.id_producto}`} × {producto.cantidad}
                    </span>
                    <span>{formatoPrecio(Number(producto.subtotal))}</span>
                  </div>
                ))}
              </div>
              <div className="crud__resumen-fila">
                <span>Total</span>
                <strong>{formatoPrecio(Number(detalle.total))}</strong>
              </div>
            </div>
          )
        )}
      </ModalCrud>

      <ModalCrud abierto={Boolean(aAsignar)} titulo="Asignar repartidor" onCerrar={() => setAAsignar(null)}>
        <form className="crud__form" onSubmit={guardarAsignacion}>
          <p className="crud__modal-texto">
            Pedido <strong>#{aAsignar?.id_pedido}</strong> · Total{' '}
            <strong>{formatoPrecio(Number(aAsignar?.total))}</strong>
          </p>
          <div className="crud__campo">
            <label className="crud__campo-label">Repartidor</label>
            <select
              className="crud__campo-select"
              value={repartidorSel}
              onChange={(e) => setRepartidorSel(e.target.value)}
              required
            >
              <option value="">Selecciona…</option>
              {repartidores
                .filter((r) => r.estado === 'DISPONIBLE')
                .map((r) => (
                  <option key={r.id_repartidor} value={r.id_repartidor}>
                    {r.nombre}
                  </option>
                ))}
            </select>
          </div>
          <div className="crud__form-acciones">
            <button type="button" className="crud__boton" onClick={() => setAAsignar(null)}>
              Cancelar
            </button>
            <button type="submit" className="crud__boton" disabled={asignando}>
              {asignando ? 'Asignando…' : 'Asignar'}
            </button>
          </div>
        </form>
      </ModalCrud>

      <ModalCrud abierto={Boolean(aCancelar)} titulo="Cancelar pedido" onCerrar={() => setACancelar(null)}>
        <form className="crud__form" onSubmit={guardarCancelacion}>
          <p className="crud__modal-texto">
            Pedido <strong>#{aCancelar?.id_pedido}</strong>
          </p>
          <div className="crud__campo">
            <label className="crud__campo-label">Motivo</label>
            <select
              className="crud__campo-select"
              value={cancelForm.motivo}
              onChange={(e) => setCancelForm((prev) => ({ ...prev, motivo: e.target.value }))}
            >
              {MOTIVOS_CANCELACION.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label">Observaciones</label>
            <textarea
              className="crud__campo-textarea"
              value={cancelForm.observaciones}
              onChange={(e) => setCancelForm((prev) => ({ ...prev, observaciones: e.target.value }))}
              placeholder={cancelForm.motivo === 'Otro' ? 'Indica el motivo…' : 'Opcional'}
            />
          </div>
          <label className="crud__campo-label crud__campo-check">
            <input
              type="checkbox"
              checked={cancelForm.reintegrar}
              onChange={(e) => setCancelForm((prev) => ({ ...prev, reintegrar: e.target.checked }))}
            />
            Reintegrar stock de los productos
          </label>
          <div className="crud__form-acciones">
            <button type="button" className="crud__boton" onClick={() => setACancelar(null)}>
              Volver
            </button>
            <button type="submit" className="crud__boton--peligro crud__boton" disabled={cancelando}>
              {cancelando ? 'Cancelando…' : 'Confirmar cancelación'}
            </button>
          </div>
        </form>
      </ModalCrud>
    </VistaGestion>
  )
}