import { useEffect, useState } from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import NavLogin from "./componentes/NavLogin"
import FooterLogin from "./componentes/FooterLogin"

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
  const isLoggedIn = localStorage.getItem("mjbe_auth") === "true"

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true })
    }
  }, [isLoggedIn, navigate])

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa el correo y la contraseña.")
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/usuarios?email=${encodeURIComponent(email.trim().toLowerCase())}`)
      const users = await response.json()
      if (!users || users.length === 0) {
        setError("Usuario no encontrado.")
        return
      }

      const user = users[0]
      if (user.estado !== "activo") {
        setError("Usuario no está activo.")
        return
      }

      if (user.rol_id !== 1) {
        setError("Solo administradores pueden acceder.")
        return
      }

      const hashedPassword = await hashPassword(password)
      if (hashedPassword !== user.password_harsh) {
        setError("Credenciales incorrectas.")
        return
      }

      const sessionPayload = {
        user_id: user.id,
        login: user.login,
        email: user.email,
        rol_id: user.rol_id,
        estado: user.estado,
        fecha_login: new Date().toISOString()
      }

      await fetch("http://localhost:3001/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sessionPayload)
      })

      localStorage.setItem("mjbe_auth", "true")
      localStorage.setItem("mjbe_user_id", String(user.id))
      localStorage.setItem("mjbe_user_login", user.login)
      localStorage.setItem("mjbe_user_email", user.email)
      localStorage.setItem("mjbe_rol_id", String(user.rol_id))

      navigate("/", { replace: true })
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
