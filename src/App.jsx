import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import InicioBodega from "./vistaBodega/InicioBodega"
import VerProductos from "./vistaBodega/VerProductos"
import CrearProducto from "./vistaBodega/CrearProducto"
import ActualizarProducto from "./vistaBodega/ActualizarProducto"
import Login from "./vistaBodega/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/InicioBodega" element={<InicioBodega />} />
        <Route path="/VerProductos" element={<VerProductos />} />
        <Route path="/CrearProducto" element={<CrearProducto />} />
        <Route path="/ActualizarProducto/:id" element={<ActualizarProducto />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App