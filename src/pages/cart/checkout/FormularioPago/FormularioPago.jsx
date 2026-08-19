import { forwardRef, useImperativeHandle, useState } from 'react'
import Alerta from '@/components/ui/Alerta/Alerta'
import { METODOS_PAGO } from '@/config/aplicacion'
import './FormularioPago.css'

const FormularioPago = forwardRef(function FormularioPago(_props, ref) {
  const [metodo, setMetodo] = useState(METODOS_PAGO[0].id)
  const seleccionada = METODOS_PAGO.find((opcion) => opcion.id === metodo)

  useImperativeHandle(ref, () => ({
    obtenerDatos() {
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

  return (
    <div className="form-pago">
      <h2 className="form-pago__titulo">Método de pago</h2>

      <div className="form-pago__panel">
        {METODOS_PAGO.map((opcion) => (
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
        <p className="form-pago__detalle-texto">{seleccionada.descripcion}</p>
        <Alerta variante="exito">Pagas en efectivo cuando recibas tu pedido.</Alerta>
      </div>
    </div>
  )
})

export default FormularioPago