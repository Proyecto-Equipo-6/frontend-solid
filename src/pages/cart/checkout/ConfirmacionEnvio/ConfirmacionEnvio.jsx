import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Alerta from '@/components/ui/Alerta/Alerta'
import Boton from '@/components/ui/Boton/Boton'
import Campo from '@/components/ui/Campo/Campo'
import { esTelefonoValido } from '@/utils/validacion'
import { obtenerSesion, guardarSesion } from '@/services/sesion'
import { actualizarPerfil } from '@/services/api'
import './ConfirmacionEnvio.css'

const CAMPOS = [
  { nombre: 'nombre_apellido', etiqueta: 'Nombre completo' },
  { nombre: 'telefono', etiqueta: 'Teléfono' },
  { nombre: 'direccion', etiqueta: 'Dirección', completo: true },
]

const DIRECCION_VACIA = {
  nombre_apellido: '',
  telefono: '',
  direccion: '',
}

function validarDireccion(datos) {
  const errores = {}

  if (!datos.nombre_apellido.trim()) {
    errores.nombre_apellido = 'El nombre es obligatorio.'
  }

  if (!datos.telefono.trim()) {
    errores.telefono = 'El teléfono es obligatorio.'
  } else if (!esTelefonoValido(datos.telefono)) {
    errores.telefono = 'El teléfono debe tener exactamente 10 dígitos.'
  }

  if (!datos.direccion.trim()) {
    errores.direccion = 'La dirección es obligatoria.'
  }

  return errores
}

const ConfirmacionEnvio = forwardRef(function ConfirmacionEnvio(_props, ref) {
  const [perfil, setPerfil] = useState(DIRECCION_VACIA)
  const [form, setForm] = useState(DIRECCION_VACIA)
  const [password, setPassword] = useState('')
  const [haySesion, setHaySesion] = useState(false)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState({})
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    const sesion = obtenerSesion()
    setHaySesion(Boolean(sesion))

    if (sesion?.nombre_apellido && sesion?.direccion) {
      const datos = {
        nombre_apellido: sesion.nombre_apellido,
        telefono: sesion.telefono,
        direccion: sesion.direccion,
      }
      setPerfil(datos)
      setForm(datos)
    } else {
      setEditando(true)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    obtenerDatos() {
      const erroresCampos = validarDireccion(perfil)
      if (Object.keys(erroresCampos).length > 0) {
        setErrores(erroresCampos)
        return { valido: false, errores: erroresCampos }
      }
      return { valido: true, datos: { ...perfil } }
    },
  }))

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
  }

  async function guardarCambios() {
    setAviso('')

    const erroresCampos = validarDireccion(form)
    setErrores(erroresCampos)
    if (Object.keys(erroresCampos).length > 0) return

    const cambios = CAMPOS.reduce((acc, campo) => {
      if (form[campo.nombre] !== perfil[campo.nombre]) {
        acc[campo.nombre] = form[campo.nombre]
      }
      return acc
    }, {})

    if (haySesion && Object.keys(cambios).length > 0 && !password.trim()) {
      setErrores((prev) => ({
        ...prev,
        password: 'La contraseña es obligatoria para actualizar la dirección.',
      }))
      return
    }

    setGuardando(true)
    try {
      if (password.trim()) cambios.password = password

      if (Object.keys(cambios).length > 0) {
        const sesion = obtenerSesion()
        if (sesion) {
          const resultado = await actualizarPerfil(cambios)
          if (resultado.perfil) {
            guardarSesion({ ...sesion, ...resultado.perfil })
          }
        }
      }

      setPerfil({ ...form })
      setPassword('')
      setErrores({})
      setEditando(false)
    } catch (error) {
      setAviso(error.message || 'No se pudo actualizar la dirección.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="conf-envio">
      <h2 className="conf-envio__titulo">Confirmación de la dirección de envío</h2>

      {aviso && <Alerta variante="error">{aviso}</Alerta>}

      {editando ? (
        <div className="conf-envio__edicion">
          <div className="conf-envio__grid">
            {CAMPOS.map((campo) => (
              <Campo
                key={campo.nombre}
                completo={campo.completo}
                etiqueta={campo.etiqueta}
                name={campo.nombre}
                value={form[campo.nombre]}
                onChange={handleChange}
                requerido
                error={errores[campo.nombre]}
              />
            ))}
          </div>

          {haySesion && (
            <>
              <Campo
                completo
                etiqueta="Contraseña actual"
                type="password"
                name="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                placeholder="Obligatoria para guardar los cambios"
                autoComplete="current-password"
                error={errores.password}
              />
              <p className="conf-envio__nota">
                Para actualizar la dirección es necesaria la contraseña.
              </p>
            </>
          )}

          <div className="conf-envio__acciones">
            <Boton completo cargando={guardando} onClick={guardarCambios}>
              {guardando ? 'Guardando…' : 'Guardar dirección'}
            </Boton>
            {haySesion && (
              <Boton
                completo
                variante="secundario"
                onClick={() => {
                  setForm(perfil)
                  setPassword('')
                  setAviso('')
                  setEditando(false)
                }}
              >
                Cancelar
              </Boton>
            )}
          </div>
        </div>
      ) : (
        <div className="conf-envio__tarjeta">
          <p className="conf-envio__texto">
            Esta es la dirección guardada en tu perfil. Verifica que sea la correcta; si no lo es,
            puedes actualizarla antes de continuar.
          </p>

          <dl className="conf-envio__lista">
            {CAMPOS.map((campo) => (
              <div className="conf-envio__fila" key={campo.nombre}>
                <dt>{campo.etiqueta}</dt>
                <dd>{perfil[campo.nombre] || '—'}</dd>
              </div>
            ))}
          </dl>

          <Boton
            completo
            variante="secundario"
            onClick={() => {
              setForm(perfil)
              setPassword('')
              setAviso('')
              setEditando(true)
            }}
          >
            Actualizar dirección
          </Boton>
        </div>
      )}
    </div>
  )
})

export default ConfirmacionEnvio