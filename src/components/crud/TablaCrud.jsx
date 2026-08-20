import './Crud.css'

export default function TablaCrud({
  columnas,
  filas = [],
  claveFila = (fila, indice) => indice,
  claseFila,
  cargando = false,
  error = '',
  mensajeVacio = 'No hay registros para mostrar.',
  acciones,
}) {
  return (
    <div className="crud__tabla">
      <table className="crud__table">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th
                key={columna.clave}
                className={columna.alineacion ? `crud__celda--${columna.alineacion}` : undefined}
              >
                {columna.etiqueta}
              </th>
            ))}
            {acciones && <th className="crud__acciones-cabecera">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, indice) => (
            <tr
              key={claveFila(fila, indice)}
              className={claseFila ? claseFila(fila, indice) : undefined}
            >
              {columnas.map((columna) => (
                <td key={columna.clave} className={columna.alineacion ? `crud__celda--${columna.alineacion}` : undefined}>
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
              {acciones && <td className="crud__acciones">{acciones(fila)}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {cargando && <p className="crud__mensaje">Cargando registros…</p>}
      {!cargando && error && <p className="crud__mensaje crud__mensaje--error">{error}</p>}
      {!cargando && !error && filas.length === 0 && (
        <p className="crud__mensaje">{mensajeVacio}</p>
      )}
    </div>
  )
}