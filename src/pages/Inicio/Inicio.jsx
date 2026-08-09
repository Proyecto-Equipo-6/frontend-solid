import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TarjetaArticulo from '../../components/articulo/TarjetaArticulo/TarjetaArticulo'
import { getProductosPublicos } from '../../servicios/productos'
import { formatoPrecio } from '../../servicios/formato'
import './Inicio.css'

function Hero({ destacado, cargando }) {
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
    </section>
  )
}

function Catalogo({ articulos, cargando }) {
  return (
    <section id="catalogo" className="catalogo">
      <div className="catalogo__cabecera">
        <h2 className="catalogo__titulo">Nuestro catálogo</h2>
        <p className="catalogo__sub">
          Productos disponibles con stock real y garantía incluida.
        </p>
      </div>
      {cargando ? (
        <p className="catalogo__cargando">Cargando catálogo…</p>
      ) : (
        <div className="catalogo__grid">
          {articulos.map((articulo) => (
            <TarjetaArticulo key={articulo.id} articulo={articulo} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function Inicio() {
  const [articulos, setArticulos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    getProductosPublicos()
      .then((lista) => {
        if (activo) setArticulos(lista)
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
      <Catalogo articulos={articulos} cargando={cargando} />
    </>
  )
}
