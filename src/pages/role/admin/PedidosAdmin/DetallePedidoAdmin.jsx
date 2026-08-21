import { useEffect, useState } from 'react'
import Alerta from '@/components/ui/Alerta/Alerta'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import {
  getDetallePedido,
  getRepartidores,
  actualizarEstadoPedido,
  cancelarPedido,
  asignarRepartidorPedido,
  desasignarRepartidorPedido,
  getTicketPedido,
} from '@/services/admin'
import { formatoPrecio } from '@/utils/formato'
import './DetallePedidoAdmin.css'

const ETIQUETAS_ESTADO = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ASIGNADO: 'Asignado',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  CANCELADO: 'Cancelado',
}

const MOTIVOS_CANCELACION = [
  'Cliente canceló',
  'Pago no confirmado',
  'Producto no disponible',
  'Error en el pedido',
  'Otro',
]

function BadgeEstado({ estado }) {
  const mapa = {
    PENDIENTE: 'pendiente',
    CONFIRMADO: 'confirmado',
    ASIGNADO: 'asignado',
    EN_CAMINO: 'en-camino',
    ENTREGADO: 'activo',
    NO_ENTREGADO: 'inactivo',
    CANCELADO: 'cancelado',
  }
  return (
    <span className={`crud__badge crud__badge--${mapa[estado] || 'cancelado'}`}>
      {ETIQUETAS_ESTADO[estado] || estado}
    </span>
  )
}

function interpretarComprobante(comprobante) {
  if (!comprobante) return null

  const valor = String(comprobante)

  if (valor.startsWith('http') || valor.startsWith('/api/uploads/')) {
    return { tipo: 'imagen', url: valor }
  }

  try {
    const datos = JSON.parse(valor)
    if (datos.formato && datos.tamano) {
      return { tipo: 'foto', formato: datos.formato, tamano: datos.tamano }
    }
  } catch {
    // no es JSON
  }

  return { tipo: 'texto', texto: valor }
}

