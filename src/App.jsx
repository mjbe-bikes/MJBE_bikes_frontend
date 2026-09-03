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

// ------------ Apartado de gestion de Clientes ---------------------
import VerClientes from "./vistaAdmi/gestionDeVentas/clientesVentas/VerClientes"
import CrearClientes from "./vistaAdmi/gestionDeVentas/clientesVentas/CrearClientes"
import ActualizarClientes from "./vistaAdmi/gestionDeVentas/clientesVentas/ActualizarClientes"

// ------------ Apartado de gestion de Ventas ---------------------
import Historialventas from "./vistaAdmi/gestionDeVentas/Historialventas"
import InformacionVenta from "./vistaAdmi/gestionDeVentas/InformacionVenta"
import CrearVenta from "./vistaAdmi/gestionDeVentas/CrearVenta"
import InicioVentas from "./vistaAdmi/gestionDeVentas/InicioVentas"

function App() {
  const isLoggedIn = localStorage.getItem("mjbe_auth") === "true"
  const rolId = Number(localStorage.getItem("mjbe_rol_id") || 0)
  const homeRoute = rolId === 1 ? "/" : rolId === 2 ? "/InicioVentas" : rolId === 3 ? "/InicioBodega" : "/login"

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
              ? rolId === 1
                ? <Inicio />
                : rolId === 2
                  ? <InicioVentas />
                  : rolId === 3
                    ? <InicioBodega />
                    : <Navigate to="/login" replace />
              : <Navigate to="/login" replace />
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
        <Route
          path="/VerClientes"
          element={
            isLoggedIn && (rolId === 1 || rolId === 2) ? <VerClientes /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/CrearClientes"
          element={
            isLoggedIn && (rolId === 1 || rolId === 2) ? <CrearClientes /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/ActualizarClientes/:id_cliente"
          element={
            isLoggedIn && (rolId === 1 || rolId === 2) ? <ActualizarClientes /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/Historialventas"
          element={
            isLoggedIn && rolId === 2 ? <Historialventas /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/CrearVenta"
          element={
            isLoggedIn && rolId === 2 ? <CrearVenta /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : "/login"} replace />
          }
        />
        <Route
          path="/InformacionVenta"
          element={
            isLoggedIn && rolId === 2 ? <Navigate to="/InicioVentas" replace /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : "/login"} replace />
          }
        />
        <Route
          path="/InicioVentas"
          element={
            isLoggedIn && rolId === 2 ? <InicioVentas /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
          }
        />
        <Route
          path="/InformacionVenta/:id_venta"
          element={
            isLoggedIn && rolId === 2 ? <InformacionVenta /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : "/login"} replace />
          }
        />
        <Route
          path="/Cliente"
          element={
            isLoggedIn && rolId === 2 ? <VerClientes /> : <Navigate to={isLoggedIn && rolId === 1 ? "/" : isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
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