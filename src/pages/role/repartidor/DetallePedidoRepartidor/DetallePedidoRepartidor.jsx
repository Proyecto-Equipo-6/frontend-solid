import { useEffect, useState } from 'react'
import Alerta from '@/components/ui/Alerta/Alerta'
import Confirmar from '@/components/crud/Confirmar'
import {
  getDetallePedidoRepartidor,
  actualizarEstadoPedidoRepartidor,
} from '@/services/repartidor'
import { ESTADOS_REPARTIDOR, DIAGRAMA_SEGUIMIENTO } from '@/config/repartidor'
import { formatoPrecio } from '@/utils/formato'
import './DetallePedidoRepartidor.css'

const TAMANO_MAXIMO = 3 * 1024 * 1024
const FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png']

function BadgeEstado({ estado }) {
  return (
    <span className={`rep-det__badge rep-det__badge--${estado}`}>
      {ESTADOS_REPARTIDOR[estado] || estado}
    </span>
  )
}

function DiagramaSeguimiento({ estadoActual }) {
  return (
    <ol className="rep-det__diagrama" aria-label="Seguimiento del pedido">
      {DIAGRAMA_SEGUIMIENTO.map((paso) => {
        const indice = DIAGRAMA_SEGUIMIENTO.indexOf(estadoActual)
        const completado = DIAGRAMA_SEGUIMIENTO.indexOf(paso) <= indice
        return (
          <li
            key={paso}
            className={`rep-det__diagrama-paso ${completado ? 'rep-det__diagrama-paso--completado' : ''} ${
              paso === estadoActual ? 'rep-det__diagrama-paso--actual' : ''
            }`}
          >
            <span className="rep-det__diagrama-nodo" aria-hidden="true">
              {completado ? '✓' : ''}
            </span>
            <span className="rep-det__diagrama-etiqueta">{ESTADOS_REPARTIDOR[paso]}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default function DetallePedidoRepartidor({ pedidoId, puedeActualizar, onVolver, onActualizado }) {
  const [detalle, setDetalle] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [accion, setAccion] = useState(null)
  const [foto, setFoto] = useState(null)
  const [observacion, setObservacion] = useState('')

  function cargar() {
    setCargando(true)
    setAviso('')
    getDetallePedidoRepartidor(pedidoId)
      .then(setDetalle)
      .catch((e) => {
        if (e.status === 403 || e.status === 404) {
          setAviso('El pedido ya no está disponible')
        } else {
          setAviso('No se pudieron cargar los detalles del pedido')
        }
      })
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [pedidoId])

  function seleccionarFoto(evento) {
    const archivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!archivo) return

    if (!FORMATOS_PERMITIDOS.includes(archivo.type)) {
      setAviso('La foto debe ser en formato JPG o PNG')
      return
    }
    if (archivo.size > TAMANO_MAXIMO) {
      setAviso('La foto no debe superar los 3MB')
      return
    }

    setFoto({ archivo })
  }

  async function confirmarAccion() {
    setGuardando(true)
    setAviso('')
    const datos = {
      estado: accion.estado,
      estadoAnterior: detalle.estado,
    }

    if (accion.estado === 'ENTREGADO') {
      if (!foto) {
        setAviso('La foto es obligatoria para confirmar la entrega')
        setGuardando(false)
        return
      }
      datos.foto = foto.archivo
    }

    if (accion.estado === 'NO_ENTREGADO') {
      if (!observacion.trim()) {
        setAviso('La observación es obligatoria para marcar No Entregado')
        setGuardando(false)
        return
      }
      datos.observacion = observacion.trim()
    }

    try {
      await actualizarEstadoPedidoRepartidor(pedidoId, datos)
      setAccion(null)
      setFoto(null)
      setObservacion('')
      if (accion.estado === 'EN_CAMINO') {
        setAviso('El pedido está en camino.')
        getDetallePedidoRepartidor(pedidoId)
          .then(setDetalle)
          .catch(() => setAviso('No se pudieron cargar los detalles del pedido'))
      } else {
        onActualizado()
      }
    } catch (e) {
      setAccion(null)
      setFoto(null)
      setObservacion('')
      setAviso(e.message || 'No se pudo actualizar el estado del pedido')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return <p className="rep-det__cargando">Cargando detalle del pedido…</p>
  }

  if (!detalle) {
    return (
      <section className="rep-det">
        <header className="rep-det__cabecera">
          <button type="button" className="rep-det__volver" onClick={onVolver}>
            ← Volver
          </button>
        </header>
        {aviso && <Alerta variante={aviso === 'El pedido ya no está disponible' ? 'error' : 'error'}>{aviso}</Alerta>}
        {aviso && aviso !== 'El pedido ya no está disponible' && (
          <div className="rep-det__acciones">
            <button type="button" className="rep-det__boton" onClick={cargar}>
              Reintentar
            </button>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="rep-det">
      <header className="rep-det__cabecera">
        <button type="button" className="rep-det__volver" onClick={onVolver}>
          ← Volver
        </button>
        <div className="rep-det__titulo-bloque">
          <h1 className="rep-det__titulo">Pedido #{detalle.id_pedido}</h1>
          <BadgeEstado estado={detalle.estado} />
        </div>
        <p className="rep-det__subtitulo">Detalles logísticos del pedido asignado.</p>
      </header>

      {aviso && <Alerta variante="error">{aviso}</Alerta>}

      <div className="rep-det__tarjeta">
        <dl className="rep-det__lista">
          <div className="rep-det__fila">
            <dt>Cliente</dt>
            <dd>{detalle.clienteNombre || '—'}</dd>
          </div>
          <div className="rep-det__fila">
            <dt>Teléfono</dt>
            <dd>{detalle.clienteTelefono || '—'}</dd>
          </div>
          <div className="rep-det__fila">
            <dt>Dirección de entrega</dt>
            <dd>{detalle.direccion_entrega || '—'}</dd>
          </div>
          <div className="rep-det__fila">
            <dt>Logística y manipulación</dt>
            <dd>{detalle.caracteristicasLogistica || 'Ninguna'}</dd>
          </div>
        </dl>
      </div>

      <div className="rep-det__tarjeta">
        <details className="rep-det__productos-detalle">
          <summary className="rep-det__productos-resumen">
            <span>Productos del pedido</span>
            <span className="rep-det__productos-conteo">{detalle.productos?.length ?? 0} producto(s)</span>
          </summary>
          <div className="rep-det__productos-lista">
            {!detalle.productos || detalle.productos.length === 0 ? (
              <p className="rep-det__sin-productos">Sin productos.</p>
            ) : (
              detalle.productos.map((producto) => (
                <div className="rep-det__producto" key={producto.id_producto}>
                  <span className="rep-det__producto-nombre">
                    {producto.nombre} × {producto.cantidad}
                  </span>
                  <span>{formatoPrecio(Number(producto.subtotal))}</span>
                </div>
              ))
            )}
          </div>
        </details>
      </div>

      <div className="rep-det__tarjeta">
        <h2 className="rep-det__seccion-titulo">Seguimiento</h2>
        <DiagramaSeguimiento estadoActual={detalle.estado} />
      </div>

      {puedeActualizar && (
        <div className="rep-det__tarjeta">
          <h2 className="rep-det__seccion-titulo">Actualizar estado</h2>

          {detalle.estado === 'ASIGNADO' && (
            <button
              type="button"
              className="rep-det__boton rep-det__boton--avanzar"
              onClick={() => {
                setAviso('')
                setAccion({ estado: 'EN_CAMINO' })
              }}
            >
              Marcar en camino
            </button>
          )}

          {detalle.estado === 'EN_CAMINO' && (
            <div className="rep-det__avance">
              <button
                type="button"
                className="rep-det__boton rep-det__boton--avanzar"
                onClick={() => {
                  setAviso('')
                  setAccion({ estado: 'ENTREGADO' })
                }}
              >
                Marcar entregado
              </button>
              <button
                type="button"
                className="rep-det__boton rep-det__boton--peligro"
                onClick={() => {
                  setAviso('')
                  setAccion({ estado: 'NO_ENTREGADO' })
                }}
              >
                No se pudo entregar
              </button>
            </div>
          )}

          {accion && accion.estado === 'ENTREGADO' && (
            <div className="rep-det__formulario">
              <p className="rep-det__formulario-texto">
                Adjunta una foto como evidencia de la entrega (JPG o PNG, máximo 3MB).
              </p>
              <label className="rep-det__foto">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={seleccionarFoto}
                />
                {foto ? foto.archivo.name : 'Seleccionar foto'}
              </label>
              <div className="rep-det__acciones">
                <button type="button" className="rep-det__boton" onClick={() => setAccion(null)} disabled={guardando}>
                  Cancelar
                </button>
                <button type="button" className="rep-det__boton rep-det__boton--avanzar" onClick={confirmarAccion} disabled={guardando}>
                  {guardando ? 'Guardando…' : 'Confirmar entrega'}
                </button>
              </div>
            </div>
          )}

          {accion && accion.estado === 'NO_ENTREGADO' && (
            <div className="rep-det__formulario">
              <label className="rep-det__label" htmlFor="rep-observacion">
                Observación obligatoria
              </label>
              <textarea
                id="rep-observacion"
                className="rep-det__textarea"
                value={observacion}
                onChange={(evento) => setObservacion(evento.target.value)}
                placeholder="Ej: Cliente no respondió, dirección errada…"
              />
              <div className="rep-det__acciones">
                <button type="button" className="rep-det__boton" onClick={() => setAccion(null)} disabled={guardando}>
                  Cancelar
                </button>
                <button type="button" className="rep-det__boton rep-det__boton--peligro" onClick={confirmarAccion} disabled={guardando}>
                  {guardando ? 'Guardando…' : 'Confirmar no entrega'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {accion && (accion.estado === 'EN_CAMINO') && (
        <Confirmar
          titulo="Cambiar estado"
          mensaje={`¿Confirmar que el pedido #${detalle.id_pedido} pasa a "${ESTADOS_REPARTIDOR[accion.estado]}"?`}
          onConfirmar={confirmarAccion}
          onCancelar={() => setAccion(null)}
          cargando={guardando}
        />
      )}
    </section>
  )
}