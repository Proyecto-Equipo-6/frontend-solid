import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { formatoCompacto, formatoMonedaCompacta } from '@/utils/formato'
import './TarjetaMetrica.css'

const COLORES = {
  positivo: 'var(--dash-verde)',
  negativo: 'var(--dash-rojo)',
  neutro: 'var(--dash-texto)',
}

function tono(delta) {
  if (delta > 0) return 'positivo'
  if (delta < 0) return 'negativo'
  return 'neutro'
}

function formatearValor(metrica) {
  if (metrica.tipo === 'moneda') return formatoMonedaCompacta(metrica.valor)
  return formatoCompacto(metrica.valor)
}

export default function TarjetaMetrica({ metrica }) {
  const color = tono(metrica.delta)
  const serie = metrica.serie.map((valor, indice) => ({ indice, valor }))
  const textoDelta = `${metrica.delta > 0 ? '+' : ''}${metrica.delta}%`

  return (
    <article className="tarjeta-metrica">
      <div className="tarjeta-metrica__cabecera">
        <h3 className="tarjeta-metrica__titulo">{metrica.titulo}</h3>
        <span className={`tarjeta-metrica__badge tarjeta-metrica__badge--${color}`}>
          {textoDelta}
        </span>
      </div>

      <p className="tarjeta-metrica__valor">{formatearValor(metrica)}</p>
      <p className="tarjeta-metrica__subtitulo">{metrica.subtitulo}</p>

      <div className="tarjeta-metrica__sparkline">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={serie} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${metrica.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORES[color]} stopOpacity={0.4} />
                <stop offset="100%" stopColor={COLORES[color]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="valor"
              stroke={COLORES[color]}
              strokeWidth={2}
              fill={`url(#grad-${metrica.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}