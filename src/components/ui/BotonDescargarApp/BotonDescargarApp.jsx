import { Link } from 'react-router-dom'
import './BotonDescargarApp.css'

export default function BotonDescargarApp({ href = '/app-movil', className = '' }) {
  const esInterno = href.startsWith('/')
  const Tag = esInterno ? Link : 'a'

  return (
    <Tag
      to={esInterno ? href : undefined}
      href={esInterno ? undefined : href}
      className={`descargar ${className}`.trim()}
    >
      <span className="descargar__capa">
        <span className="descargar__texto">Descargar Nexbit Mobile</span>
        <span className="descargar__icono" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
            />
          </svg>
        </span>
      </span>
    </Tag>
  )
}