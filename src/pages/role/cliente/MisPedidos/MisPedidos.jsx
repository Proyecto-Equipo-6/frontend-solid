import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '@/components/ui/Alerta/Alerta'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import { IconoOjo, IconoPaquete } from '@/components/ui/Iconos/Iconos'
import { getMisPedidos, cancelarPedidoCliente } from '@/services/pedidos'
import { formatoPrecio } from '@/utils/formato'
import './MisPedidos.css'

const ETIQUETAS_ESTADO = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ASIGNADO: 'Asignado',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  CANCELADO: 'Cancelado',
}

const COLORES_ESTADO = {
  PENDIENTE: '#f59e0b',
  CONFIRMADO: '#0284c7',
  ASIGNADO: '#7c3aed',
  EN_CAMINO: '#0e7490',
  ENTREGADO: '#16a34a',
  NO_ENTREGADO: '#dc2626',
  CANCELADO: '#6b7280',
}

const MAPA_CLASE_ESTADO = {
  PENDIENTE: 'mis-pedidos__fila--pendiente',
  CONFIRMADO: 'mis-pedidos__fila--confirmado',
  ASIGNADO: 'mis-pedidos__fila--asignado',
  EN_CAMINO: 'mis-pedidos__fila--en-camino',
  ENTREGADO: 'mis-pedidos__fila--entregado',
  NO_ENTREGADO: 'mis-pedidos__fila--no-entregado',
  CANCELADO: 'mis-pedidos__fila--cancelado',
}

function normalizarPedidos(pedidos) {
  return (pedidos || []).map((pedido) => ({
    id_pedido: pedido.id_pedido,
    fecha: new Date(pedido.fecha_pedido),
    direccion: pedido.direccion_entrega,
    total: Number(pedido.total),
    estado: pedido.estado,
    observaciones: pedido.observaciones,
    motivo_cancelacion: pedido.motivo_cancelacion,
  }))
}

