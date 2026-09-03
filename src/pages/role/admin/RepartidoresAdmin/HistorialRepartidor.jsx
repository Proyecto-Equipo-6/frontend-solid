import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import { getPedidos } from '@/services/admin'
import { IconoAtras } from '@/components/ui/Iconos/Iconos'

const ESTADOS_FINALES = ['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']

const ETIQUETAS_ESTADO = {
  ENTREGADO: 'Entregado',
  NO_ENTREGADO: 'No entregado',
  CANCELADO: 'Cancelado',
}

const BADGES_ESTADO = {
  ENTREGADO: 'activo',
  NO_ENTREGADO: 'inactivo',
  CANCELADO: 'cancelado',
}

function formatearFecha(valor) {
  if (!valor) return '—'
  return new Date(valor).toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export default function HistorialRepartidor({ repartidor, onVolver }) {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    setError('')
    getPedidos({ repartidor: repartidor.id_repartidor, limit: 100 })
      .then((resultado) => {
        const historial = (resultado.data || []).filter((p) =>
          ESTADOS_FINALES.includes(p.estado)
        )
        setPedidos(historial)
      })
      .catch((e) => setError(e.message || 'No se pudo cargar el historial.'))
      .finally(() => setCargando(false))
  }, [repartidor.id_repartidor])

  const columnas = [
    {
      clave: 'id_pedido',
      etiqueta: 'ID Pedido',
      alineacion: 'centro',
      render: (p) => <span className="crud__texto-principal">#{p.id_pedido}</span>,
    },
    {
      clave: 'cliente',
      etiqueta: 'Cliente',
      render: (p) => (
        <div>
          <div className="crud__texto-principal">{p.clienteNombre}</div>
          {p.clienteTelefono && (
            <div className="crud__texto-secundario">{p.clienteTelefono}</div>
          )}
        </div>
      ),
    },
    { clave: 'direccion_entrega', etiqueta: 'Dirección' },
    {
      clave: 'fecha_pedido',
      etiqueta: 'Fecha',
      render: (p) => formatearFecha(p.fecha_pedido),
    },
    {
      clave: 'estado',
      etiqueta: 'Estado final',
      alineacion: 'centro',
      render: (p) => (
        <span className={`crud__badge crud__badge--${BADGES_ESTADO[p.estado] || 'cancelado'}`}>
          {ETIQUETAS_ESTADO[p.estado] || p.estado}
        </span>
      ),
    },
  ]

  return (
    <VistaGestion
      titulo={`Historial de ${repartidor.nombre || repartidor.nombre_apellido}`}
      descripcion={`Pedidos finalizados del repartidor #${repartidor.id_repartidor}, del más reciente al más antiguo.`}
    >
      <button type="button" className="crud__boton crud__boton--cancelar" onClick={onVolver}>
        <IconoAtras tamano={16} />
        Volver
      </button>

      <TablaCrud
        columnas={columnas}
        filas={pedidos}
        claveFila={(p) => p.id_pedido}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay pedidos registrados para este repartidor."
      />
    </VistaGestion>
  )
}