import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// ------------ Apartado de inicio de administrador ---------------------
import Inicio from "./vistaAdmi/Inicio"
import Login from "./Login"
import Register from "./Register"

// ------------ Apartado de gestion de Empleados ---------------------
import CrearEmpleados from "./vistaAdmi/gestionDeEmpleados/CrearEmpleados"
import ActualizarEmpleados from "./vistaAdmi/gestionDeEmpleados/ActualizarEmpleados"
import VerUsuarios from "./vistaAdmi/gestionDeEmpleados/VerUsuarios"

// ------------ Apartado de gestion de Productos ---------------------
import VerProductos from "./vistaAdmi/gestionDeProducto/VerProductos"

// ------------ Apartado de gestion de Proveedores ---------------------
import CrearProveedores from "./vistaAdmi/gestionDeProveedores/CrearProveedores"
import ActualizarProveedores from "./vistaAdmi/gestionDeProveedores/ActualizarProveedores"
import VerProveedores from "./vistaAdmi/gestionDeProveedores/VerProveedores"

function App() {
  const isLoggedIn = localStorage.getItem("mjbe_auth") === "true"

  return (
    <BrowserRouter>
      <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Inicio /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/CrearEmpleado"
            element={
              isLoggedIn ? <CrearEmpleados /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/ActualizarEmpleados/:id"
            element={
              isLoggedIn ? <ActualizarEmpleados /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/VerUsuarios"
            element={
              isLoggedIn ? <VerUsuarios /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/VerProductos"
            element={
              isLoggedIn ? <VerProductos /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/CrearProveedores"
            element={
              isLoggedIn ? <CrearProveedores /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/ActualizarProveedores/:id"
            element={
              isLoggedIn ? <ActualizarProveedores /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/VerProveedores"
            element={
              isLoggedIn ? <VerProveedores /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <Navigate to={isLoggedIn ? "/" : "/login"} replace />
            }
          />
        </Routes>
      </BrowserRouter>

  )
}

export default App