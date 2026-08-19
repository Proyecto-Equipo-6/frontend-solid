import { useEffect, useState } from 'react'
import VistaGestion from '@/pages/role/admin/VistaGestion/VistaGestion'
import TablaCrud from '@/components/crud/TablaCrud'
import { getRepartidores, cambiarEstadoRepartidor } from '@/services/admin'

export default function RepartidoresAdmin() {
  const [repartidores, setRepartidores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [alerta, setAlerta] = useState('')
  const [cambiandoId, setCambiandoId] = useState(null)

  function cargarTodo() {
    setCargando(true)
    setError('')
    getRepartidores()
      .then(setRepartidores)
      .catch((e) => setError(e.message || 'No se pudieron cargar los repartidores.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarTodo, [])

  async function alternarEstado(repartidor) {
    const nuevo = repartidor.estado === 'DISPONIBLE' ? 'INACTIVO' : 'DISPONIBLE'
    setCambiandoId(repartidor.id_repartidor)
    setAlerta('')
    try {
      await cambiarEstadoRepartidor(repartidor.id_repartidor, nuevo)
      setAlerta(`Repartidor "${repartidor.nombre}" actualizado a ${nuevo === 'DISPONIBLE' ? 'disponible' : 'inactivo'}.`)
      cargarTodo()
    } catch (e) {
      setAlerta(e.message)
    } finally {
      setCambiandoId(null)
    }
  }

  const columnas = [
    {
      clave: 'id_repartidor',
      etiqueta: 'ID',
      render: (r) => <span className="crud__texto-secundario">{r.id_repartidor}</span>,
    },
    {
      clave: 'nombre',
      etiqueta: 'Repartidor',
      render: (r) => <span className="crud__texto-principal">{r.nombre}</span>,
    },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'email', etiqueta: 'Email' },
    {
      clave: 'pedidos_hoy',
      etiqueta: 'Hoy',
      render: (r) => r.pedidos_hoy ?? '—',
    },
    {
      clave: 'pedidos_semana',
      etiqueta: 'Semana',
      render: (r) => r.pedidos_semana ?? '—',
    },
    {
      clave: 'pedidos_mes',
      etiqueta: 'Mes',
      render: (r) => r.pedidos_mes ?? '—',
    },
    {
      clave: 'estado',
      etiqueta: 'Estado',
      render: (r) => (
        <span className={`crud__badge crud__badge--${r.estado === 'DISPONIBLE' ? 'activo' : 'inactivo'}`}>
          {r.estado === 'DISPONIBLE' ? 'Disponible' : 'Inactivo'}
        </span>
      ),
    },
  ]

  const acciones = (repartidor) => (
    <button
      type="button"
      className={repartidor.estado === 'DISPONIBLE' ? 'crud__boton--eliminar' : 'crud__boton--editar'}
      onClick={() => alternarEstado(repartidor)}
      disabled={cambiandoId === repartidor.id_repartidor}
    >
      {cambiandoId === repartidor.id_repartidor
        ? 'Procesando…'
        : repartidor.estado === 'DISPONIBLE'
          ? 'Poner inactivo'
          : 'Poner disponible'}
    </button>
  )

  return (
    <VistaGestion
      titulo="Repartidores"
      descripcion="Consulta el estado operativo de los repartidores y cámbialo cuando lo necesites."
    >
      {alerta && <p className="crud__alerta">{alerta}</p>}

      <TablaCrud
        columnas={columnas}
        filas={repartidores}
        claveFila={(r) => r.id_repartidor}
        cargando={cargando}
        error={error}
        mensajeVacio="No hay repartidores registrados."
        acciones={acciones}
      />
    </VistaGestion>
  )
}