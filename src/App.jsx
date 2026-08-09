import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LayoutPublico from './components/layout/LayoutPublico/LayoutPublico'
import Inicio from './pages/Inicio/Inicio'
import ArticuloDetalle from './pages/ArticuloDetalle/ArticuloDetalle'
import NoEncontrado from './pages/NoEncontrado/NoEncontrado'
import IniciarSesion from './pages/auth/IniciarSesion/IniciarSesion'
import Registro from './pages/auth/Registro/Registro'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/articulo/:id" element={<ArticuloDetalle />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
        <Route path="/login" element={<IniciarSesion />} />
        <Route path="/register" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
