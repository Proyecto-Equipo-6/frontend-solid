import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import ModalCrud from '@/components/crud/ModalCrud'
import Confirmar from '@/components/crud/Confirmar'
import FiltroEstado from '@/components/crud/FiltroEstado'
import {
  getCategoriasAdmin,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} from '@/services/admin'
import { IconoEditar, IconoEliminar, IconoReactivar, IconoAgregar } from '@/components/ui/Iconos/Iconos'

const FORM_VACIO = { nombre: '', descripcion: '', estado: 1 }

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')

  const [modal, setModal] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const [filtro, setFiltro] = useState('activos')

  function cargarTodo() {
    setCargando(true)
    setError('')
    getCategoriasAdmin()
      .then(setCategorias)
      .catch((e) => setError(e.message || 'No se pudieron cargar las categorías.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModal(true)
  }

  function abrirEdicion(categoria) {
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      estado: Number(categoria.estado),
    })
    setEditandoId(categoria.id_categoria)
    setModal(true)
  }

  function cambiarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardarCategoria(evento) {
    evento.preventDefault()
    setGuardando(true)
    setAlerta('')
    try {
      const datos = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        estado: Number(form.estado),
      }
      if (editandoId) {
        await editarCategoria(editandoId, datos)
        setAlerta('Categoría actualizada correctamente.')
      } else {
        await crearCategoria(datos)
        setAlerta('Categoría creada correctamente.')
      }
      setModal(false)
      setEditandoId(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminar() {
    setEliminando(true)
    setAlerta('')
    try {
      await eliminarCategoria(aEliminar.id_categoria)
      setAlerta('Categoría eliminada correctamente.')
      setAEliminar(null)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setEliminando(false)
    }
  }

  const columnas = [
    {
      clave: 'nombre',
      etiqueta: 'Categoría',
      render: (c) => <span className="crud__texto-principal">{c.nombre}</span>,
    },
    { clave: 'descripcion', etiqueta: 'Descripción' },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      alineacion: 'centro',
      render: (c) => (
        <span className={`crud__badge crud__badge--${Number(c.estado) === 1 ? 'activo' : 'inactivo'}`}>
          {Number(c.estado) === 1 ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ]

  const acciones = (categoria) => (
    <>
      {filtro === 'inactivos' ? (
        <button
          type="button"
          className="crud__icono crud__icono--reactivar"
          aria-label={`Activar ${categoria.nombre}`}
          title="Activar"
          onClick={() => reactivarCategoria(categoria)}
        >
          <IconoReactivar tamano={18} />
        </button>
      ) : (
        <>
          <button
            type="button"
            className="crud__icono crud__icono--editar"
            aria-label={`Editar ${categoria.nombre}`}
            title="Editar"
            onClick={() => abrirEdicion(categoria)}
          >
            <IconoEditar tamano={18} />
          </button>
          <button
            type="button"
            className="crud__icono crud__icono--eliminar"
            aria-label={`Eliminar ${categoria.nombre}`}
            title="Eliminar"
            onClick={() => setAEliminar(categoria)}
          >
            <IconoEliminar tamano={18} />
          </button>
        </>
      )}
    </>
  )

  async function reactivarCategoria(categoria) {
    setAlerta('')
    try {
      await editarCategoria(categoria.id_categoria, {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        estado: 1,
      })
      setAlerta(`Categoría "${categoria.nombre}" activada correctamente.`)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    }
  }

  const esActivo = (c) => Number(c.estado) === 1
  const activos = categorias.filter(esActivo)
  const inactivos = categorias.filter((c) => !esActivo(c))
  const filas = filtro === 'activos' ? activos : inactivos

  return (
    <VistaGestion
      titulo="Categorías"
      descripcion="Crea y organiza las categorías del catálogo de productos."
    >
      <div className="gestion__cabecera">
        <FiltroEstado
          valor={filtro}
          onCambiar={setFiltro}
          conteos={{ activos: activos.length, inactivos: inactivos.length }}
        />
        <button type="button" className="crud__boton crud__boton--nuevo" onClick={abrirNuevo}>
          <IconoAgregar tamano={16} />
          Nueva categoría
        </button>
      </div>

      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={filas}
        claveFila={(c) => c.id_categoria}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay categorías registradas."
        acciones={acciones}
      />

      <ModalCrud abierto={modal} titulo="Categoría" onCerrar={() => setModal(false)}>
        <form className="crud__form" onSubmit={guardarCategoria}>
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="categoria-nombre">Nombre</label>
            <input
              id="categoria-nombre"
              className="crud__campo-input"
              value={form.nombre}
              onChange={(e) => cambiarCampo('nombre', e.target.value)}
              required
            />
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="categoria-descripcion">Descripción</label>
            <textarea
              id="categoria-descripcion"
              className="crud__campo-textarea"
              value={form.descripcion}
              onChange={(e) => cambiarCampo('descripcion', e.target.value)}
            />
          </div>
          <div className="crud__campo">
            <label className="crud__campo-label" htmlFor="categoria-estado">Estado</label>
            <select
              id="categoria-estado"
              className="crud__campo-select"
              value={form.estado}
              onChange={(e) => cambiarCampo('estado', Number(e.target.value))}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>
          <div className="crud__form-acciones">
            <button type="button" className="crud__boton crud__boton--cancelar" onClick={() => setModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="crud__boton" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </ModalCrud>

      {aEliminar && (
        <Confirmar
          titulo="Eliminar categoría"
          mensaje={`¿Eliminar la categoría "${aEliminar.nombre}"?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
          peligro
        />
      )}
    </VistaGestion>
  )
}