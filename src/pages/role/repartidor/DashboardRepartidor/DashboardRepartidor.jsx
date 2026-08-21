import { useEffect, useState } from 'react'
import { getDashboardRepartidor } from '@/services/repartidor'
import { ESTADOS_REPARTIDOR, METODO_PAGO_REPARTIDOR } from '@/config/repartidor'
import { formatoPrecio } from '@/utils/formato'
import './DashboardRepartidor.css'

function BadgeEstado({ estado }) {
  return (
    <span className={`rep-dash__badge rep-dash__badge--${estado}`}>
      {ESTADOS_REPARTIDOR[estado] || estado}
    </span>
  )
}

function metodoPago(id) {
  return METODO_PAGO_REPARTIDOR[id] || 'Por definir'
}

function PedidoTarjeta({ pedido, activo, onVerDetalle }) {
  return (
    <article className={`rep-dash__pedido ${activo ? 'rep-dash__pedido--activo' : ''}`}>
      <div className="rep-dash__pedido-cabecera">
        <span className="rep-dash__pedido-numero">Pedido #{pedido.id_pedido}</span>
        {activo && <BadgeEstado estado={pedido.estado} />}
      </div>
      <dl className="rep-dash__datos">
        <div className="rep-dash__dato">
          <dt>Dirección</dt>
          <dd>{pedido.direccion_entrega || '—'}</dd>
        </div>
        <div className="rep-dash__dato">
          <dt>Método de pago</dt>
          <dd>{metodoPago(pedido.id_metodo_pago)}</dd>
        </div>
        <div className="rep-dash__dato">
          <dt>Total</dt>
          <dd>{formatoPrecio(Number(pedido.total))}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="rep-dash__detalle-boton"
        onClick={() => onVerDetalle(pedido, activo)}
      >
        Ver detalles
      </button>
    </article>
  )
}

export default function DashboardRepartidor({ onVerDetalle }) {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [dashboard, setDashboard] = useState(null)

  function cargar() {
    setCargando(true)
    setError('')
    getDashboardRepartidor()
      .then(setDashboard)
      .catch(() => setError('No se pudo cargar el dashboard. Intente nuevamente'))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  return (
    <section className="rep-dash">
      <header className="rep-dash__cabecera">
        <h1 className="rep-dash__titulo">Mis pedidos del día</h1>
        <p className="rep-dash__descripcion">
          Gestiona el pedido activo y los que tienes en cola.
        </p>
      </header>

      {error && (
        <div className="rep-dash__error">
          <p>{error}</p>
          <button type="button" onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      {cargando && <p className="rep-dash__cargando">Cargando tus pedidos…</p>}

      {!cargando && !error && dashboard && (
        <>
          <div className="rep-dash__resumen">
            <span className="rep-dash__conteo">{dashboard.conteoDelDia ?? 0}</span>
            <span className="rep-dash__conteo-etiqueta">
              {dashboard.conteoDelDia === 1 ? 'pedido asignado hoy' : 'pedidos asignados hoy'}
            </span>
          </div>

          {dashboard.pedidoActivo ? (
            <div className="rep-dash__activo">
              <h2 className="rep-dash__seccion-titulo">Pedido activo</h2>
              <PedidoTarjeta pedido={dashboard.pedidoActivo} activo onVerDetalle={onVerDetalle} />
            </div>
          ) : (
            <div className="rep-dash__vacio">
              <p className="rep-dash__vacio-titulo">{dashboard.mensaje || 'No tienes pedidos asignados por el momento'}</p>
              <p className="rep-dash__vacio-texto">Cuando el administrador te asigne un pedido, aparecerá aquí.</p>
            </div>
          )}

          {dashboard.pedidosEnCola?.length > 0 && (
            <div className="rep-dash__cola">
              <h2 className="rep-dash__seccion-titulo">Pedidos en cola</h2>
              <div className="rep-dash__cola-lista">
                {dashboard.pedidosEnCola.map((pedido) => (
                  <PedidoTarjeta key={pedido.id_pedido} pedido={pedido} activo={false} onVerDetalle={onVerDetalle} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}