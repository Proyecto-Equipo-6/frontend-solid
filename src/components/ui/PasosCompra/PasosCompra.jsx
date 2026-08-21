import { Link } from 'react-router-dom'
import './PasosCompra.css'

const PASOS = [
  { clave: 'carrito', etiqueta: 'Carrito', destino: '/carrito' },
  { clave: 'envio', etiqueta: 'Envío', destino: '/checkout' },
  { clave: 'pago', etiqueta: 'Pago', destino: '/checkout' },
  { clave: 'revision', etiqueta: 'Revisión' },
]

function estadoDelPaso(indice, indiceActual) {
  if (indice < indiceActual) return 'hecho'
  if (indice === indiceActual) return 'activo'
  return 'pendiente'
}

function renderNodo(paso, indice, estado, navegable, onNavegar) {
  const contenido = estado === 'hecho' ? '✓' : indice + 1

  if (navegable && onNavegar) {
    return (
      <button
        type="button"
        className="pasos-compra__nodo pasos-compra__nodo--boton"
        onClick={() => onNavegar(paso.clave)}
      >
        {contenido}
      </button>
    )
  }

  if (navegable) {
    return (
      <Link to={paso.destino} className="pasos-compra__nodo">
        {contenido}
      </Link>
    )
  }

  return <span className="pasos-compra__nodo">{contenido}</span>
}

export default function PasosCompra({ actual, onNavegar }) {
  const indiceActual =
    actual === 'fin' ? PASOS.length : PASOS.findIndex((paso) => paso.clave === actual)

  function esNavegable(paso, estado) {
    if (onNavegar) return estado === 'hecho'
    if (actual === 'carrito') return paso.clave === 'carrito'
    return estado === 'hecho'
  }

  return (
    <ol className="pasos-compra" aria-label="Progreso de compra">
      {PASOS.map((paso, indice) => {
        const estado = estadoDelPaso(indice, indiceActual)
        const navegable = esNavegable(paso, estado)

        return (
          <li className="pasos-compra__grupo" key={paso.clave}>
            <div className={`pasos-compra__paso pasos-compra__paso--${estado}`}>
              {renderNodo(paso, indice, estado, navegable, onNavegar)}
              <span className="pasos-compra__etiqueta">{paso.etiqueta}</span>
            </div>
            {indice < PASOS.length - 1 && (
              <span className="pasos-compra__linea" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}