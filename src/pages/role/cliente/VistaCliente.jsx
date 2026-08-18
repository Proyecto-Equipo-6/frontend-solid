import { useEffect, useState } from 'react'
import Catalogo from '@/components/producto/Catalogo/Catalogo'
import usePanelRol from '@/hooks/usePanelRol'
import { getProductosPublicos, getCategoriasPublicas } from '@/services/productos'
import './VistaCliente.css'

export default function VistaCliente() {
  const { sesion, autorizado } = usePanelRol(2)
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

  if (!autorizado) return null

  return (
    <section className="vista-cliente">
      <div className="vista-cliente__bienvenida">
        <p className="vista-cliente__etiqueta">Cliente</p>
        <h1 className="vista-cliente__titulo">Hola, {sesion.nombre_apellido}</h1>
        <p className="vista-cliente__texto">
          Explora el catálogo y haz tu pedido. Tu perfil siempre está disponible.
        </p>
      </div>

      <Catalogo articulos={articulos} categorias={categorias} cargando={cargando} />
    </section>
  )
}
