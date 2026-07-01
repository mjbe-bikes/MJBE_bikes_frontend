import { Routes, Route } from "react-router-dom";

import Vista from "./Vista";
import Facturacion from "./Facturacion";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Vista />} />
      <Route path="/ventas" element={<Vista />} />
      <Route path="/facturacion" element={<Facturacion />} />

      {/* Temporales */}
      <Route path="/historial-ventas" element={<Vista />} />
      <Route path="/clientes" element={<Vista />} />
      <Route path="/productos" element={<Vista />} />
    </Routes>
  );
}

export default App;