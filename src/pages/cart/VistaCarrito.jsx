import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasosCompra from '@/components/ui/PasosCompra/PasosCompra'
import { IconoImagen } from '@/components/ui/Iconos/Iconos'
import { OPCIONES_ENVIO } from '@/config/aplicacion'
import { obtenerCarrito, actualizarCantidad } from '@/services/carrito'
import { formatoPrecio } from '@/utils/formato'
import './VistaCarrito.css'

function lineasProducto(item) {
  return [
    `SKU: ${item.sku || item.id}`,
    item.variante?.color && `Color: ${item.variante.color}`,
    item.variante?.talla && `Talla: ${item.variante.talla}`,
  ].filter(Boolean)
}

export default function VistaCarrito() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [envio, setEnvio] = useState('estandar')

  useEffect(() => {
    setItems(obtenerCarrito())
  }, [])

  function cambiarCantidad(item, cantidad) {
    setItems(actualizarCantidad(item.id, cantidad))
  }

  function irAlCheckout() {
    navigate('/checkout')
  }

  const opcionEnvio = OPCIONES_ENVIO.find((opcion) => opcion.id === envio)
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const total = subtotal + opcionEnvio.costo
  const carritoVacio = items.length === 0

  return (
    <section className="carrito">
      <header className="carrito__cabecera">
        <PasosCompra actual="carrito" />
      </header>

      <div className="carrito__contenido">
        <div className="carrito__principal">
          <h1 className="carrito__titulo">Carrito de compras</h1>

          {carritoVacio ? (
            <div className="carrito__vacio">
              <p>Tu carrito está vacío.</p>
              <Link to="/#catalogo" className="carrito__enlace">
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="carrito__tabla-bloque">
              <div className="carrito__tabla-cabecera" aria-hidden="true">
                <span>Detalle del producto</span>
                <span>Cantidad</span>
                <span>Precio</span>
                <span>Total</span>
              </div>

              <ul className="carrito__lista">
                {items.map((item) => (
                  <li className="carrito__item" key={item.id}>
                    <div className="carrito__producto">
                      {item.imagen ? (
                        <img className="carrito__producto-imagen" src={item.imagen} alt={item.titulo} />
                      ) : (
                        <div className="carrito__producto-imagen carrito__producto-imagen--vacia">
                          <IconoImagen tamano={26} />
                        </div>
                      )}
                      <div className="carrito__producto-info">
                        <span className="carrito__producto-titulo">{item.titulo}</span>
                        <span className="carrito__producto-detalles">
                          {lineasProducto(item).map((linea) => (
                            <span key={linea}>{linea}</span>
                          ))}
                        </span>
                      </div>
                    </div>

                    <div className="carrito__cantidad">
                      <button
                        type="button"
                        className="carrito__cantidad-boton"
                        aria-label={`Disminuir cantidad de ${item.titulo}`}
                        onClick={() => cambiarCantidad(item, item.cantidad - 1)}
                      >
                        −
                      </button>
                      <input
                        className="carrito__cantidad-input"
                        type="number"
                        min="1"
                        value={item.cantidad}
                        aria-label={`Cantidad de ${item.titulo}`}
                        onChange={(evento) => {
                          const valor = evento.target.value
                          if (valor === '') return
                          cambiarCantidad(item, Number(valor))
                        }}
                      />
                      <button
                        type="button"
                        className="carrito__cantidad-boton"
                        aria-label={`Aumentar cantidad de ${item.titulo}`}
                        onClick={() => cambiarCantidad(item, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>

                    <span className="carrito__precio">{formatoPrecio(item.precio)}</span>
                    <strong className="carrito__total-linea">
                      {formatoPrecio(item.precio * item.cantidad)}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="carrito__resumen">
          <h2 className="carrito__resumen-titulo">Resumen del pedido</h2>

          <div className="carrito__resumen-fila">
            <span>Artículos</span>
            <span className="carrito__resumen-subtotal">{formatoPrecio(subtotal)}</span>
          </div>

          <div className="carrito__envio">
            <span className="carrito__envio-titulo">Envío:</span>
            <div className="carrito__select">
              <select
                className="carrito__select-control"
                value={envio}
                aria-label="Método de envío"
                onChange={(evento) => setEnvio(evento.target.value)}
              >
                {OPCIONES_ENVIO.map((opcion) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombre}
                    {opcion.costo ? ` (+${formatoPrecio(opcion.costo)})` : ''}
                  </option>
                ))}
              </select>
              <svg
                className="carrito__select-flecha"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 5.25 7 8.75l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="carrito__resumen-total">
            <span>Total:</span>
            <strong>{formatoPrecio(total)}</strong>
          </div>

          <button
            type="button"
            className="carrito__checkout"
            disabled={carritoVacio}
            onClick={irAlCheckout}
          >
            Siguiente
          </button>
        </aside>
      </div>
    </section>
  )
}