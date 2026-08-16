import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatoMonedaCompacta, formatoPrecio } from '@/utils/formato'
import './GraficoVentas.css'

export default function GraficoVentas({ serie }) {
  const total = serie.reduce((suma, punto) => suma + punto.ventas, 0)

  return (
    <article className="grafico-ventas">
      <div className="grafico-ventas__cabecera">
        <div>
          <h3 className="grafico-ventas__titulo">Ventas por mes</h3>
          <p className="grafico-ventas__subtitulo">Ingresos de los últimos 12 meses (sin pedidos cancelados)</p>
        </div>
        <span className="grafico-ventas__total">{formatoMonedaCompacta(total)}</span>
      </div>

      <div className="grafico-ventas__cuerpo">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serie} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--dash-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="rotulo"
              tick={{ fill: 'var(--dash-texto-tenue)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--dash-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--dash-texto-tenue)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={(valor) => formatoMonedaCompacta(valor)}
            />
            <Tooltip
              cursor={{ fill: 'var(--dash-tarjeta-alta)' }}
              contentStyle={{
                background: 'var(--dash-tarjeta-alta)',
                border: '1px solid var(--dash-border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--dash-texto)',
              }}
              labelStyle={{ color: 'var(--dash-texto-suave)', marginBottom: 4 }}
              formatter={(valor) => [formatoPrecio(valor), 'Ventas']}
            />
            <Bar
              dataKey="ventas"
              fill="var(--dash-azul)"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}