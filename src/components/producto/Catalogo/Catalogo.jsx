import { useEffect, useMemo, useState } from 'react'
import TarjetaArticulo from '@/components/producto/TarjetaArticulo/TarjetaArticulo'
import { CATALOGO } from '@/config/aplicacion'
import './Catalogo.css'

function Filtros({ categorias, categoriaActiva, busqueda, onChangeCategoria, onChangeBusqueda }) {
  return (
    <div className="catalogo__filtros">
      <label className="catalogo__filtro">
        <span className="catalogo__filtro-etiqueta">Categoría</span>
        <select
          className="catalogo__filtro-control"
          value={categoriaActiva ?? ''}
          onChange={(e) => onChangeCategoria(e.target.value === '' ? null : e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="catalogo__filtro">
        <span className="catalogo__filtro-etiqueta">Buscar</span>
        <input
          className="catalogo__filtro-control"
          type="search"
          value={busqueda}
          onChange={(e) => onChangeBusqueda(e.target.value)}
          placeholder={`Escribe al menos ${CATALOGO.minimoBusqueda} letras…`}
        />
      </label>
    </div>
  )
}

function Paginacion({ pagina, totalPaginas, onChangePagina }) {
  if (totalPaginas <= 1) return null

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav className="catalogo__paginacion" aria-label="Paginación del catálogo">
      <button
        className="catalogo__pagina-boton"
        type="button"
        disabled={pagina <= 1}
        onClick={() => onChangePagina(pagina - 1)}
      >
        Anterior
      </button>

      <ul className="catalogo__paginas">
        {paginas.map((numero) => (
          <li key={numero}>
            <button
              className={`catalogo__pagina ${
                numero === pagina ? 'catalogo__pagina--activa' : ''
              }`}
              type="button"
              onClick={() => onChangePagina(numero)}
            >
              {numero}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="catalogo__pagina-boton"
        type="button"
        disabled={pagina >= totalPaginas}
        onClick={() => onChangePagina(pagina + 1)}
      >
        Siguiente
      </button>
    </nav>
  )
}

export default function Catalogo({ articulos, categorias, cargando }) {
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)

  const busquedaNormalizada = busqueda.trim().toLowerCase()
  const usarBusqueda = busquedaNormalizada.length >= CATALOGO.minimoBusqueda

  const filtrados = useMemo(() => {
    return articulos.filter((articulo) => {
      const coincideCategoria =
        categoriaActiva === null || articulo.categoria === categoriaActiva
      const coincideBusqueda =
        !usarBusqueda || articulo.titulo.toLowerCase().includes(busquedaNormalizada)
      return coincideCategoria && coincideBusqueda
    })
  }, [articulos, categoriaActiva, busquedaNormalizada, usarBusqueda])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / CATALOGO.productosPorPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * CATALOGO.productosPorPagina
  const visibles = filtrados.slice(inicio, inicio + CATALOGO.productosPorPagina)

  useEffect(() => {
    setPagina(1)
  }, [categoriaActiva, usarBusqueda])

  function mensajeVacio() {
    if (categoriaActiva !== null) return 'No hay productos registrados'
    if (usarBusqueda) return `No se encontraron productos con «${busqueda}».`
    return 'No hay productos disponibles por el momento.'
  }

  function contenidoCatalogo() {
    if (cargando) {
      return <p className="catalogo__cargando">Cargando catálogo…</p>
    }
    if (visibles.length === 0) {
      return <p className="catalogo__vacio">{mensajeVacio()}</p>
    }
    return (
      <>
        <div className="catalogo__grid">
          {visibles.map((articulo) => (
            <TarjetaArticulo key={articulo.id} articulo={articulo} />
          ))}
        </div>
        <Paginacion
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          onChangePagina={setPagina}
        />
      </>
    )
  }

  return (
    <section id="catalogo" className="catalogo">
      <div className="catalogo__cabecera">
        <h2 className="catalogo__titulo">Nuestro catálogo</h2>
        <p className="catalogo__sub">
          Productos disponibles con stock real y garantía incluida.
        </p>
      </div>

      <Filtros
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        busqueda={busqueda}
        onChangeCategoria={setCategoriaActiva}
        onChangeBusqueda={setBusqueda}
      />

      {contenidoCatalogo()}
    </section>
  )
}
