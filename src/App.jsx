import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loader from '@/components/ui/Loader/Loader'

const LayoutPublico = lazy(() => import('@/components/layout/LayoutPublico/LayoutPublico'))
const Inicio = lazy(() => import('@/pages/home/Inicio'))
const ArticuloDetalle = lazy(() => import('@/pages/producto/ArticuloDetalle'))
const NoEncontrado = lazy(() => import('@/pages/NoEncontrado/NoEncontrado'))
const IniciarSesion = lazy(() => import('@/pages/auth/IniciarSesion/IniciarSesion'))
const Registro = lazy(() => import('@/pages/auth/Registro/Registro'))
const RecuperarContrasena = lazy(() => import('@/pages/auth/RecuperarContrasena/RecuperarContrasena'))
const RestablecerContrasena = lazy(() => import('@/pages/auth/RestablecerContrasena/RestablecerContrasena'))
const PanelAdministrador = lazy(() => import('@/pages/role/admin/PanelAdministrador'))
const VistaCliente = lazy(() => import('@/pages/role/cliente/VistaCliente'))
const VistaCarrito = lazy(() => import('@/pages/cart/VistaCarrito'))
const PanelRepartidor = lazy(() => import('@/pages/role/repartidor/PanelRepartidor'))
const Perfil = lazy(() => import('@/pages/profile/Perfil'))
const EditarPerfil = lazy(() => import('@/pages/profile/EditarPerfil'))
const Checkout = lazy(() => import('@/pages/cart/checkout/Checkout'))
const MisPedidos = lazy(() => import('@/pages/role/cliente/MisPedidos/MisPedidos'))
const Ayuda = lazy(() => import('@/pages/Ayuda/Ayuda'))

const TIEMPO_MINIMO_CARGA = 1600
const DURACION_SALIDA = 450

function CargandoRuta() {
  return <div className="cargando-ruta">Cargando…</div>
}

function App() {
  const [oculto, setOculto] = useState(false)
  const [mostrando, setMostrando] = useState(true)

  useEffect(() => {
    let activo = true
    const minimo = new Promise((resolve) => setTimeout(resolve, TIEMPO_MINIMO_CARGA))
    const cargada = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        window.addEventListener('load', resolve, { once: true })
      }
    })

    Promise.all([minimo, cargada]).then(() => {
      if (!activo) return
      setOculto(true)
      setTimeout(() => {
        if (activo) setMostrando(false)
      }, DURACION_SALIDA)
    })

    return () => {
      activo = false
    }
  }, [])

  return (
    <>
      {mostrando && <Loader oculto={oculto} />}
      <BrowserRouter>
        <Suspense fallback={<CargandoRuta />}>
          <Routes>
            <Route element={<LayoutPublico />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/articulo/:id" element={<ArticuloDetalle />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/perfil/editar" element={<EditarPerfil />} />
              <Route path="/cliente" element={<VistaCliente />} />
              <Route path="/carrito" element={<VistaCarrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/mis-pedidos" element={<MisPedidos />} />
              <Route path="/ayuda" element={<Ayuda />} />
              <Route path="*" element={<NoEncontrado />} />
            </Route>
            <Route path="/login" element={<IniciarSesion />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/recuperar" element={<RecuperarContrasena />} />
            <Route path="/restablecer" element={<RestablecerContrasena />} />
            <Route path="/admin" element={<PanelAdministrador />} />
            <Route path="/repartidor" element={<PanelRepartidor />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
