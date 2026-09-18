// Pantalla de inicio de sesión

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import NavLogin from "./componentes/NavLogin"
import FooterLogin from "./componentes/FooterLogin"
import { saveSession } from "./auth"

// API Laravel/PHP que consulta los usuarios en MySQL
const API_URL = "http://127.0.0.1:8000/api/usuarios"

// API Node.js/Express encargada de registrar las sesiones
const SESSIONS_URL = "http://localhost:5000/api/sessions"

// Calcula el hash SHA-256 de la contraseña
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)

  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    // Validar que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa el correo y la contraseña.")
      return
    }

    try {
      // --------------------------------------------------
      // 1. Buscar el usuario en la API Laravel/PHP
      // --------------------------------------------------
      const response = await fetch(
        `${API_URL}?email=${encodeURIComponent(email.trim().toLowerCase())}`
      )

      if (!response.ok) {
        throw new Error("No se pudo consultar el usuario.")
      }

      const users = await response.json()

      if (!users || users.length === 0) {
        setError("Usuario no encontrado.")
        return
      }

      const user = users[0]

      // --------------------------------------------------
      // 2. Verificar que el usuario esté activo
      // --------------------------------------------------
      const estado = String(user.estado ?? "")
        .trim()
        .toLowerCase()

      if (estado !== "activo") {
        setError(
          `Tu usuario no está activo (estado actual: "${user.estado ?? "sin estado"}").`
        )
        return
      }

      // --------------------------------------------------
      // 3. Validar que el rol esté autorizado
      // --------------------------------------------------
      const rolId = Number(user.rol_id)

      if (rolId !== 1 && rolId !== 2 && rolId !== 3 && rolId !== 4) {
        setError("Rol no autorizado para acceder.")
        return
      }

      // --------------------------------------------------
      // 4. Encriptar la contraseña ingresada
      // --------------------------------------------------
      const hashedPassword = await hashPassword(password)

      // Comparar el hash ingresado con el almacenado en MySQL
      if (hashedPassword !== user.password_harsh) {
        setError("Credenciales incorrectas.")
        return
      }

      // --------------------------------------------------
      // 5. Preparar información de la sesión
      // --------------------------------------------------
      const sessionPayload = {
        user_id: user.id,
        login: user.login,
        email: user.email,
        rol_id: rolId,
        estado: user.estado,
        fecha_login: new Date().toISOString()
      }

      // --------------------------------------------------
      // 6. Registrar el inicio de sesión en el backend Express
      // --------------------------------------------------
      const sessionResponse = await fetch(SESSIONS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sessionPayload)
      })

      // Si Express responde con un error, no continuamos
      // como si la sesión se hubiera registrado correctamente.
      if (!sessionResponse.ok) {
        throw new Error("No se pudo registrar la sesión.")
      }

      // --------------------------------------------------
      // 7. Guardar la sesión en el frontend
      // --------------------------------------------------
      saveSession({
        id: user.id,
        login: user.login,
        email: user.email,
        rolId
      })

      // --------------------------------------------------
      // 8. Redirigir según el rol del usuario
      // --------------------------------------------------

      // Administrador
      if (rolId === 1) {
        navigate("/InicioAdmin", { replace: true })
        return
      }

      // Cliente
      if (rolId === 4) {
        navigate("/", { replace: true })
        return
      }

      // Vendedor
      if (rolId === 2) {
        navigate("/InformacionVenta", { replace: true })
        return
      }

      // Bodega
      navigate("/InicioBodega", { replace: true })

    } catch (err) {
      console.error(err)

      // Mostrar error de conexión o error del registro de sesión
      setError(
        err.message || "Error de conexión con el backend."
      )
    }
  }

  return (
    <>
      <NavLogin />

      <div className="auth-page">
        <div className="card auth-card mx-3 shadow border-0 rounded-4">

          {/* Encabezado */}
          <div className="card-header bg-primary text-white py-3 text-center">
            <h2 className="mb-1">Inicio de sesión</h2>
            <small>Ingresa con tu correo y contraseña.</small>
          </div>

          <div className="card-body">

            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form
              className="row g-4"
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
            >

              {/* Correo */}
              <div className="col-12">
                <label
                  htmlFor="loginEmail"
                  className="form-label fw-semibold"
                >
                  Correo electrónico
                </label>

                <input
                  id="loginEmail"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@mjbebikes.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Contraseña */}
              <div className="col-12">
                <label
                  htmlFor="loginPassword"
                  className="form-label fw-semibold"
                >
                  Contraseña
                </label>

                <input
                  id="loginPassword"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Botón */}
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                >
                  Iniciar sesión
                </button>
              </div>

            </form>

            {/* Registro */}
            <div className="text-center auth-link small">
              ¿Eres cliente?{" "}
              <Link to="/register">
                Regístrate aquí
              </Link>
            </div>

          </div>
        </div>
      </div>

      <FooterLogin />
    </>
  )
}

export default Login
