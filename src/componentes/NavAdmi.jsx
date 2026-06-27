import { Link } from "react-router-dom";

function NavAdmi() {

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
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto ms-4">

            {/* Reportes */}
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/">
                📊 Reportes
              </Link>
            </li>

            {/* Productos */}

            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerProductos">
               📦 Productos
              </Link>
            
            </li>

            {/* Empleados */}

            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerEmpleados">
               👥 Empleados
              </Link>
            </li>

            {/* Proveedores */}
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerProveedores">
                🏭 Proveedores
              </Link>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  )
}

export default NavAdmi;