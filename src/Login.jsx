// Pantalla de inicio de sesión

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import NavLogin from "./componentes/NavLogin"
import FooterLogin from "./componentes/FooterLogin"
import { saveSession } from "./auth"

// API Laravel/PHP que consulta los usuarios en MySQL
const API_URL = "http://127.0.0.1:8000/api/usuarios"



// C


function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  
async function handleSubmit(event) {
  event.preventDefault()
  setError("")
  console.log("🔥 LOGIN HANDLE EJECUTADO")

  // Validamos que los campos no estén vacíos.
  if (!email.trim() || !password.trim()) {
    setError("Por favor ingresa el correo y la contraseña.")
    return
  }

  try {
    // --------------------------------------------------
    // 1. Calcular el SHA-256 de la contraseña
    // --------------------------------------------------
    // Tu Laravel actualmente compara directamente este
    // hash con el campo password_harsh de la base de datos.
    const encoder = new TextEncoder()
    const data = encoder.encode(password)

    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      data
    )

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashedPassword = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")

    // --------------------------------------------------
    // 2. Iniciar sesión directamente en Laravel
    // --------------------------------------------------
    // credentials: "include" permite que el navegador
    // reciba y posteriormente envíe la cookie HttpOnly
    // mjbe_token.
    const response = await fetch(
      "http://127.0.0.1:8000/api/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: email.trim().toLowerCase(),

          // Laravel espera exactamente este nombre.
          password_harsh: hashedPassword,
        }),
      }
    )

    const datos = await response.json()
    console.log("RESPUESTA LOGIN:", datos);
    // Si Laravel rechaza las credenciales, mostramos
    // el mensaje recibido desde el backend.
    if (!response.ok) {
      throw new Error(
        datos.mensaje || "Correo o contraseña incorrectos."
      )
    }

    // --------------------------------------------------
    // 3. Obtener los datos del usuario autenticado
    // --------------------------------------------------
    localStorage.setItem("mjbe_token", datos.token)
    const user = datos.usuario

    const rolId = Number(user.rol_id)

    // --------------------------------------------------
    // 4. Guardar la información visual de la sesión
    // --------------------------------------------------
    // Esto mantiene tu sistema actual de rutas y estado
    // del frontend.
    saveSession({
      id: user.id,
      login: user.login,
      email: user.email,
      rolId,
    })

    // --------------------------------------------------
    // 5. Redirigir según el rol
    // --------------------------------------------------

    // Administrador
    if (rolId === 1) {
      navigate("/InicioAdmin", { replace: true })
      return
    }

    // Vendedor
    if (rolId === 2) {
      navigate("/InformacionVenta", { replace: true })
      return
    }

    // Bodega
    if (rolId === 3) {
      navigate("/InicioBodega", { replace: true })
      return
    }

    // Cliente
    if (rolId === 4) {
      navigate("/", { replace: true })
      return
    }

    // Por seguridad, rechazamos cualquier rol desconocido.
    setError("Rol no autorizado para acceder.")

  } catch (err) {
    console.error("Error durante el inicio de sesión:", err)

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
