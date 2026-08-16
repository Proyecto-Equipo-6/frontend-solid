import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '@/components/ui/Alerta/Alerta'
import PasosCompra from '@/components/ui/PasosCompra/PasosCompra'
import { IconoPaquete } from '@/components/ui/Iconos/Iconos'
import ConfirmacionEnvio from './ConfirmacionEnvio/ConfirmacionEnvio'
import FormularioPago from './FormularioPago/FormularioPago'
import ResumenPedido from './ResumenPedido/ResumenPedido'
import Revision from './Revision/Revision'
import { OPCIONES_ENVIO } from '@/config/aplicacion'
import { obtenerCarrito, limpiarCarrito } from '@/services/carrito'
import './Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const direccionRef = useRef(null)
  const pagoRef = useRef(null)

  const [paso, setPaso] = useState(0)
  const [items, setItems] = useState([])
  const [envio, setEnvio] = useState('estandar')
  const [datosEnvio, setDatosEnvio] = useState(null)
  const [datosPago, setDatosPago] = useState(null)
  const [aviso, setAviso] = useState('')
  const [mostrarResumen, setMostrarResumen] = useState(false)

  useEffect(() => {
    setItems(obtenerCarrito())
  }, [])

  function avanzar() {
    setAviso('')

    if (paso === 0) {
      const resultado = direccionRef.current.obtenerDatos()
      if (!resultado.valido) {
        setAviso('Revisa los campos resaltados para continuar.')
        return
      }
      setDatosEnvio(resultado.datos)
    }

    if (paso === 1) {
      const resultado = pagoRef.current.obtenerDatos()
      if (!resultado.valido) {
        setAviso('Revisa los campos resaltados para continuar.')
        return
      }
      setDatosPago(resultado.datos)
    }

    setPaso((prev) => prev + 1)
  }

  function retroceder() {
    setAviso('')
    setPaso((prev) => prev - 1)
  }

  function realizarPedido() {
    limpiarCarrito()
    setPaso(3)
  }

  const opcionEnvio = OPCIONES_ENVIO.find((opcion) => opcion.id === envio)
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const total = subtotal + opcionEnvio.costo

  if (paso === 3) {
    const numeroPedido = `#NEX-${Date.now().toString().slice(-6)}`
    return (
      <section className="checkout">
        <div className="checkout__gracias">
          <span className="checkout__gracias-icono" aria-hidden="true">
            <IconoPaquete tamano={26} />
          </span>
          <h1 className="checkout__gracias-titulo">¡Gracias por tu pedido!</h1>
          <p className="checkout__gracias-texto">
            Tu número de pedido es <strong>{numeroPedido}</strong>. Te hemos enviado la
            confirmación por correo y te avisaremos cuando esté en camino.
          </p>
          <button type="button" className="checkout__accion" onClick={() => navigate('/')}>
            Ver mis pedidos
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout">
      <header className="checkout__cabecera">
        <PasosCompra
          actual={paso === 0 ? 'envio' : paso === 1 ? 'pago' : 'revision'}
          onNavegar={(clave) => {
            if (clave === 'carrito') {
              navigate('/carrito')
              return
            }
            const indice = { envio: 0, pago: 1, revision: 2 }[clave]
            if (indice !== undefined) setPaso(indice)
          }}
        />
      </header>

      <button
        type="button"
        className="checkout__resumen-boton"
        onClick={() => setMostrarResumen((valor) => !valor)}
      >
        <span>{mostrarResumen ? 'Ocultar detalles' : 'Ver detalles del pedido'}</span>
        <span className={`checkout__resumen-flecha ${mostrarResumen ? 'checkout__resumen-flecha--abierta' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {mostrarResumen && (
        <div className="checkout__resumen-movil">
          <ResumenPedido
            items={items}
            subtotal={subtotal}
            envio={opcionEnvio}
            total={total}
            onEnvio={setEnvio}
          />
        </div>
      )}

      <div className="checkout__contenido">
        <div className="checkout__principal">
          {items.length === 0 ? (
            <div className="checkout__vacio">
              <p>Tu carrito está vacío.</p>
              <Link to="/#catalogo" className="checkout__vacio-enlace">
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              {paso === 0 && <ConfirmacionEnvio ref={direccionRef} />}
              {paso === 1 && <FormularioPago ref={pagoRef} />}
              {paso === 2 && (
                <Revision
                  items={items}
                  subtotal={subtotal}
                  envio={opcionEnvio}
                  total={total}
                  datosEnvio={datosEnvio}
                  datosPago={datosPago}
                />
              )}

              {aviso && <Alerta variante="error">{aviso}</Alerta>}

              <div className="checkout__acciones">
                {paso > 0 && (
                  <button type="button" className="checkout__accion checkout__accion--secundario" onClick={retroceder}>
                    Volver
                  </button>
                )}
                <button
                  type="button"
                  className="checkout__accion checkout__accion--completo"
                  onClick={paso === 2 ? realizarPedido : avanzar}
                >
                  {paso === 2 ? 'Confirmar pedido' : 'Siguiente'}
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="checkout__lateral">
          <ResumenPedido
            items={items}
            subtotal={subtotal}
            envio={opcionEnvio}
            total={total}
            onEnvio={setEnvio}
          />
        </aside>
      </div>
    </section>
  )
}