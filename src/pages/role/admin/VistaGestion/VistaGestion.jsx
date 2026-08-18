import './VistaGestion.css'

export default function VistaGestion({ titulo, descripcion, children }) {
  return (
    <section className="gestion">
      <header className="gestion__cabecera">
        <div>
          <h1 className="gestion__titulo">{titulo}</h1>
          {descripcion && <p className="gestion__descripcion">{descripcion}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}
