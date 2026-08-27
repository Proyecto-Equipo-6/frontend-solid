import BotonDescargarApp from '@/components/ui/BotonDescargarApp/BotonDescargarApp'
import LiquidMetalInteractivo from './LiquidMetalInteractivo'
import {
  IconoActivo,
  IconoAnalitica,
  IconoCampana,
  IconoPaquete,
  IconoPedido,
  IconoRepartidor,
  IconoTicket,
} from '@/components/ui/Iconos/Iconos'
import './AppMovil.css'

const CARACTERISTICAS = [
  {
    icono: IconoAnalitica,
    titulo: 'Panel de administración',
    texto: 'Métricas, ventas y control total de tu tienda desde la palma de tu mano.',
  },
  {
    icono: IconoPaquete,
    titulo: 'Catálogo completo',
    texto: 'Explora y gestiona productos, precios y stock igual que en la web.',
  },
  {
    icono: IconoPedido,
    titulo: 'Pedidos al instante',
    texto: 'Crea, confirma y da seguimiento a tus pedidos con notificaciones en tiempo real.',
  },
  {
    icono: IconoRepartidor,
    titulo: 'Entregas en ruta',
    texto: 'Los repartidores atienden asignaciones y evidencias directo desde su celular.',
  },
  {
    icono: IconoCampana,
    titulo: 'Notificaciones',
    texto: 'Entérate al momento de cada cambio de estado de tus pedidos.',
  },
  {
    icono: IconoTicket,
    titulo: 'Tickets y soporte',
    texto: 'Descarga comprobantes y resuelve dudas sin estar frente a una computadora.',
  },
]

const PARIDAD = [
  'Tu misma cuenta, contraseña y sesión.',
  'El mismo catálogo, precios y promociones.',
  'Tus pedidos e historial sincronizados.',
  'Roles de administrador, cliente o repartidor desde el móvil.',
]

export default function AppMovil() {
  return (
    <section className="appm">
      <div className="appm__hero">
        <div className="appm__hero-contenido">
          <span className="appm__badge">App móvil</span>
          <h1 className="appm__titulo">Nexbit Mobile</h1>
          <p className="appm__subtitulo">
            Toda tu tienda y tu panel de administración, en la palma de la mano.
          </p>
          <div className="appm__acciones">
            <BotonDescargarApp href="#" />
          </div>
        </div>

        <LiquidMetalInteractivo />
      </div>

      <div className="appm__seccion">
        <h2 className="appm__h2">La administración en la palma de la mano</h2>
        <p className="appm__sub">
          Todo lo que haces desde la web, ahora disponible donde quiera que estés.
        </p>

        <div className="appm__grid">
          {CARACTERISTICAS.map((caracteristica) => {
            const Icono = caracteristica.icono
            return (
              <article className="appm__tarjeta" key={caracteristica.titulo}>
                <span className="appm__tarjeta-icono" aria-hidden="true">
                  <Icono tamano={22} />
                </span>
                <h3 className="appm__tarjeta-titulo">{caracteristica.titulo}</h3>
                <p className="appm__tarjeta-texto">{caracteristica.texto}</p>
              </article>
            )
          })}
        </div>
      </div>

      <div className="appm__seccion appm__paridad">
        <h2 className="appm__h2">Lo mismo que la web, en tu móvil</h2>
        <ul className="appm__lista">
          {PARIDAD.map((item) => (
            <li className="appm__lista-item" key={item}>
              <span className="appm__lista-check" aria-hidden="true">
                <IconoActivo tamano={14} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="appm__cta">
        <h2 className="appm__cta-titulo">¿Listo para llevarlo contigo?</h2>
        <p className="appm__cta-texto">
          Descarga Nexbit Mobile y administra tu tienda desde cualquier lugar.
        </p>
        <BotonDescargarApp href="#" />
      </div>
    </section>
  )
}