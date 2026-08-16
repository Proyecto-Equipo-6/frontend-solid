import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatoNumero } from '@/utils/formato'
import { COLORES_ESTADOS, ESTADOS_PEDIDO } from '@/config/dashboard'
import './GraficoEstados.css'

export default function GraficoEstados({ datos }) {
  const total = datos.reduce((suma, punto) => suma + punto.cantidad, 0)

  return (
    <article className="grafico-estados">
      <div className="grafico-estados__cabecera">
        <h3 className="grafico-estados__titulo">Pedidos por estado</h3>
        <p className="grafico-estados__subtitulo">Distribución según el estado del pedido</p>
      </div>

      <div className="grafico-estados__cuerpo">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              dataKey="cantidad"
              nameKey="estado"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              stroke="var(--dash-fondo)"
              strokeWidth={2}
            >
              {datos.map((punto) => (
                <Cell key={punto.estado} fill={COLORES_ESTADOS[punto.estado] || 'var(--dash-texto-tenue)'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--dash-tarjeta-alta)',
                border: '1px solid var(--dash-border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--dash-texto)',
              }}
              labelStyle={{ color: 'var(--dash-texto-suave)', marginBottom: 4 }}
              formatter={(valor, nombre) => [formatoNumero(valor), ESTADOS_PEDIDO[nombre] || nombre]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="grafico-estados__leyenda">
        {datos.map((punto) => (
          <li className="grafico-estados__leyenda-fila" key={punto.estado}>
            <span
              className="grafico-estados__leyenda-punto"
              style={{ background: COLORES_ESTADOS[punto.estado] || 'var(--dash-texto-tenue)' }}
              aria-hidden="true"
            />
            <span className="grafico-estados__leyenda-nombre">{ESTADOS_PEDIDO[punto.estado] || punto.estado}</span>
            <span className="grafico-estados__leyenda-valor">{formatoNumero(punto.cantidad)}</span>
          </li>
        ))}
        <li className="grafico-estados__leyenda-fila grafico-estados__leyenda-fila--total">
          <span className="grafico-estados__leyenda-nombre">Total</span>
          <span className="grafico-estados__leyenda-valor">{formatoNumero(total)}</span>
        </li>
      </ul>
    </article>
  )
}