import { Link } from "react-router-dom";

function Navar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 no-print">
      <div className="container-fluid px-4">
        

        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          🚲 MJBE Bikes
        </Link>

        {/* Botón responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarVentas"
          aria-controls="navbarVentas"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div
          className="collapse navbar-collapse"
          id="navbarVentas"
        >
          <ul className="navbar-nav me-auto ms-4">


            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/historial-ventas">
                📋 Historial
              </Link>
            </li>


            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/facturacion">
                🧾 Facturas
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navar;