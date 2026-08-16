import { useEffect, useState } from 'react'
import usePanelRol from '@/hooks/usePanelRol'
import BarraLateral from '@/pages/role/admin/BarraLateral/BarraLateral'
import TarjetaMetrica from '@/pages/role/admin/TarjetaMetrica/TarjetaMetrica'
import GraficoVentas from '@/pages/role/admin/GraficoVentas/GraficoVentas'
import GraficoEstados from '@/pages/role/admin/GraficoEstados/GraficoEstados'
import TablaProductos from '@/pages/role/admin/TablaProductos/TablaProductos'
import TarjetaTopClientes from '@/pages/role/admin/TarjetaTopClientes/TarjetaTopClientes'
import VistaPerfil from '@/pages/role/admin/VistaPerfil/VistaPerfil'
import { obtenerResumenAnalitica } from '@/services/analitica'
import { SECCIONES_DASHBOARD } from '@/config/dashboard'
import './PanelAdministrador.css'

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
    obtenerResumenAnalitica()
      .then(setResumen)
      .catch(() => setError('No se pudieron cargar los reportes. Verifica que el servidor esté disponible.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarResumen, [])

  function navegar(clave) {
    setSeccion(clave)
    setVista('inicio')
    const configuracion = SECCIONES_DASHBOARD.find((s) => s.clave === clave)
    if (!configuracion) return
    const destino = document.getElementById(`seccion-${configuracion.destino}`)
    if (destino) destino.scrollIntoView({ behavior: 'smooth' })
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
          {vista === 'perfil' ? (
            <VistaPerfil sesion={sesion} onVolver={() => setVista('inicio')} />
          ) : (
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
          )}
        </main>
      </div>
    </div>
  )
}