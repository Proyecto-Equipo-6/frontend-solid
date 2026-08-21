import { useEffect, useState } from 'react'
import usePanelRol from '@/hooks/usePanelRol'
import BarraLateral from '@/pages/role/admin/BarraLateral/BarraLateral'
import TarjetaMetrica from '@/pages/role/admin/TarjetaMetrica/TarjetaMetrica'
import GraficoVentas from '@/pages/role/admin/GraficoVentas/GraficoVentas'
import GraficoEstados from '@/pages/role/admin/GraficoEstados/GraficoEstados'
import TablaProductos from '@/pages/role/admin/TablaProductos/TablaProductos'
import TarjetaTopClientes from '@/pages/role/admin/TarjetaTopClientes/TarjetaTopClientes'
import VistaPerfil from '@/pages/role/admin/VistaPerfil/VistaPerfil'
import Usuarios from '@/pages/role/admin/Usuarios/Usuarios'
import ProductosAdmin from '@/pages/role/admin/ProductosAdmin/ProductosAdmin'
import Categorias from '@/pages/role/admin/Categorias/Categorias'
import PedidosAdmin from '@/pages/role/admin/PedidosAdmin/PedidosAdmin'
import Proveedores from '@/pages/role/admin/Proveedores/Proveedores'
import RepartidoresAdmin from '@/pages/role/admin/RepartidoresAdmin/RepartidoresAdmin'
import RolesAdmin from '@/pages/role/admin/RolesAdmin/RolesAdmin'
import { getResumenAnalitica } from '@/services/api'
import './PanelAdministrador.css'

const VISTAS_GESTION = {
  usuarios: Usuarios,
  productos: ProductosAdmin,
  categorias: Categorias,
  pedidos: PedidosAdmin,
  proveedores: Proveedores,
  repartidores: RepartidoresAdmin,
  roles: RolesAdmin,
}

export default function PanelAdministrador() {
  const { sesion, autorizado, cerrando, handleCerrarSesion } = usePanelRol(1, { accesoLibre: true })

  const [resumen, setResumen] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccion, setSeccion] = useState('inicio')
  const [vista, setVista] = useState('inicio')

  function cargarResumen() {
    setCargando(true)
    setError('')
    getResumenAnalitica()
      .then(setResumen)
      .catch(() => setError('No se pudieron cargar los reportes. Verifica que el servidor esté disponible.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarResumen, [])

  function navegar(clave) {
    setSeccion(clave)
    setVista(clave)
  }

  function renderizarVista() {
    if (vista === 'perfil') {
      return <VistaPerfil sesion={sesion} onVolver={() => setVista('inicio')} />
    }
    if (vista === 'inicio') {
      return (
        <>
          <section id="seccion-overview" className="dashboard__seccion">
            <h1 className="dashboard__bienvenida">Bienvenido(a), {sesion?.nombre_apellido || 'Administrador'}</h1>

            {error && (
              <div className="dashboard__error">
                <p>{error}</p>
                <button type="button" onClick={cargarResumen}>
                  Reintentar
                </button>
              </div>
            )}

            {cargando && !resumen && <p className="dashboard__cargando">Cargando reportes…</p>}

            <div className="dashboard__metricas">
              {resumen?.kpis.map((metrica) => (
                <TarjetaMetrica key={metrica.id} metrica={metrica} />
              ))}
            </div>

            <div className="dashboard__graficos">
              <GraficoVentas serie={resumen?.ventasPorMes ?? []} />
              <GraficoEstados datos={resumen?.pedidosPorEstado ?? []} />
            </div>
          </section>

          <section id="seccion-details" className="dashboard__seccion">
            <div className="dashboard__detalle">
              <TablaProductos filas={resumen?.productosMasVendidos ?? []} />
              <TarjetaTopClientes clientes={resumen?.topClientes ?? []} />
            </div>
          </section>
        </>
      )
    }
    const Vista = VISTAS_GESTION[vista]
    return Vista ? <Vista /> : null
  }

  if (!autorizado) return null

  return (
    <div className="dashboard">
      <BarraLateral
        sesion={sesion}
        activo={seccion}
        onNavegar={navegar}
        onVerPerfil={() => {
          setVista('perfil')
          setMenuAbierto(false)
        }}
        onCerrarSesion={handleCerrarSesion}
        cerrando={cerrando}
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <div className="dashboard__contenido">
        <button
          type="button"
          className="dashboard__boton-menu"
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <main className="dashboard__principal">
          {renderizarVista()}
        </main>
      </div>
    </div>
  )
}