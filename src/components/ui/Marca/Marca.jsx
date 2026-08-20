import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MARCA } from '@/config/aplicacion'
import './Marca.css'

export default function Marca({ cubo = true }) {
  const [girada, setGirada] = useState(false)

  return (
    <Link
      to="/"
      className={`marca${girada ? ' marca--girada' : ''}${cubo ? '' : ' marca--simple'}`}
      aria-label={MARCA.nombre}
      onClick={() => setGirada((v) => !v)}
    >
      {cubo && (
        <span className="marca__logo" aria-hidden="true">
          {MARCA.logotipo}
          <span className="marca__triangulo">▼</span>
        </span>
      )}
      <span className="marca__nombre">{MARCA.nombre}</span>
      {!cubo && <span className="marca__triangulo" aria-hidden="true">▼</span>}
    </Link>
  )
}