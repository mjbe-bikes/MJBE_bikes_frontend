// Pantalla de inicio de sesión

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import NavLogin from "./componentes/NavLogin"
import FooterLogin from "./componentes/FooterLogin"
import { saveSession } from "./auth"

const API_URL = "http://localhost:8000/api/login"

// Calcula el hash SHA-256 de la contraseña
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa el correo y la contraseña.")
      return
    }

    try {
      const hashedPassword = await hashPassword(password)

      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password_harsh: hashedPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.mensaje || "Credenciales incorrectas.")
        return
      }

      const user = data.usuario
      const rolId = Number(user.rol_id)
      if (rolId !== 1 && rolId !== 2 && rolId !== 3 && rolId !== 4) {
        setError("Rol no autorizado para acceder.")
        return
      }

      // Guardar sesión
      saveSession({ id: user.id, login: user.login, email: user.email, rolId })

      // Redirección al inicio de cada rol
      if (rolId === 1) {
        navigate("/InicioAdmin", { replace: true })
        return
      }

      if (rolId === 4) {
        navigate("/", { replace: true })
        return
      }

      if (rolId === 2) {
        navigate("/InformacionVenta", { replace: true })
        return
      }

      navigate("/InicioBodega", { replace: true })
    } catch (err) {
      console.error(err)
      setError("Error de conexión con el backend.")
    }
  }

  return (
    <>
      <NavLogin />
      <div className="auth-page">
        <div className="card auth-card mx-3 shadow border-0 rounded-4">
          <div className="card-header bg-primary text-white py-3 text-center">
            <h2 className="mb-1">Inicio de sesión</h2>
            <small>Ingresa con tu correo y contraseña.</small>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <form className="row g-4" onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="col-12">
                <label htmlFor="loginEmail" className="form-label fw-semibold">Correo electrónico</label>
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

              <div className="col-12">
                <label htmlFor="loginPassword" className="form-label fw-semibold">Contraseña</label>
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

              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Iniciar sesión
                </button>
              </div>
            </form>

            <div className="text-center auth-link small">
              ¿Eres cliente? <Link to="/register">Regístrate aquí</Link>
            </div>
          </div>
        </div>
      </div>
      <FooterLogin />
    </>
  )
}

export default Login
