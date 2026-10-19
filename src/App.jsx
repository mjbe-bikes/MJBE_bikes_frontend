
// Enrutador central: define qué componente se muestra en cada URL y quién
// puede entrar (guards por rol: 1=Admin, 2=Vendedor, 3=Bodega, 4=Cliente)

import { useSyncExternalStore } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"

import { subscribeAuth, getAuthSnapshot } from "./auth"

// ------------ Apartado de Cliente e Inicio ----------------------------
import Inicio from "./Inicio"
import ProductoDetalle from "./vistaCliente/ProductoDetalle"
import ProductosCliente from "./vistaCliente/ProductosCliente"
import CompraCliente from "./vistaCliente/CompraCliente"
import MisCompras from "./vistaCliente/MisCompras"
import { CartProvider } from "./vistaCliente/Carrito"

// ------------ Apartado de inicio de administrador ---------------------
import InicioAdmin from "./vistaAdmi/InicioAdmin"
import InicioBodega from "./vistaBodega/InicioBodega"
import Login from "./Login"
import Register from "./Register"

// ------------ Apartado de gestion de Empleados ------------------------
import CrearEmpleados from "./vistaAdmi/gestionDeEmpleados/CrearEmpleados"
import ActualizarEmpleados from "./vistaAdmi/gestionDeEmpleados/ActualizarEmpleados"
import VerUsuarios from "./vistaAdmi/gestionDeEmpleados/VerUsuarios"

// ------------ Apartado de gestion de Productos ------------------------
import VerProductos from "./vistaAdmi/gestionDeProducto/VerProductos"
import CrearProducto from "./vistaAdmi/gestionDeProducto/CrearProducto"
import ActualizarProducto from "./vistaAdmi/gestionDeProducto/ActualizarProducto"

import VerProductosBodega from "./vistaBodega/VerProductos"
import CrearProductoBodega from "./vistaBodega/CrearProducto"
import ActualizarProductoBodega from "./vistaBodega/ActualizarProducto"

// ------------ Apartado de gestion de Proveedores ----------------------
import CrearProveedores from "./vistaAdmi/gestionDeProveedores/CrearProveedores"
import ActualizarProveedores from "./vistaAdmi/gestionDeProveedores/ActualizarProveedores"
import VerProveedores from "./vistaAdmi/gestionDeProveedores/VerProveedores"

// ------------ Apartado de gestion de Clientes -------------------------
import VerClientes from "./vistaAdmi/gestionDeVentas/clientesVentas/VerClientes"
import CrearClientes from "./vistaAdmi/gestionDeVentas/clientesVentas/CrearClientes"
import ActualizarClientes from "./vistaAdmi/gestionDeVentas/clientesVentas/ActualizarClientes"

// ------------ Apartado de gestion de Ventas ---------------------------
import VerVenta from "./vistaAdmi/gestionDeVentas/VerVenta"
import VentasAdmin from "./vistaAdmi/gestionDeVentas/VentasAdmin"
import DetallesVenta from "./vistaAdmi/gestionDeVentas/DetallesVenta"
import CrearVenta from "./vistaAdmi/gestionDeVentas/CrearVenta"
import InicioVentas from "./vistaAdmi/gestionDeVentas/InicioVentas"

// ------------ Apartado de gestion de Compras --------------------------
import VerCompra from "./vistaAdmi/gestionDeCompras/VerCompra"
import DetallesCompra from "./vistaAdmi/gestionDeCompras/DetallesCompra"
import CrearCompra from "./vistaAdmi/gestionDeCompras/CrearCompra"


// ================================================================
// GUARD PARA EL CHECKOUT DEL CLIENTE
// ================================================================

function CheckoutProtegido() {
  useLocation()

  const esCliente =
    localStorage.getItem("mjbe_auth") === "true" &&
    Number(localStorage.getItem("mjbe_rol_id")) === 4

  return esCliente ? (
    <CompraCliente />
  ) : (
    <Navigate to="/login" replace />
  )
}


