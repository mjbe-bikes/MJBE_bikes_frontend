import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// ------------ Apartado de inicio de administrador ---------------------
import Inicio from "./vistaAdmi/Inicio"
import InicioBodega from "./vistaBodega/InicioBodega"
import Login from "./Login"
import Register from "./Register"

// ------------ Apartado de gestion de Empleados ---------------------
import CrearEmpleados from "./vistaAdmi/gestionDeEmpleados/CrearEmpleados"
import ActualizarEmpleados from "./vistaAdmi/gestionDeEmpleados/ActualizarEmpleados"
import VerUsuarios from "./vistaAdmi/gestionDeEmpleados/VerUsuarios"

// ------------ Apartado de gestion de Productos ---------------------
import VerProductos from "./vistaAdmi/gestionDeProducto/VerProductos"
import ActualizarProducto from "./vistaAdmi/gestionDeProducto/ActualizarProducto"
import VerProductosBodega from "./vistaBodega/VerProductos"
import ActualizarProductoBodega from "./vistaBodega/ActualizarProducto"

// ------------ Apartado de gestion de Proveedores ---------------------
import CrearProveedores from "./vistaAdmi/gestionDeProveedores/CrearProveedores"
import ActualizarProveedores from "./vistaAdmi/gestionDeProveedores/ActualizarProveedores"
import VerProveedores from "./vistaAdmi/gestionDeProveedores/VerProveedores"

function App() {
  const isLoggedIn = localStorage.getItem("mjbe_auth") === "true"
  const rolId = Number(localStorage.getItem("mjbe_rol_id") || 0)
  const homeRoute = rolId === 1 ? "/" : rolId === 3 ? "/InicioBodega" : "/login"

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn && rolId === 1 ? <Inicio /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />

        <Route
          path="/InicioBodega"
          element={
            isLoggedIn && rolId === 3 ? <InicioBodega /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : "/login"} replace />
          }
        />

        <Route
          path="/CrearEmpleado"
          element={
            isLoggedIn && rolId === 1 ? <CrearEmpleados /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/ActualizarEmpleados/:id"
          element={
            isLoggedIn && rolId === 1 ? <ActualizarEmpleados /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/VerUsuarios"
          element={
            isLoggedIn && rolId === 1 ? <VerUsuarios /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />

        <Route
          path="/VerProductos"
          element={
            isLoggedIn
              ? rolId === 1
                ? <VerProductos />
                : rolId === 3
                  ? <VerProductosBodega />
                  : <Navigate to="/login" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/ActualizarProducto/:id"
          element={
            isLoggedIn
              ? rolId === 1
                ? <ActualizarProducto />
                : rolId === 3
                  ? <ActualizarProductoBodega />
                  : <Navigate to="/login" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/CrearProveedores"
          element={
            isLoggedIn && rolId === 1 ? <CrearProveedores /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/ActualizarProveedores/:id"
          element={
            isLoggedIn && rolId === 1 ? <ActualizarProveedores /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/VerProveedores"
          element={
            isLoggedIn && rolId === 1 ? <VerProveedores /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            <Navigate to={isLoggedIn ? homeRoute : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App