import { Link } from "react-router-dom";

function NavBodega() {

  return (
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 no-print">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-bold fs-3" to="/InicioBodega">
          🚲 MJBE Bikes
        </Link>

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

        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto ms-4">

            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/InicioBodega">
                📊 Reportes
              </Link>
            </li>


            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerProductos">
               📦 Productos
              </Link>
            
            </li>

          </ul>

        </div>
      </div>
    </nav>
  )
}

export default NavBodega;