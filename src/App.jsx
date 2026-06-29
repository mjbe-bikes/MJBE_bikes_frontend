import { BrowserRouter, Routes, Route } from "react-router-dom"

// ------------ Apartado de inicio de administrador ---------------------
import Inicio from "./vistaAdmi/Inicio"

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
  return (


      <BrowserRouter>
        <Routes>
          // --- Apartado de inicio de administrador ---
          <Route path="/" element={<Inicio />} />

          // --- Apartado de gestion de Empleados ---
          <Route path="/CrearEmpleado" element={<CrearEmpleados />} />
          <Route path="/ActualizarEmpleados/:id" element={<ActualizarEmpleados />} />
          <Route path="/VerUsuarios" element={<VerUsuarios />} />


          // --- Apartado de gestion de Productos ---
          <Route path="/VerProductos" element={<VerProductos />} />

          // --- Apartado de gestion de Proveedores ---
          <Route path="/CrearProveedores" element={<CrearProveedores />} />
          <Route path="/ActualizarProveedores/:id" element={<ActualizarProveedores />} />
          <Route path="/VerProveedores" element={<VerProveedores />} />

        </Routes>
      </BrowserRouter>

  )
}

export default App