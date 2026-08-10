import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LayoutPublico from './components/layout/LayoutPublico/LayoutPublico'
import Inicio from './pages/Inicio/Inicio'
import ArticuloDetalle from './pages/ArticuloDetalle/ArticuloDetalle'
import NoEncontrado from './pages/NoEncontrado/NoEncontrado'
import IniciarSesion from './pages/auth/IniciarSesion/IniciarSesion'
import Registro from './pages/auth/Registro/Registro'
import PanelRol from './pages/PanelRol/PanelRol'
import Loader from './components/ui/Loader/Loader'

const TIEMPO_MINIMO_CARGA = 1600
const DURACION_SALIDA = 450

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
        <Routes>
          <Route element={<LayoutPublico />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/articulo/:id" element={<ArticuloDetalle />} />
            <Route path="*" element={<NoEncontrado />} />
          </Route>
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/cliente" element={<PanelRol rolEsperado={2} />} />
          <Route path="/admin" element={<PanelRol rolEsperado={1} />} />
          <Route path="/repartidor" element={<PanelRol rolEsperado={3} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
