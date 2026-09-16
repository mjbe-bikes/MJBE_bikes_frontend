// Registro de un cliente nuevo

// Importamos useState para manejar los datos y estados del formulario.
// useNavigate permite redirigir al usuario después del registro.
// Link permite crear el enlace hacia la página de inicio de sesión.
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

// Componentes de navegación y pie de página utilizados en la pantalla de login/registro.
import NavLogin from "./componentes/NavLogin"
import FooterLogin from "./componentes/FooterLogin"

// URL del endpoint de usuarios de nuestra API Laravel.
// El frontend se comunica con este endpoint para consultar y registrar usuarios.
const API_URL = "http://127.0.0.1:8000/api/usuarios"

// Función encargada de convertir la contraseña en un hash SHA-256.
// De esta manera, la contraseña no se envía directamente en texto plano al backend.
async function hashPassword(password) {
  // TextEncoder convierte la contraseña en datos que pueden ser procesados
  // por la función criptográfica del navegador.
  const encoder = new TextEncoder()
  const data = encoder.encode(password)

  // Generamos el hash SHA-256 utilizando la API Crypto del navegador.
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)

  // Convertimos el resultado binario del hash en un arreglo de bytes.
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // Convertimos cada byte a hexadecimal y unimos todos los valores
  // para obtener una cadena de texto con el hash completo.
  return hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function Register() {
  // Permite redirigir al usuario a otra ruta de React.
  const navigate = useNavigate()

  // Estado que almacena los valores ingresados en el formulario.
  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Estados utilizados para mostrar mensajes de error o éxito.
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Se ejecuta cada vez que el usuario modifica uno de los campos.
  // Utilizamos el atributo "name" del input para saber qué propiedad actualizar.
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Función principal que se ejecuta cuando el usuario envía el formulario.
  const handleSubmit = async (event) => {
    // Evitamos que el navegador recargue la página automáticamente.
    event.preventDefault()

    // Limpiamos mensajes anteriores antes de comenzar una nueva validación.
    setError("")
    setSuccess("")

    // Verificamos que ninguno de los campos obligatorios esté vacío.
    if (
      !form.login.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Todos los campos son obligatorios.")
      return
    }

    // Verificamos que la contraseña y su confirmación sean iguales.
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    // Antes de crear el usuario, consultamos la API para verificar
    // si ya existe otro usuario con el mismo login o correo electrónico.
    try {
      const response = await fetch(API_URL)

      // Si Laravel responde con un código HTTP de error,
      // detenemos el proceso y mostramos un mensaje.
      if (!response.ok) {
        throw new Error("No se pudieron consultar los usuarios.")
      }

      // Convertimos la respuesta de Laravel de JSON a un arreglo de usuarios.
      const usuarios = await response.json()

      // Buscamos coincidencias comparando login y correo sin importar
      // si el usuario escribió letras mayúsculas o minúsculas.
      const usuarioExiste = usuarios.some(
        (usuario) =>
          usuario.login?.toLowerCase() === form.login.trim().toLowerCase() ||
          usuario.email?.toLowerCase() === form.email.trim().toLowerCase()
      )

      // Si encontramos una coincidencia, detenemos el registro.
      if (usuarioExiste) {
        setError("El usuario o el correo ya están registrados.")
        return
      }
    } catch (error) {
      // Mostramos el error en la consola para facilitar la depuración.
      console.error(error)

      // Informamos al usuario que no fue posible consultar la API.
      setError("No se pudo validar si el usuario ya existe.")
      return
    }

    // Si todas las validaciones anteriores fueron correctas,
    // procedemos a registrar el nuevo usuario mediante POST.
    try {
      // Generamos el hash de la contraseña antes de enviarla al backend.
      const hashedPassword = await hashPassword(form.password)

      // Enviamos los datos del nuevo usuario a Laravel.
      const response = await fetch(API_URL, {
        method: "POST",

        // Indicamos que los datos enviados están en formato JSON.
        headers: {
          "Content-Type": "application/json"
        },

        // Datos que recibirá el UsuarioController de Laravel.
        body: JSON.stringify({
          login: form.login,
          email: form.email,

          // Nombre del campo utilizado por nuestra API para almacenar
          // la contraseña convertida en hash.
          password_harsh: hashedPassword,

          // Rol 4 corresponde al cliente.
          rol_id: 4,

          // Estado inicial asignado al usuario.
          estado: "activo"
        })
      })

      // Si Laravel devuelve un código HTTP de error,
      // intentamos obtener el mensaje enviado por el backend.
      if (!response.ok) {
        const data = await response.json()

        setError(data?.mensaje || "Error al registrar el cliente.")
        return
      }

      // Si el registro fue exitoso, mostramos el mensaje de confirmación.
      setSuccess(
        "Registro exitoso. Ahora puedes iniciar sesión como administrador o esperar la activación."
      )

      // Limpiamos todos los campos del formulario después del registro.
      setForm({
        login: "",
        email: "",
        password: "",
        confirmPassword: ""
      })

      // Después de 1.5 segundos enviamos al usuario a la pantalla de login.
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      // Capturamos errores relacionados con la conexión o la petición.
      console.error(err)

      // Mostramos un mensaje amigable al usuario.
      setError("Error de conexión con el backend.")
    }
  }

  return (
    <>
      {/* Barra de navegación de la sección de autenticación. */}
      <NavLogin />

      <div className="auth-page">
        <div className="card auth-card mx-3 shadow border-0 rounded-4">

          {/* Encabezado visual del formulario de registro. */}
          <div className="card-header bg-success text-white py-3 text-center">
            <h2 className="mb-1">Registro de cliente</h2>
            <small>Completa los campos para crear tu cuenta.</small>
          </div>

          <div className="card-body">

            {/* Mensaje de error mostrado cuando alguna validación falla. */}
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {/* Mensaje mostrado cuando el registro se completa correctamente. */}
            {success && (
              <div className="alert alert-success py-2" role="alert">
                {success}
              </div>
            )}

            {/* Formulario principal de registro. */}
            <form
              className="row g-4"
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
            >

              {/* Campo para ingresar el nombre de usuario. */}
              <div className="col-md-6">
                <label
                  htmlFor="registerLogin"
                  className="form-label fw-semibold"
                >
                  Usuario
                </label>

                <input
                  id="registerLogin"
                  type="text"
                  name="login"
                  className="form-control"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Campo para ingresar el correo electrónico. */}
              <div className="col-md-6">
                <label
                  htmlFor="registerEmail"
                  className="form-label fw-semibold"
                >
                  Correo electrónico
                </label>

                <input
                  id="registerEmail"
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Campo para ingresar la contraseña. */}
              <div className="col-md-6">
                <label
                  htmlFor="registerPassword"
                  className="form-label fw-semibold"
                >
                  Contraseña
                </label>

                <input
                  id="registerPassword"
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Campo para confirmar la contraseña. */}
              <div className="col-md-6">
                <label
                  htmlFor="registerConfirmPassword"
                  className="form-label fw-semibold"
                >
                  Confirmar contraseña
                </label>

                <input
                  id="registerConfirmPassword"
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Parte inferior del formulario con el rol y botón de registro. */}
              <div className="col-12 d-flex justify-content-between align-items-center">

                {/* El rol se asigna automáticamente desde el código. */}
                <div className="text-muted small">
                  Rol asignado: Cliente
                </div>

                {/* Botón que ejecuta handleSubmit al enviar el formulario. */}
                <button
                  type="submit"
                  className="btn btn-success px-4"
                >
                  Registrarme
                </button>
              </div>
            </form>

            {/* Enlace para usuarios que ya tienen una cuenta. */}
            <div className="text-center auth-link small mt-3">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página de la sección de autenticación. */}
      <FooterLogin />
    </>
  )
}

export default Register
