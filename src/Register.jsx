// Registro de un cliente nuevo

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import NavLogin from "./componentes/NavLogin"
import FooterLogin from "./componentes/FooterLogin"

const API_URL = "http://localhost:5000/api/register"

// Calcula el hash SHA-256 de la contraseña
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!form.login.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError("Todos los campos son obligatorios.")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    try {
      const hashedPassword = await hashPassword(form.password)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login: form.login,
          email: form.email,
          password_harsh: hashedPassword
        })
      })

      if (!response.ok) {
        const data = await response.json()
        // El rol y el email/login no llegan como campo: Laravel
        // responde con el mensaje genérico de validación (message/errors).
        const primerError = data?.errors && Object.values(data.errors)[0]?.[0]
        setError(primerError || data?.mensaje || data?.message || "Error al registrar el cliente.")
        return
      }

      setSuccess("Registro exitoso. Ahora puedes iniciar sesión como administrador o esperar la activación.")
      setForm({ login: "", email: "", password: "", confirmPassword: "" })
      setTimeout(() => navigate("/login"), 1500)
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
          <div className="card-header bg-success text-white py-3 text-center">
            <h2 className="mb-1">Registro de cliente</h2>
            <small>Completa los campos para crear tu cuenta.</small>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success py-2" role="alert">
                {success}
              </div>
            )}

            <form className="row g-4" onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="col-md-6">
                <label htmlFor="registerLogin" className="form-label fw-semibold">Usuario</label>
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

              <div className="col-md-6">
                <label htmlFor="registerEmail" className="form-label fw-semibold">Correo electrónico</label>
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

              <div className="col-md-6">
                <label htmlFor="registerPassword" className="form-label fw-semibold">Contraseña</label>
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

              <div className="col-md-6">
                <label htmlFor="registerConfirmPassword" className="form-label fw-semibold">Confirmar contraseña</label>
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

              <div className="col-12 d-flex justify-content-between align-items-center">
                <div className="text-muted small">Rol asignado: Cliente</div>
                <button type="submit" className="btn btn-success px-4">
                  Registrarme
                </button>
              </div>
            </form>

            <div className="text-center auth-link small mt-3">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
      <FooterLogin />
    </>
  )
}

export default Register
