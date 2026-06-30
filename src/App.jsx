import { BrowserRouter, Routes, Route } from "react-router-dom"
import InicioBodega from "./vistaBodega/InicioBodega"
import VerProductos from "./vistaBodega/VerProductos"
import CrearProducto from "./vistaBodega/CrearProducto"
import ActualizarProducto from "./vistaBodega/ActualizarProducto"

function App() {
  return (


      <BrowserRouter>
        <Routes>
          <Route path="/InicioBodega" element={<InicioBodega />} />
          <Route path="/VerProductos" element={<VerProductos />} />
          <Route path="/CrearProducto" element={<CrearProducto />} />
          <Route path="/ActualizarProducto/:id" element={<ActualizarProducto />} />




        </Routes>
      </BrowserRouter>

  )
}

export default App