// ================================================================
// GUARD PARA LAS COMPRAS DEL CLIENTE
// ================================================================

function ComprasProtegidas() {
  useLocation()

  const esCliente =
    localStorage.getItem("mjbe_auth") === "true" &&
    Number(localStorage.getItem("mjbe_rol_id")) === 4

  return esCliente ? (
    <MisCompras />
  ) : (
    <Navigate to="/login" replace />
  )
}


// ================================================================
// APP PRINCIPAL
// ================================================================

function App() {

  // Estado de sesión reactivo.
  // Este valor determina si el usuario puede entrar a las
  // diferentes rutas protegidas.
  const { isLoggedIn, rolId } = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot
  )


  // ==============================================================
  // DEBUG DE AUTENTICACIÓN
  // ==============================================================

  // Este console.log nos permite comprobar si al pulsar
  // "Crear Producto" la sesión y el rol siguen existiendo.
  console.log("AUTH:", {
    isLoggedIn,
    rolId,
    ruta: window.location.pathname,
    mjbe_auth: localStorage.getItem("mjbe_auth"),
    mjbe_rol_id: localStorage.getItem("mjbe_rol_id"),
  })


  // ==============================================================
  // RUTA PRINCIPAL SEGÚN EL ROL
  // ==============================================================

  const homeRoute =
    rolId === 1
      ? "/InicioAdmin"
      : rolId === 2
        ? "/InicioVentas"
        : rolId === 3
          ? "/InicioBodega"
          : rolId === 4
            ? "/"
            : "/login"


  return (
    <BrowserRouter>

      <CartProvider>

        <Routes>

          {/* =====================================================
              ZONA PÚBLICA / CLIENTE
              ===================================================== */}

          <Route
            path="/"
            element={<Inicio />}
          />

          <Route
            path="/producto/:id"
            element={<ProductoDetalle />}
          />

          <Route
            path="/productos"
            element={<ProductosCliente />}
          />

          <Route
            path="/checkout"
            element={<CheckoutProtegido />}
          />

          <Route
            path="/mis-compras"
            element={<ComprasProtegidas />}
          />


          {/* =====================================================
              INICIO ADMINISTRADOR
              ===================================================== */}

          <Route
            path="/InicioAdmin"
            element={
              isLoggedIn && rolId === 1
                ? <InicioAdmin />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              INICIO BODEGA
              ===================================================== */}

          <Route
            path="/InicioBodega"
            element={
              isLoggedIn && rolId === 3
                ? <InicioBodega />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 1
                        ? "/"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              GESTIÓN DE EMPLEADOS
              ===================================================== */}

          <Route
            path="/CrearEmpleado"
            element={
              isLoggedIn && rolId === 1
                ? <CrearEmpleados />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/ActualizarEmpleados/:id"
            element={
              isLoggedIn && rolId === 1
                ? <ActualizarEmpleados />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/VerUsuarios"
            element={
              isLoggedIn && rolId === 1
                ? <VerUsuarios />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              GESTIÓN DE PRODUCTOS
              ===================================================== */}

          <Route
            path="/VerProductos"
            element={
              isLoggedIn
                ? (
                  rolId === 1
                    ? <VerProductos />
                    : rolId === 3
                      ? <VerProductosBodega />
                      : <Navigate to="/login" replace />
                )
                : <Navigate to="/login" replace />
            }
          />


          {/* =====================================================
              CREAR PRODUCTO

              Esta ruta debe estar DENTRO de <Routes>.
              Solo puede acceder el administrador (rol 1).
              ===================================================== */}

          <Route
            path="/CrearProducto"
            element={
              isLoggedIn
                ? (
                  rolId === 1
                    ? <CrearProducto />
                    : rolId === 3
                      ? <CrearProductoBodega />
                      : <Navigate to="/login" replace />
                )
                : <Navigate to="/login" replace />
            }
          />


          {/* =====================================================
              ACTUALIZAR PRODUCTO
              ===================================================== */}

          <Route
            path="/ActualizarProducto/:id"
            element={
              isLoggedIn
                ? (
                  rolId === 1
                    ? <ActualizarProducto />
                    : rolId === 3
                      ? <ActualizarProductoBodega />
                      : <Navigate to="/login" replace />
                )
                : <Navigate to="/login" replace />
            }
          />


          {/* =====================================================
              GESTIÓN DE PROVEEDORES
              ===================================================== */}

          <Route
            path="/CrearProveedores"
            element={
              isLoggedIn && rolId === 1
                ? <CrearProveedores />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/ActualizarProveedores/:id"
            element={
              isLoggedIn && rolId === 1
                ? <ActualizarProveedores />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/VerProveedores"
            element={
              isLoggedIn && rolId === 1
                ? <VerProveedores />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              GESTIÓN DE CLIENTES
              ===================================================== */}

          <Route
            path="/VerClientes"
            element={
              isLoggedIn && (rolId === 1 || rolId === 2)
                ? <VerClientes />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/CrearClientes"
            element={
              isLoggedIn && (rolId === 1 || rolId === 2)
                ? <CrearClientes />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/ActualizarClientes/:id_cliente"
            element={
              isLoggedIn && (rolId === 1 || rolId === 2)
                ? <ActualizarClientes />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              GESTIÓN DE VENTAS
              ===================================================== */}

          <Route
            path="/Ventas"
            element={
              isLoggedIn && rolId === 2
                ? <VerVenta />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 1
                        ? "/"
                        : isLoggedIn && rolId === 3
                          ? "/InicioBodega"
                          : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/VentasAdmin"
            element={
              isLoggedIn && rolId === 1
                ? <VentasAdmin />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 2
                        ? "/Ventas"
                        : isLoggedIn && rolId === 3
                          ? "/InicioBodega"
                          : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/CrearVenta"
            element={
              isLoggedIn && rolId === 2
                ? <CrearVenta />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 1
                        ? "/"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/InformacionVenta"
            element={
              isLoggedIn && rolId === 2
                ? <Navigate to="/InicioVentas" replace />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 1
                        ? "/"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/InicioVentas"
            element={
              isLoggedIn && rolId === 2
                ? <InicioVentas />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 1
                        ? "/"
                        : isLoggedIn && rolId === 3
                          ? "/InicioBodega"
                          : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/DetallesVenta/:id_venta"
            element={
              isLoggedIn && (rolId === 1 || rolId === 2)
                ? <DetallesVenta />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              GESTIÓN DE COMPRAS
              ===================================================== */}

          <Route
            path="/compras"
            element={
              isLoggedIn && rolId === 1
                ? <VerCompra />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/CrearCompra"
            element={
              isLoggedIn && rolId === 1
                ? <CrearCompra />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />

          <Route
            path="/DetallesCompra/:id_compra"
            element={
              isLoggedIn && rolId === 1
                ? <DetallesCompra />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 3
                        ? "/InicioBodega"
                        : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              CLIENTE / VENTAS
              ===================================================== */}

          <Route
            path="/Cliente"
            element={
              isLoggedIn && rolId === 2
                ? <VerClientes />
                : (
                  <Navigate
                    to={
                      isLoggedIn && rolId === 1
                        ? "/"
                        : isLoggedIn && rolId === 3
                          ? "/InicioBodega"
                          : "/login"
                    }
                    replace
                  />
                )
            }
          />


          {/* =====================================================
              AUTENTICACIÓN
              ===================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =====================================================
              CUALQUIER URL NO RECONOCIDA
              ===================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to={isLoggedIn ? homeRoute : "/login"}
                replace
              />
            }
          />

        </Routes>

      </CartProvider>

    </BrowserRouter>
  )
}

export default App