function tamanoLegible(bytes) {
  if (!bytes) return '—'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

function ComprobanteEntrega({ comprobante_url }) {
  const comprobante = interpretarComprobante(comprobante_url)

  if (!comprobante) {
    return <p className="det-pedido__nota">Aún no se registró un comprobante de entrega.</p>
  }

  if (comprobante.tipo === 'imagen') {
    return (
      <figure className="det-pedido__comprobante">
        <img className="det-pedido__comprobante-imagen" src={comprobante.url} alt="Comprobante de entrega" />
        <figcaption className="det-pedido__comprobante-caption">Evidencia de entrega</figcaption>
      </figure>
    )
  }

  if (comprobante.tipo === 'foto') {
    return (
      <div className="det-pedido__comprobante-info">
        <span className="det-pedido__comprobante-etiqueta">Foto de evidencia</span>
        <span className="det-pedido__comprobante-valor">Formato: {comprobante.formato.toUpperCase()}</span>
        <span className="det-pedido__comprobante-valor">Tamaño: {tamanoLegible(comprobante.tamano)}</span>
      </div>
    )
  }

  return (
    <div className="det-pedido__comprobante-info">
      <span className="det-pedido__comprobante-etiqueta">Comprobante</span>
      <span className="det-pedido__comprobante-valor">{comprobante.texto}</span>
    </div>
  )
}

function AccionesPedido({ estado, aTicket, abrirTicket, onConfirmar, onCancelar }) {
  return (
    <div className="det-pedido__acciones-estado">
      {estado === 'PENDIENTE' && (
        <button
          type="button"
          className="det-pedido__boton det-pedido__boton--avanzar"
          onClick={() => onConfirmar('CONFIRMADO')}
        >
          Confirmar pedido
        </button>
      )}
      {estado === 'ASIGNADO' && (
        <button
          type="button"
          className="det-pedido__boton det-pedido__boton--avanzar"
          onClick={() => onConfirmar('EN_CAMINO')}
        >
          Marcar en camino
        </button>
      )}
      {estado === 'EN_CAMINO' && (
        <>
          <button
            type="button"
            className="det-pedido__boton det-pedido__boton--avanzar"
            onClick={() => onConfirmar('ENTREGADO')}
          >
            Marcar entregado
          </button>
          <button
            type="button"
            className="det-pedido__boton det-pedido__boton--peligro"
            onClick={() => onConfirmar('NO_ENTREGADO')}
          >
            Marcar no entregado
          </button>
        </>
      )}
      {!['ENTREGADO', 'CANCELADO', 'EN_CAMINO'].includes(estado) && (
        <button type="button" className="det-pedido__boton det-pedido__boton--peligro" onClick={onCancelar}>
          Cancelar pedido
        </button>
      )}
      <button type="button" className="det-pedido__boton" onClick={abrirTicket} disabled={aTicket}>
        {aTicket ? 'Generando…' : 'Ver ticket'}
      </button>
    </div>
  )
}

function GestionRepartidor({
  detalle,
  repartidorAsignado,
  repartidoresDisponibles,
  puedeGestionar,
  repartidorSel,
  onSeleccionarRepartidor,
  asignando,
  desasignando,
  onAsignar,
  onDesasignar,
}) {
  if (!puedeGestionar) {
    return (
      <p className="det-pedido__nota">
        {detalle.id_repartidor
          ? `Asignado a ${repartidorAsignado?.nombre || `#${detalle.id_repartidor}`}. No se puede modificar en el estado actual.`
          : 'Este pedido no tiene repartidor asignado y no se puede modificar en el estado actual.'}
      </p>
    )
  }

  if (detalle.id_repartidor) {
    return (
      <div className="det-pedido__asignacion">
        <p className="det-pedido__asignacion-actual">
          Asignado a <strong>{repartidorAsignado?.nombre || `#${detalle.id_repartidor}`}</strong>
        </p>
        <button
          type="button"
          className="det-pedido__boton det-pedido__boton--peligro"
          onClick={onDesasignar}
          disabled={desasignando}
        >
          {desasignando ? 'Desasignando…' : 'Desasignar repartidor'}
        </button>
      </div>
    )
  }

  return (
    <form className="det-pedido__asignacion" onSubmit={onAsignar}>
      <label className="det-pedido__label" htmlFor="det-pedido-repartidor">
        Repartidor disponible
      </label>
      <select
        id="det-pedido-repartidor"
        className="det-pedido__select"
        value={repartidorSel}
        onChange={onSeleccionarRepartidor}
        required
      >
        <option value="">Selecciona…</option>
        {repartidoresDisponibles.map((r) => (
          <option key={r.id_repartidor} value={r.id_repartidor}>
            {r.nombre}
          </option>
        ))}
      </select>
      {repartidoresDisponibles.length === 0 && (
        <p className="det-pedido__nota">No hay repartidores disponibles en este momento.</p>
      )}
      <button
        type="submit"
        className="det-pedido__boton det-pedido__boton--avanzar"
        disabled={asignando || repartidoresDisponibles.length === 0}
      >
        {asignando ? 'Asignando…' : 'Asignar repartidor'}
      </button>
    </form>
  )
}

export default function DetallePedidoAdmin({ pedidoId, onVolver, onActualizado }) {
  const [detalle, setDetalle] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [repartidores, setRepartidores] = useState([])
  const [alerta, setAlerta] = useState('')
  const [aviso, setAviso] = useState('')

  const [repartidorSel, setRepartidorSel] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [desasignando, setDesasignando] = useState(false)

  const [aConfirmar, setAConfirmar] = useState(null)
  const [cambiando, setCambiando] = useState(false)

  const [aCancelar, setACancelar] = useState(null)
  const [cancelForm, setCancelForm] = useState({
    motivo: MOTIVOS_CANCELACION[0],
    observaciones: '',
    reintegrar: true,
  })
  const [cancelando, setCancelando] = useState(false)

  const [aTicket, setATicket] = useState(false)

  function cargar() {
    setCargando(true)
    setAviso('')
    setAlerta('')
    getDetallePedido(pedidoId)
      .then(setDetalle)
      .catch((e) => setAviso(e.message))
      .finally(() => setCargando(false))
  }

  function recargar() {
    cargar()
    getRepartidores()
      .then(setRepartidores)
      .catch(() => setRepartidores([]))
  }

  useEffect(() => {
    setCargando(true)
    setAviso('')
    setAlerta('')
    getDetallePedido(pedidoId)
      .then(setDetalle)
      .catch((e) => setAviso(e.message))
      .finally(() => setCargando(false))

    getRepartidores()
      .then(setRepartidores)
      .catch(() => setRepartidores([]))
  }, [pedidoId])

  const repartidorAsignado = detalle?.id_repartidor
    ? repartidores.find((r) => Number(r.id_repartidor) === Number(detalle.id_repartidor))
    : null

  const repartidoresDisponibles = repartidores.filter((r) => r.estado === 'DISPONIBLE')

  const puedeGestionarRepartidor = ['CONFIRMADO', 'ASIGNADO'].includes(detalle?.estado)

  async function guardarAsignacion(evento) {
    evento.preventDefault()
    if (!repartidorSel) {
      setAlerta('Debes seleccionar un repartidor para asignar.')
      return
    }
    setAsignando(true)
    setAlerta('')
    try {
      await asignarRepartidorPedido(detalle.id_pedido, Number(repartidorSel))
      setAlerta('Repartidor asignado correctamente.')
      setRepartidorSel('')
      recargar()
      onActualizado()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setAsignando(false)
    }
  }

  async function confirmarDesasignar() {
    setDesasignando(true)
    setAlerta('')
    try {
      await desasignarRepartidorPedido(detalle.id_pedido)
      setAConfirmar(null)
      setAlerta('Repartidor desasignado correctamente.')
      recargar()
      onActualizado()
    } catch (e) {
      setAConfirmar(null)
      setAlerta(e.message)
    } finally {
      setDesasignando(false)
    }
  }

  async function confirmarTransicion() {
    setCambiando(true)
    setAlerta('')
    try {
      await actualizarEstadoPedido(detalle.id_pedido, aConfirmar)
      setAConfirmar(null)
      setAlerta(`Pedido actualizado a "${ETIQUETAS_ESTADO[aConfirmar]}".`)
      cargar()
      onActualizado()
    } catch (e) {
      setAConfirmar(null)
      setAlerta(e.message)
    } finally {
      setCambiando(false)
    }
  }

  async function confirmarCancelacion(evento) {
    evento.preventDefault()
    setCancelando(true)
    setAlerta('')
    try {
      const opciones = { reintegrar_stock: cancelForm.reintegrar }
      if (cancelForm.observaciones.trim()) opciones.observaciones = cancelForm.observaciones.trim()
      await cancelarPedido(detalle.id_pedido, cancelForm.motivo, opciones)
      setACancelar(null)
      setAlerta('Pedido cancelado correctamente.')
      cargar()
      onActualizado()
    } catch (e) {
      setACancelar(null)
      setAlerta(e.message)
    } finally {
      setCancelando(false)
    }
  }

  function abrirTicket() {
    setATicket(true)
    setAlerta('')
    getTicketPedido(detalle.id_pedido)
      .then((ticket) => {
        const ventana = window.open('', '_blank')
        if (ventana) {
          ventana.document.write(ticket.html)
          ventana.document.close()
          ventana.print()
        }
      })
      .catch((e) => setAlerta(e.message))
      .finally(() => setATicket(false))
  }

  if (cargando) {
    return <p className="crud__mensaje">Cargando detalle…</p>
  }

  if (!detalle) {
    return (
      <section className="det-pedido">
        <div className="det-pedido__cabecera">
          <button type="button" className="det-pedido__volver" onClick={onVolver}>
            ← Volver
          </button>
        </div>
        {aviso && <Alerta variante="error">{aviso}</Alerta>}
      </section>
    )
  }

  return (
    <section className="det-pedido">
      <header className="det-pedido__cabecera">
        <button type="button" className="det-pedido__volver" onClick={onVolver}>
          ← Volver
        </button>
        <div className="det-pedido__titulo-bloque">
          <h1 className="det-pedido__titulo">Pedido #{detalle.id_pedido}</h1>
          <BadgeEstado estado={detalle.estado} />
        </div>
        <p className="det-pedido__subtitulo">
          Detalle y acciones disponibles para este pedido.
        </p>
      </header>

      {alerta && <Alerta variante="exito">{alerta}</Alerta>}
      {aviso && <Alerta variante="error">{aviso}</Alerta>}

      <div className="det-pedido__grid">
        <div className="det-pedido__columna det-pedido__columna--comprobante">
          <div className="det-pedido__tarjeta">
            <h2 className="det-pedido__seccion-titulo">Comprobante de entrega</h2>
            <ComprobanteEntrega comprobante_url={detalle.comprobante_url} />
          </div>
        </div>

        <div className="det-pedido__columna">
          <div className="det-pedido__tarjeta">
            <details className="det-pedido__detalles">
              <summary className="det-pedido__detalles-resumen">
                <span>Detalle del pedido</span>
                <span className="det-pedido__detalles-conteo">{detalle.productos.length} producto(s)</span>
              </summary>
              <div className="det-pedido__detalles-cuerpo">
                {detalle.productos.length === 0 ? (
                  <p className="det-pedido__sin-productos">Sin productos.</p>
                ) : (
                  <div className="det-pedido__productos">
                    {detalle.productos.map((producto) => (
                      <div className="det-pedido__producto" key={producto.id_producto}>
                        <span className="det-pedido__producto-nombre">
                          Producto #{producto.id_producto} × {producto.cantidad}
                        </span>
                        <span>{formatoPrecio(Number(producto.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          </div>

          <div className="det-pedido__tarjeta">
            <h2 className="det-pedido__seccion-titulo">Información de entrega</h2>
            <dl className="det-pedido__lista">
              <div className="det-pedido__fila">
                <dt>Cliente</dt>
                <dd>{detalle.cliente?.nombre}</dd>
              </div>
              <div className="det-pedido__fila">
                <dt>Teléfono</dt>
                <dd>{detalle.cliente?.telefono}</dd>
              </div>
              <div className="det-pedido__fila">
                <dt>Dirección</dt>
                <dd>{detalle.direccion_entrega}</dd>
              </div>
              <div className="det-pedido__fila">
                <dt>Total</dt>
                <dd>{formatoPrecio(Number(detalle.total))}</dd>
              </div>
              <div className="det-pedido__fila">
                <dt>Repartidor</dt>
                <dd>{repartidorAsignado?.nombre || 'Sin asignar'}</dd>
              </div>
            </dl>
          </div>

          <div className="det-pedido__tarjeta">
            <h2 className="det-pedido__seccion-titulo">Acciones</h2>
            <AccionesPedido
              estado={detalle.estado}
              aTicket={aTicket}
              abrirTicket={abrirTicket}
              onConfirmar={setAConfirmar}
              onCancelar={() => {
                setCancelForm({
                  motivo: MOTIVOS_CANCELACION[0],
                  observaciones: '',
                  reintegrar: true,
                })
                setACancelar(true)
              }}
            />

            <div className="det-pedido__repartidor">
              <GestionRepartidor
                detalle={detalle}
                repartidorAsignado={repartidorAsignado}
                repartidoresDisponibles={repartidoresDisponibles}
                puedeGestionar={puedeGestionarRepartidor}
                repartidorSel={repartidorSel}
                onSeleccionarRepartidor={(evento) => setRepartidorSel(evento.target.value)}
                asignando={asignando}
                desasignando={desasignando}
                onAsignar={guardarAsignacion}
                onDesasignar={() => setAConfirmar('__DESASIGNAR__')}
              />
            </div>
          </div>
        </div>
      </div>

      {aConfirmar === '__DESASIGNAR__' && (
        <Confirmar
          titulo="Desasignar repartidor"
          mensaje={`¿Quitar el repartidor del pedido #${detalle.id_pedido}?`}
          onConfirmar={confirmarDesasignar}
          onCancelar={() => setAConfirmar(null)}
          cargando={desasignando}
        />
      )}

      {aConfirmar && aConfirmar !== '__DESASIGNAR__' && (
        <Confirmar
          titulo="Cambiar estado"
          mensaje={`¿Confirmar que el pedido #${detalle.id_pedido} pasa a "${ETIQUETAS_ESTADO[aConfirmar]}"?`}
          onConfirmar={confirmarTransicion}
          onCancelar={() => setAConfirmar(null)}
          cargando={cambiando}
        />
      )}

      <ModalCrud abierto={Boolean(aCancelar)} titulo="Cancelar pedido" onCerrar={() => setACancelar(null)}>
        <form className="crud__form" onSubmit={confirmarCancelacion}>
          <p className="crud__modal-texto">
            Pedido <strong>#{detalle.id_pedido}</strong>
          </p>
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="det-pedido-motivo">Motivo</label>
            <select
              id="det-pedido-motivo"
              className="crud__campo-select"
              value={cancelForm.motivo}
              onChange={(evento) => setCancelForm((prev) => ({ ...prev, motivo: evento.target.value }))}
            >
              {MOTIVOS_CANCELACION.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="det-pedido-observaciones">Observaciones</label>
            <textarea
              id="det-pedido-observaciones"
              className="crud__campo-textarea"
              value={cancelForm.observaciones}
              onChange={(evento) => setCancelForm((prev) => ({ ...prev, observaciones: evento.target.value }))}
              placeholder={cancelForm.motivo === 'Otro' ? 'Indica el motivo…' : 'Opcional'}
            />
          </div>
          <label className="crud__campo-label crud__campo-check">
            <input
              type="checkbox"
              checked={cancelForm.reintegrar}
              onChange={(evento) => setCancelForm((prev) => ({ ...prev, reintegrar: evento.target.checked }))}
            />
            <span>Reintegrar stock de los productos</span>
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
    </section>
  )
}