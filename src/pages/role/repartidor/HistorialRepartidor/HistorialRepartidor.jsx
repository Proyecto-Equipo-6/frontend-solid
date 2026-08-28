import { useEffect, useState } from 'react'
import { getHistorialRepartidor } from '@/services/repartidor'
import { ESTADOS_REPARTIDOR } from '@/config/repartidor'
import { formatoPrecio } from '@/utils/formato'
import { IconoOjo } from '@/components/ui/Iconos/Iconos'
import DetallePedidoRepartidor from '@/pages/role/repartidor/DetallePedidoRepartidor/DetallePedidoRepartidor'
import './HistorialRepartidor.css'

function BadgeEstado({ estado }) {
  return (
    <span className={`rep-hist__badge rep-hist__badge--${estado}`}>
      {ESTADOS_REPARTIDOR[estado] || estado}
    </span>
  )
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export default function HistorialRepartidor() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [estado, setEstado] = useState('')
  const [orden, setOrden] = useState('reciente')
  const [historial, setHistorial] = useState(null)
  const [detalleId, setDetalleId] = useState(null)

  function cargar() {
    setCargando(true)
    setError('')
    getHistorialRepartidor({ estado, orden })
      .then(setHistorial)
      .catch(() => setError('No se pudo cargar el historial. Intente nuevamente'))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, orden])

  const pedidos = historial?.pedidos ?? []
  const mensajeVacio = historial?.mensaje || 'No hay pedidos en tu historial.'

  if (detalleId) {
    return (
      <DetallePedidoRepartidor
        pedidoId={detalleId}
        puedeActualizar={false}
        onVolver={() => setDetalleId(null)}
      />
    )
  }

  return (
    <section className="rep-hist">
      <header className="rep-hist__cabecera">
        <h1 className="rep-hist__titulo">Historial de pedidos</h1>
        <p className="rep-hist__descripcion">
          Consulta los pedidos que ya finalizaron su ciclo.
        </p>
      </header>

      {error && (
        <div className="rep-hist__error">
          <p>{error}</p>
          <button type="button" onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      <div className="rep-hist__metricas">
        <div className="rep-hist__metrica">
          <span className="rep-hist__metrica-valor">{historial?.totalSemana ?? 0}</span>
          <span className="rep-hist__metrica-etiqueta">Pedidos esta semana</span>
        </div>
        <div className="rep-hist__metrica">
          <span className="rep-hist__metrica-valor">{historial?.totalMes ?? 0}</span>
          <span className="rep-hist__metrica-etiqueta">Pedidos este mes</span>
        </div>
      </div>

      <div className="rep-hist__filtros">
        <label className="rep-hist__filtro">
          <span className="rep-hist__filtro-etiqueta">Estado</span>
          <select
            className="rep-hist__filtro-control"
            value={estado}
            onChange={(evento) => setEstado(evento.target.value)}
          >
            <option value="">Todos</option>
            {['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'].map((valor) => (
              <option key={valor} value={valor}>
                {ESTADOS_REPARTIDOR[valor]}
              </option>
            ))}
          </select>
        </label>

        <label className="rep-hist__filtro">
          <span className="rep-hist__filtro-etiqueta">Antigüedad</span>
          <select
            className="rep-hist__filtro-control"
            value={orden}
            onChange={(evento) => setOrden(evento.target.value)}
          >
            <option value="reciente">Más reciente</option>
            <option value="antiguo">Más antiguo</option>
          </select>
        </label>
      </div>

      {cargando && <p className="rep-hist__cargando">Cargando historial…</p>}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="rep-hist__vacio">
          <p>{mensajeVacio}</p>
        </div>
      )}

      {!cargando && !error && pedidos.length > 0 && (
        <div className="rep-hist__tabla">
          <table className="rep-hist__table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Dirección</th>
                <th>Total</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td className="rep-hist__numero">#{pedido.id_pedido}</td>
                  <td>{formatearFecha(pedido.fecha)}</td>
                  <td>
                    <BadgeEstado estado={pedido.estado} />
                  </td>
                  <td className="rep-hist__direccion">{pedido.direccion_entrega}</td>
                  <td>{formatoPrecio(Number(pedido.total))}</td>
                  <td className="rep-hist__detalles">
                    <button
                      type="button"
                      className="rep-hist__ojo"
                      aria-label={`Ver detalle del pedido ${pedido.id_pedido}`}
                      title="Ver detalles"
                      onClick={() => setDetalleId(pedido.id_pedido)}
                    >
                      <IconoOjo tamano={26} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}