import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Catalogo from '@/components/producto/Catalogo/Catalogo'
import { getProductosPublicos, getCategoriasPublicas } from '@/services/productos'
import { obtenerSesion } from '@/services/sesion'
import { formatoPrecio } from '@/utils/formato'
import './Inicio.css'

function Hero({ destacado, cargando }) {
  const sesion = obtenerSesion()
  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__texto">
          <h1 className="hero__titulo">Lo que necesitas, al mejor precio.</h1>
          <p className="hero__parrafo">
            Explora nuestro catálogo de productos verificados. Compra fácil, paga
            como prefieras y recibe tu pedido con entrega segura en todo el país.
          </p>
          <div className="hero__acciones">
            <Link to="/#catalogo" className="hero__boton hero__boton--relleno">
              Explorar catálogo
            </Link>
          </div>
        </div>

        <div className="hero__lateral">
          {cargando || !destacado ? (
            <div className="hero__panel hero__panel--cargando">
              Cargando producto destacado…
            </div>
          ) : (
            <div className="hero__panel">
              <div className="hero__panel-cabecera">
                <span className="hero__panel-titulo">Producto destacado</span>
                <span className="hero__panel-estado">NUEVO</span>
              </div>
              <div className="hero__panel-imagen">
                <img src={destacado.imagen} alt={destacado.titulo} />
              </div>
              <div className="hero__panel-cuerpo">
                <div className="hero__panel-nombre">{destacado.titulo}</div>
                <div className="hero__panel-precio">
                  <span>Precio</span>
                  <strong>{formatoPrecio(destacado.precio)}</strong>
                </div>
                <div className="hero__panel-info">
                  <span>Garantía: {destacado.garantia}</span>
                  <span className="hero__panel-stock">
                    {destacado.stock} disponibles
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!sesion && (
        <div className="hero__registro">
          <div className="hero__registro-invitacion">
            <h2 className="hero__registro-titulo">¿Nuevo por aquí?</h2>
            <p className="hero__registro-texto">
              Regístrate gratis y haz tu primer pedido. Sin sorpresas.
            </p>
          </div>
          <Link to="/register" className="hero__boton hero__boton--relleno">
            Crear cuenta gratis
          </Link>
        </div>
      )}
    </section>
  )
}

export default function Inicio() {
  const [articulos, setArticulos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    Promise.all([getProductosPublicos(), getCategoriasPublicas()])
      .then(([listaProductos, listaCategorias]) => {
        if (!activo) return
        setArticulos(listaProductos)
        setCategorias(listaCategorias)
      })
      .catch(() => {
        if (activo) {
          setArticulos([])
          setCategorias([])
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const destacado = articulos.find((articulo) => articulo.destacado) ?? articulos[0]

  return (
    <>
      <Hero destacado={destacado} cargando={cargando} />
      <Catalogo articulos={articulos} categorias={categorias} cargando={cargando} />
    </>
  )
}
