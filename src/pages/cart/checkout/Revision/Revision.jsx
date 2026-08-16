import { formatoPrecio } from '@/utils/formato'
import './Revision.css'

function detallesPago(datosPago) {
  if (!datosPago) return [['Método:', '—']]
  const filas = [['Método:', datosPago.nombre || '—']]
  if (datosPago.detalle) filas.push(['Detalle:', datosPago.detalle])
  return filas
}

export default function Revision({ items, subtotal, envio, total, datosEnvio, datosPago }) {
  const cantidadItems = items.reduce((suma, item) => suma + item.cantidad, 0)
  const nombreCliente = datosEnvio?.nombre_apellido || '—'
  const direccion = datosEnvio?.direccion || '—'
  const telefono = datosEnvio?.telefono || '—'

  return (
    <div className="revision">
      <h2 className="revision__titulo">Revisa tu pedido</h2>

      <ul className="revision__resumen">
        <li>
          <span>Productos ({cantidadItems})</span>
          <strong>{formatoPrecio(subtotal)}</strong>
        </li>
        <li>
          <span>Envío</span>
          <strong>{envio.costo ? formatoPrecio(envio.costo) : 'Gratis'}</strong>
        </li>
        <li className="revision__resumen-total">
          <span>Total</span>
          <strong>{formatoPrecio(total)}</strong>
        </li>
      </ul>

      <div className="revision__detalle">
        <h3>Detalles del envío</h3>
        <p className="revision__detalle-nombre">{nombreCliente}</p>
        <p className="revision__detalle-texto">{direccion}</p>
        <p className="revision__detalle-texto">Teléfono: {telefono}</p>
      </div>

      <div className="revision__detalle">
        <h3>Detalles del pago</h3>
        <div className="revision__pagos">
          {detallesPago(datosPago).map(([etiqueta, valor]) => (
            <div className="revision__pago-fila" key={etiqueta}>
              <span>{etiqueta}</span>
              <strong>{valor}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}