import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BarraNavegacion from '../BarraNavegacion/BarraNavegacion'
import PiePagina from '../PiePagina/PiePagina'
import './LayoutPublico.css'

export default function LayoutPublico() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const destino = document.getElementById(location.hash.slice(1))
      if (destino) destino.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  return (
    <div className="layout-publico">
      <BarraNavegacion />
      <main>
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
