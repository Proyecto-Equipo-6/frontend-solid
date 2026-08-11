import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Boton from '@/components/ui/Boton/Boton'
import { obtenerSesion } from '@/services/sesion'
import { formatoPrecio } from '@/utils/formato'
import './VistaCarrito.css'

export default function VistaCarrito() {
  const navigate = useNavigate()
  const [items] = useState([])

  useEffect(() => {
    if (!obtenerSesion()) {
      navigate('/login', { replace: true })
      return
    }
  }, [navigate])

  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

  return (
    <section className="carrito">
      <div className="carrito__tarjeta">
        <p className="carrito__etiqueta">Carrito</p>
        <h1 className="carrito__titulo">Tu carrito de compras</h1>
        <p className="carrito__texto">
          Aquí aparecerán los productos que agregues a tu carrito.
        </p>

        {items.length === 0 ? (
          <div className="carrito__vacio">
            <p>Tu carrito está vacío.</p>
            <Link to="/#catalogo" className="carrito__enlace">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <ul className="carrito__lista">
            {items.map((item) => (
              <li key={item.id} className="carrito__item">
                <span className="carrito__item-nombre">{item.titulo}</span>
                <span className="carrito__item-detalle">
                  {item.cantidad} × {formatoPrecio(item.precio)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="carrito__resumen">
          <div className="carrito__total">
            <span>Total</span>
            <strong>{formatoPrecio(total)}</strong>
          </div>
          <Boton completo disabled>
            Finalizar compra
          </Boton>
        </div>
      </div>
    </section>
  )
}
