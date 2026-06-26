import { BrowserRouter, Routes, Route } from "react-router-dom"

import Inicio from "./vistaAdmi/Inicio"
import ActualizarProducto from "./vistaAdmi/gestionDeProducto/ActualizarProducto"
import VerProductos from "./vistaAdmi/gestionDeProducto/VerProductos"

function App() {
  return (


      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/ActualizarProducto" element={<ActualizarProducto />} />
          <Route path="/VerProductos" element={<VerProductos/>} />
        </Routes>
      </BrowserRouter>

  )
}

export default App