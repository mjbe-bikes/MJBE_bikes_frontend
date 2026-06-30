import { BrowserRouter, Routes, Route } from "react-router-dom"

// ------------ Apartado de inicio de administrador ---------------------
import InicioBodega from "./vistaBodega/InicioBodega"
import VerProductos from "./vistaBodega/VerProductos"
import CrearProducto from "./vistaBodega/CrearProducto"
import ActualizarProducto from "./vistaBodega/ActualizarProducto"

function App() {
  return (


      <BrowserRouter>
        <Routes>
          // --- Apartado de inicio de administrador ---
          <Route path="/InicioBodega" element={<InicioBodega />} />
          <Route path="/VerProductos" element={<VerProductos />} />
          <Route path="/CrearProducto" element={<CrearProducto />} />
          <Route path="/ActualizarProducto/:id" element={<ActualizarProducto />} />




        </Routes>
      </BrowserRouter>

  )
}

export default App