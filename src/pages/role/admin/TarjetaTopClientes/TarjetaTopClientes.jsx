import { formatoNumero, formatoPrecio } from '@/utils/formato'
import './TarjetaTopClientes.css'

export default function TarjetaTopClientes({ clientes }) {
  return (
    <article className="top-clientes">
      <div className="top-clientes__cabecera">
        <h3 className="top-clientes__titulo">Mejores clientes</h3>
        <p className="top-clientes__subtitulo">Según el total gastado</p>
      </div>

      <ul className="top-clientes__lista">
        {clientes.map((cliente) => (
          <li className="top-clientes__fila" key={cliente.id_usuario}>
            <span className="top-clientes__avatar">{cliente.nombre_apellido.charAt(0).toUpperCase()}</span>
            <div className="top-clientes__info">
              <span className="top-clientes__nombre">{cliente.nombre_apellido}</span>
              <span className="top-clientes__correo">{cliente.email}</span>
              <span className="top-clientes__pedidos">
                {formatoNumero(cliente.pedidos)} {cliente.pedidos === 1 ? 'pedido' : 'pedidos'}
              </span>
            </div>
            <span className="top-clientes__total">{formatoPrecio(cliente.total_gastado)}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}