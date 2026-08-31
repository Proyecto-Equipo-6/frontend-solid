import { formatoNumero, formatoPrecio } from '@/utils/formato'
import './TablaProductos.css'

export default function TablaProductos({ filas }) {
  const maximoUnidades = Math.max(...filas.map((fila) => fila.unidades))

  return (
    <article className="tabla-productos">
      <div className="tabla-productos__cabecera">
        <h3 className="tabla-productos__titulo">Productos más vendidos</h3>
        <p className="tabla-productos__subtitulo">Según los ingresos generados (sin pedidos cancelados)</p>
      </div>

      <div className="tabla-productos__volumen">
        <table className="tabla-productos__tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th className="tabla-productos__numero">Unidades vendidas</th>
              <th className="tabla-productos__numero">Ventas</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id_producto}>
                <td data-etiqueta="Producto">
                  <div className="tabla-productos__info">
                    <span className="tabla-productos__nombre">{fila.nombre}</span>
                    <span className="tabla-productos__sku">{fila.sku}</span>
                    <span className="tabla-productos__barra-fondo" aria-hidden="true">
                      <span
                        className="tabla-productos__barra"
                        style={{ width: `${(fila.unidades / maximoUnidades) * 100}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td data-etiqueta="Categoría">
                  <span className="tabla-productos__categoria">{fila.categoria}</span>
                </td>
                <td className="tabla-productos__numero" data-etiqueta="Unidades vendidas">
                  {formatoNumero(fila.unidades)}
                </td>
                <td className="tabla-productos__numero tabla-productos__ventas" data-etiqueta="Ventas">
                  {formatoPrecio(fila.ventas)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}