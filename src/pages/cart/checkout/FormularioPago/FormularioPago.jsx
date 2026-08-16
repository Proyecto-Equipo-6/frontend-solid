import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Alerta from '@/components/ui/Alerta/Alerta'
import { getBancosPublicos } from '@/services/api'
import { METODOS_PAGO } from '@/config/aplicacion'
import './FormularioPago.css'

const CONTRa_ENTREGA = {
  id: 'contraentrega',
  nombre: 'Contra entrega',
  descripcion: 'Pagas en efectivo cuando recibes tu pedido.',
  requiereComprobante: false,
}

const FormularioPago = forwardRef(function FormularioPago(_props, ref) {
  const [opciones, setOpciones] = useState(METODOS_PAGO)
  const [metodo, setMetodo] = useState(METODOS_PAGO[0].id)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarBancos() {
      try {
        const bancos = await getBancosPublicos()
        if (!activo) return
        const lista = [
          ...bancos.map((banco) => ({
            id: `banco-${banco.id_banco}`,
            nombre: banco.nombre,
            descripcion: banco.numero_cuenta
              ? `${banco.descripcion} (${banco.numero_cuenta})`
              : banco.descripcion,
            requiereComprobante: true,
          })),
          CONTRa_ENTREGA,
        ]
        setOpciones(lista)
        setMetodo((actual) => lista.some((opcion) => opcion.id === actual) ? actual : lista[0].id)
      } catch {
        if (activo) {
          setError('No se pudieron cargar los métodos de pago; se muestran los valores de referencia.')
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarBancos()
    return () => {
      activo = false
    }
  }, [])

  useImperativeHandle(ref, () => ({
    obtenerDatos() {
      const seleccionada = opciones.find((opcion) => opcion.id === metodo)
      return {
        valido: true,
        datos: {
          tipo: seleccionada.id,
          nombre: seleccionada.nombre,
          detalle: seleccionada.descripcion,
          requiereComprobante: seleccionada.requiereComprobante,
        },
      }
    },
  }))

  const seleccionada = opciones.find((opcion) => opcion.id === metodo)

  return (
    <div className="form-pago">
      <h2 className="form-pago__titulo">Método de pago</h2>

      {error && <Alerta variante="error">{error}</Alerta>}

      <div className="form-pago__panel">
        {opciones.map((opcion) => (
          <button
            type="button"
            key={opcion.id}
            className={`form-pago__metodo ${opcion.id === metodo ? 'form-pago__metodo--activo' : ''}`}
            onClick={() => setMetodo(opcion.id)}
          >
            <span className="form-pago__metodo-check" aria-hidden="true">
              {opcion.id === metodo ? '✓' : ''}
            </span>
            <span className="form-pago__metodo-nombre">{opcion.nombre}</span>
            <span className="form-pago__metodo-descripcion">{opcion.descripcion}</span>
          </button>
        ))}
      </div>

      <div className="form-pago__detalle">
        <p className="form-pago__detalle-titulo">Instrucciones</p>
        {cargando ? (
          <p className="form-pago__detalle-texto">Cargando métodos de pago…</p>
        ) : (
          <>
            <p className="form-pago__detalle-texto">{seleccionada.descripcion}</p>
            {seleccionada.requiereComprobante ? (
              <Alerta variante="error">
                Al confirmar tu pedido se te solicitará el comprobante de pago.
              </Alerta>
            ) : (
              <Alerta variante="exito">
                Pagas en efectivo cuando recibas tu pedido.
              </Alerta>
            )}
          </>
        )}
      </div>
    </div>
  )
})

export default FormularioPago