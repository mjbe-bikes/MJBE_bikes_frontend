import { Routes, Route } from "react-router-dom";

import Vista from "./Vista";
import Facturacion from "./Facturacion";
import Productos from "./Productos";
import InfoEntrega from "./InformacionEntrega";
import InfoVenta from "./InformacionVenta";
import Cliente from "./Cliente";
import Historialventas from "./Historialventas";
import Footer from "./footer";

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Vista />} />
          <Route path="/ventas" element={<Vista />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/productos" element={<Productos />} />

          <Route
            path="/InformacionEntrega"
            element={<InfoEntrega />}
          />

          <Route
            path="/InformacionVenta"
            element={<InfoVenta />}
          />

          <Route
            path="/Cliente"
            element={<Cliente />}
          />

          <Route
            path="/Historialventas"
            element={<Historialventas />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;