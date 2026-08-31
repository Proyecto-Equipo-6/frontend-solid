export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M15.68 8.18C15.68 7.61 15.63 7.07 15.53 6.55H8v3.09h4.3a3.73 3.73 0 0 1-1.6 2.41v2.02h2.6A7.82 7.82 0 0 0 15.68 8.18Z" fill="#4285F4" />
      <path d="M8 16c2.16 0 3.97-.71 5.29-1.93l-2.6-2.02c-.71.48-1.62.77-2.69.77a4.63 4.63 0 0 1-4.48-3.3H.86v2.06A8 8 0 0 0 8 16Z" fill="#34A853" />
      <path d="M3.52 9.52a4.8 4.8 0 0 1 0-3.04V4.42H.86a8 8 0 0 0 0 7.16l2.66-2.06Z" fill="#FBBC05" />
      <path d="M8 3.19c1.18 0 2.22.41 3.06 1.2l2.29-2.29A8 8 0 0 0 .86 4.42L3.52 6.48A4.63 4.63 0 0 1 8 3.19Z" fill="#EA4335" />
    </svg>
  )
}

export function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6.68 15.92C2.88 15.24 0 11.96 0 8c0-4.4 3.6-8 8-8s8 3.6 8 8c0 3.96-2.88 7.24-6.68 7.92l-.44-.36H7.12l-.44-.36Z" fill="#1877F2" />
      <path d="M11.12 10.24l.36-2.24H9.36V6.44c0-.64.24-1.12 1.2-1.12h1.04V3.28c-.56-.08-1.2-.16-1.76-.16-1.84 0-3.12 1.12-3.12 3.12v1.76H4.72v2.24H6.72v5.64c.48.08.96.12 1.44.12s.96-.04 1.44-.12v-5.64h1.52Z" fill="#fff" />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  )
}

export function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9.52 6.77 15.48 0h-1.4L8.9 5.88 4.9 0H.3l6.24 9.08L.3 16h1.4l5.45-6.34L11.1 16h4.6L9.52 6.77Zm-1.93 2.24-.63-.9L2.2 1.04h2.15l4.05 5.8.63.9 5.27 7.54h-2.15l-4.56-6.27Z" />
    </svg>
  )
}

export function IconoCarrito({ tamano = 22 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M3 4h2l2.3 11.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.76L20.4 8H6" />
    </svg>
  )
}

export function IconoImagen({ tamano = 26 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="M4 18.5l4-4a1.5 1.5 0 0 1 2.1 0l3.4 3.4" />
      <path d="M14.5 16l1.4-1.4a1.5 1.5 0 0 1 2.1 0L21 17.5" />
    </svg>
  )
}

export function IconoPaquete({ tamano = 24 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 8.5v7a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4a2 2 0 0 1-1-1.73v-7a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4a2 2 0 0 1 1 1.73Z" />
      <path d="M3.3 7.3 12 12l8.7-4.7" />
      <path d="M12 22V12" />
    </svg>
  )
}

function IconoBase({ tamano = 18, children }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconoInicio({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </IconoBase>
  )
}

export function IconoAnalitica({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M3 3v18h18" />
      <path d="M7 14l3.5-4 3 2.5 4-5.5" />
      <path d="M17 7h3v3" />
    </IconoBase>
  )
}

export function IconoClientes({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6" />
      <path d="M17.5 14.5a5.5 5.5 0 0 1 3 5.5" />
    </IconoBase>
  )
}

export function IconoTareas({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </IconoBase>
  )
}

export function IconoAjustes({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19" />
    </IconoBase>
  )
}

export function IconoAcerca({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <path d="M12 7.5h.01" />
    </IconoBase>
  )
}

export function IconoFeedback({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </IconoBase>
  )
}

export function IconoDestello({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      <circle cx="12" cy="12" r="2.2" />
    </IconoBase>
  )
}

export function IconoBuscar({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </IconoBase>
  )
}

export function IconoCalendario({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </IconoBase>
  )
}

export function IconoCampana({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </IconoBase>
  )
}

export function IconoPuntos({ tamano }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  )
}

export function IconoCerrarSesion({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </IconoBase>
  )
}

export function IconoChevron({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="m6 9 6 6 6-6" />
    </IconoBase>
  )
}

export function IconoEditar({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
    </IconoBase>
  )
}

export function IconoEliminar({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </IconoBase>
  )
}

export function IconoAgregar({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M12 5v14M5 12h14" />
    </IconoBase>
  )
}

export function IconoRefrescar({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M3 12a9 9 0 1 0 2.6-6.4" />
      <path d="M3 3v5h5" />
    </IconoBase>
  )
}

export function IconoPower({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M12 3v9" />
      <path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
    </IconoBase>
  )
}

export function IconoFlecha({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </IconoBase>
  )
}

export function IconoAtras({ tamano = 18 }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M19 12H5M10 7l-5 5 5 5" />
    </IconoBase>
  )
}

export function IconoCategorias({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" />
    </IconoBase>
  )
}

export function IconoTicket({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.6a2.6 2.6 0 0 0 0 4.8V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.6a2.6 2.6 0 0 0 0-4.8Z" />
      <path d="M13 6.5v.01M13 12v.01M13 17.5v.01" />
    </IconoBase>
  )
}

export function IconoProveedor({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 10h.01M15 10h.01" />
    </IconoBase>
  )
}

export function IconoRepartidor({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M2.5 7h11.5v9.5H2.5z" />
      <path d="M14 10h3.8l3.7 3.2v3.3H14z" />
      <circle cx="7" cy="16.5" r="1.7" />
      <circle cx="16.5" cy="16.5" r="1.7" />
      <path d="M8.7 16.5h5.8" />
      <path d="M2.5 10h5" />
    </IconoBase>
  )
}

export function IconoRoles({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M12 3l7 2.8V12c0 4.6-2.9 7.7-7 9.2-4.1-1.5-7-4.6-7-9.2V5.8Z" />
      <path d="m8.8 11.8 2.2 2.2 4.2-4.4" />
    </IconoBase>
  )
}

export function IconoPedido({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M7 14h5" />
      <path d="m14.5 14 2 2 3.5-4" />
    </IconoBase>
  )
}

export function IconoOjo({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </IconoBase>
  )
}

export function IconoActivo({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5.5" />
    </IconoBase>
  )
}

export function IconoInactivo({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </IconoBase>
  )
}

export function IconoReactivar({ tamano }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 3v5h-5" />
    </IconoBase>
  )
}

export function IconoUsuario({ tamano = 18 }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </IconoBase>
  )
}

export function IconoSol({ tamano = 18 }) {
  return (
    <IconoBase tamano={tamano}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" />
    </IconoBase>
  )
}

export function IconoLuna({ tamano = 18 }) {
  return (
    <IconoBase tamano={tamano}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </IconoBase>
  )
}
