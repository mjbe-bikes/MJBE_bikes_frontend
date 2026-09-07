import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"

// ------------ Apartado de Cliente e Inicio ----------------------------
import Inicio from "./Inicio"
import ProductoDetalle from "./vistaCliente/ProductoDetalle"
import ProductosCliente from "./vistaCliente/ProductosCliente"
import CompraCliente from "./vistaCliente/CompraCliente"
import MisCompras from "./vistaCliente/MisCompras"
import { CartProvider } from "./vistaCliente/Carrito"

// ------------ Apartado de inicio de administrador ---------------------
import InicioAdmin from "./vistaAdmi/Inicio"
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

function CheckoutProtegido() {
  useLocation()
  const esCliente = localStorage.getItem("mjbe_auth") === "true"
    && Number(localStorage.getItem("mjbe_rol_id")) === 4

  return esCliente ? <CompraCliente /> : <Navigate to="/login" replace />
}

function ComprasProtegidas() {
  useLocation()
  const esCliente = localStorage.getItem("mjbe_auth") === "true"
    && Number(localStorage.getItem("mjbe_rol_id")) === 4

  return esCliente ? <MisCompras /> : <Navigate to="/login" replace />
}

function App() {
  const isLoggedIn = localStorage.getItem("mjbe_auth") === "true"
  const rolId = Number(localStorage.getItem("mjbe_rol_id") || 0)
  const homeRoute = rolId === 1 ? "/" : rolId === 3 ? "/InicioBodega" : "/login"

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
        <Route
          path="/"
          element={
            <Inicio /> 
          }
        />

        <Route
          path="/producto/:id"
          element={
             <ProductoDetalle />
          }
        />
        <Route path="/productos" element={<ProductosCliente />} />
        <Route
          path="/checkout"
          element={<CheckoutProtegido />}
        />
        <Route path="/mis-compras" element={<ComprasProtegidas />} />
        <Route
          path="/InicioAdmin"
          element={
            isLoggedIn && rolId === 1 ? <InicioAdmin /> : <Navigate to={isLoggedIn && rolId === 3 ? "/InicioBodega" : "/login"} replace />
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
      </CartProvider>
    </BrowserRouter>
  )
}

export default App