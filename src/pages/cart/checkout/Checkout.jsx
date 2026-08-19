import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '@/components/ui/Alerta/Alerta'
import PasosCompra from '@/components/ui/PasosCompra/PasosCompra'
import ConfirmacionEnvio from './ConfirmacionEnvio/ConfirmacionEnvio'
import ConfirmacionPedido from './ConfirmacionPedido/ConfirmacionPedido'
import FormularioPago from './FormularioPago/FormularioPago'
import ResumenPedido from './ResumenPedido/ResumenPedido'
import Revision from './Revision/Revision'
import { OPCIONES_ENVIO } from '@/config/aplicacion'
import { obtenerCarrito, limpiarCarrito } from '@/services/carrito'
import { crearPedido } from '@/services/pedidos'
import './Checkout.css'

const ID_METODO_PAGO = { contraentrega: 1 }
const ETAPA_POR_PASO = { 0: 'envio', 1: 'pago', 2: 'revision' }

function etiquetaAccion(paso, generando) {
  if (paso !== 2) return 'Siguiente'
  return generando ? 'Generando pedido…' : 'Confirmar pedido'
}

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
  const [generando, setGenerando] = useState(false)
  const [pedidoCreado, setPedidoCreado] = useState(null)

  useEffect(() => {
    obtenerCarrito()
      .then(setItems)
      .catch(() => setItems([]))
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

  async function realizarPedido() {
    setAviso('')
    setGenerando(true)
    try {
      const resultado = await crearPedido({
        direccionEntrega: datosEnvio?.direccion,
        observaciones: '',
        idMetodoPago: ID_METODO_PAGO[datosPago?.tipo] ?? 1,
      })
      limpiarCarrito()
      setPedidoCreado(resultado.pedido)
      setPaso(3)
    } catch (error) {
      setAviso(error.message || 'No se pudo generar el pedido. Inténtalo de nuevo.')
    } finally {
      setGenerando(false)
    }
  }

  const opcionEnvio = OPCIONES_ENVIO.find((opcion) => opcion.id === envio)
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const total = subtotal + opcionEnvio.costo

  if (paso === 3) {
    return <ConfirmacionPedido pedido={pedidoCreado} />
  }

  return (
    <section className="checkout">
      <header className="checkout__cabecera">
        <PasosCompra
          actual={ETAPA_POR_PASO[paso]}
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
                  disabled={generando}
                  onClick={paso === 2 ? realizarPedido : avanzar}
                >
                  {etiquetaAccion(paso, generando)}
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