function BadgeEstado({ estado }) {
  const color = COLORES_ESTADO[estado] || '#6b7280'
  return (
    <span className="mis-pedidos__badge" style={{ color, background: `${color}1a` }}>
      <span className="mis-pedidos__badge-dot" aria-hidden="true" />
      {ETIQUETAS_ESTADO[estado] || estado}
    </span>
  )
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState(null)
  const [aCancelar, setACancelar] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [cancelando, setCancelando] = useState(false)
  const [detalle, setDetalle] = useState(null)

  function cargar(estado = filtro) {
    setCargando(true)
    setAviso(null)
    getMisPedidos(estado)
      .then((resultado) => setPedidos(normalizarPedidos(resultado.pedidos)))
      .catch(() => {
        setPedidos([])
        setAviso({ variante: 'error', texto: 'No se pudieron cargar tus pedidos.' })
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargar('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cambiarFiltro(estado) {
    setFiltro(estado)
    cargar(estado)
  }

  async function confirmarCancelacion(evento) {
    evento.preventDefault()
    setCancelando(true)
    setAviso(null)
    try {
      const resultado = await cancelarPedidoCliente(aCancelar.id_pedido, motivo.trim())
      setAviso({ variante: 'exito', texto: resultado.mensaje || 'Pedido cancelado correctamente.' })
      setACancelar(null)
      setMotivo('')
      cargar(filtro)
    } catch (e) {
      setAviso({ variante: 'error', texto: e.message })
    } finally {
      setCancelando(false)
    }
  }

  const columnas = [
    {
      clave: 'id_pedido',
      etiqueta: 'N°',
      render: (p) => <span className="crud__texto-principal">#{p.id_pedido}</span>,
    },
    {
      clave: 'fecha',
      etiqueta: 'Fecha',
      render: (p) =>
        p.fecha.toLocaleString('es-CO', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
    { clave: 'direccion', etiqueta: 'Dirección' },
    {
      clave: 'total',
      etiqueta: 'Total',
      render: (p) => <span className="crud__texto-principal">{formatoPrecio(p.total)}</span>,
    },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      render: (p) => <BadgeEstado estado={p.estado} />,
    },
  ]

  const acciones = (pedido) => (
    <>
      <button
        type="button"
        className="crud__icono mis-pedidos__ojo"
        aria-label={`Ver detalle del pedido ${pedido.id_pedido}`}
        title="Ver detalle"
        onClick={() => setDetalle(pedido)}
      >
        <IconoOjo tamano={18} />
      </button>
      {pedido.estado === 'PENDIENTE' && (
        <button
          type="button"
          className="crud__boton crud__boton--eliminar"
          onClick={() => {
            setMotivo('')
            setACancelar(pedido)
          }}
        >
          Cancelar
        </button>
      )}
    </>
  )

  return (
    <section className="mis-pedidos">
      <header className="mis-pedidos__cabecera">
        <h1 className="mis-pedidos__titulo">Mis pedidos</h1>
        <p className="mis-pedidos__descripcion">
          Consulta el estado de tus compras realizadas en Nexbit.
        </p>
      </header>

      <div className="mis-pedidos__filtros">
        <div className="mis-pedidos__filtros-info">
          {!cargando && pedidos.length > 0 && (
            <span className="mis-pedidos__contador">
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          )}
        </div>
        <select
          className="mis-pedidos__select"
          value={filtro}
          onChange={(evento) => cambiarFiltro(evento.target.value)}
          aria-label="Filtrar pedidos por estado"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ETIQUETAS_ESTADO).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
      </div>

      {aviso && <Alerta variante={aviso.variante}>{aviso.texto}</Alerta>}

      {cargando ? (
        <p className="mis-pedidos__mensaje">Cargando tus pedidos…</p>
      ) : pedidos.length === 0 ? (
        <div className="mis-pedidos__vacio">
          <span className="mis-pedidos__vacio-icono" aria-hidden="true">
            <IconoPaquete tamano={40} />
          </span>
          <p className="mis-pedidos__vacio-titulo">No tienes pedidos realizados aún</p>
          <p className="mis-pedidos__vacio-texto">
            Cuando hagas una compra, podrás consultar aquí su estado.
          </p>
          <Link to="/#catalogo" className="mis-pedidos__enlace">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <TablaCrud
          columnas={columnas}
          filas={pedidos}
          claveFila={(p) => p.id_pedido}
          claseFila={(p) => `mis-pedidos__fila ${MAPA_CLASE_ESTADO[p.estado] || ''}`}
          acciones={acciones}
        />
      )}

      <ModalCrud abierto={Boolean(detalle)} titulo="Detalle del pedido" onCerrar={() => setDetalle(null)}>
        {detalle && (
          <div className="crud__resumen">
            <div className="crud__resumen-fila">
              <span>Pedido</span>
              <strong>#{detalle.id_pedido}</strong>
            </div>
            <div className="crud__resumen-fila">
              <span>Estado</span>
              <strong>
                <BadgeEstado estado={detalle.estado} />
              </strong>
            </div>
            <div className="crud__resumen-fila">
              <span>Fecha</span>
              <strong>
                {detalle.fecha.toLocaleString('es-CO', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </strong>
            </div>
            <div className="crud__resumen-fila">
              <span>Dirección</span>
              <strong>{detalle.direccion}</strong>
            </div>
            {detalle.observaciones && (
              <div className="crud__resumen-fila">
                <span>Observaciones</span>
                <strong>{detalle.observaciones}</strong>
              </div>
            )}
            {detalle.motivo_cancelacion && (
              <div className="crud__resumen-fila">
                <span>Motivo de cancelación</span>
                <strong>{detalle.motivo_cancelacion}</strong>
              </div>
            )}
            <div className="crud__resumen-fila">
              <span>Total</span>
              <strong>{formatoPrecio(detalle.total)}</strong>
            </div>
          </div>
        )}
      </ModalCrud>

      {aCancelar && (
        <div className="mis-pedidos__velo" onClick={() => setACancelar(null)}>
          <form
            className="mis-pedidos__modal"
            onClick={(evento) => evento.stopPropagation()}
            onSubmit={confirmarCancelacion}
          >
            <h2 className="mis-pedidos__modal-titulo">Cancelar pedido #{aCancelar.id_pedido}</h2>
            <p className="mis-pedidos__modal-texto">
              ¿Seguro que deseas cancelar este pedido? Esta acción no se puede deshacer.
            </p>
            <label className="mis-pedidos__modal-label" htmlFor="motivo-cancelacion">
              Motivo de la cancelación
            </label>
            <input
              id="motivo-cancelacion"
              className="mis-pedidos__modal-input"
              value={motivo}
              onChange={(evento) => setMotivo(evento.target.value)}
              placeholder="Ej: Ya no lo necesito"
              required
            />
            <div className="mis-pedidos__modal-acciones">
              <button
                type="button"
                className="mis-pedidos__modal-boton"
                onClick={() => setACancelar(null)}
                disabled={cancelando}
              >
                Volver
              </button>
              <button
                type="submit"
                className="mis-pedidos__modal-boton mis-pedidos__modal-boton--peligro"
                disabled={cancelando}
              >
                {cancelando ? 'Cancelando…' : 'Confirmar cancelación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}