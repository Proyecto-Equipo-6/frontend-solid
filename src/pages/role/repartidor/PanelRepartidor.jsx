import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import usePanelRol from '@/hooks/usePanelRol'
import BarraLateralRepartidor from '@/pages/role/repartidor/BarraLateralRepartidor/BarraLateralRepartidor'
import DashboardRepartidor from '@/pages/role/repartidor/DashboardRepartidor/DashboardRepartidor'
import DetallePedidoRepartidor from '@/pages/role/repartidor/DetallePedidoRepartidor/DetallePedidoRepartidor'
import HistorialRepartidor from '@/pages/role/repartidor/HistorialRepartidor/HistorialRepartidor'
import TransicionVista from '@/components/ui/TransicionVista/TransicionVista'
import './PanelRepartidor.css'

export default function PanelRepartidor() {
  const { sesion, autorizado, cerrando, handleCerrarSesion } = usePanelRol(3)

  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccion, setSeccion] = useState('inicio')
  const [detalleId, setDetalleId] = useState(null)
  const [puedeActualizar, setPuedeActualizar] = useState(false)
  const [claveDashboard, setClaveDashboard] = useState(0)

  if (!autorizado) return null

  function navegar(clave) {
    setSeccion(clave)
    setDetalleId(null)
  }

  function verDetalle(pedido, activo) {
    setDetalleId(pedido.id_pedido)
    setPuedeActualizar(activo)
  }

  function volverAlDashboard() {
    setDetalleId(null)
    setSeccion('inicio')
    setClaveDashboard((valor) => valor + 1)
  }

  function renderizarVista() {
    if (detalleId) {
      return (
        <DetallePedidoRepartidor
          pedidoId={detalleId}
          puedeActualizar={puedeActualizar}
          onVolver={() => setDetalleId(null)}
          onActualizado={volverAlDashboard}
        />
      )
    }
    if (seccion === 'historial') {
      return <HistorialRepartidor />
    }
    return <DashboardRepartidor key={claveDashboard} onVerDetalle={verDetalle} />
  }

  return (
    <div className="repartidor">
      <BarraLateralRepartidor
        sesion={sesion}
        activo={seccion}
        onNavegar={navegar}
        onCerrarSesion={handleCerrarSesion}
        cerrando={cerrando}
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <div className="repartidor__contenido">
        <button
          type="button"
          className="repartidor__boton-menu"
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <main className="repartidor__principal">
          <AnimatePresence mode="wait" initial={false}>
            <TransicionVista
              key={detalleId ? 'detalle' : seccion}
              clave={detalleId ? 'detalle' : seccion}
            >
              {renderizarVista()}
            </TransicionVista>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}