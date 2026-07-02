import { Link, useNavigate } from "react-router-dom";

function NavAdmi() {
  const navigate = useNavigate();
  const userName =
    localStorage.getItem("mjbe_user_login") ||
    localStorage.getItem("mjbe_user") ||
    "Administrador"

  function handleLogout() {
    localStorage.removeItem("mjbe_auth")
    localStorage.removeItem("mjbe_user_login")
    localStorage.removeItem("mjbe_user_email")
    localStorage.removeItem("mjbe_rol_id")
    navigate("/login", { replace: true })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 no-print">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold fs-3" to="/">
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto ms-4">
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/">
                📊 Reportes
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerProductos">
                📦 Productos
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerUsuarios">
                👥 Usuarios
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/VerProveedores">
                🏭 Proveedores
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center text-white">
            <span className="me-3">Hola, {userName}</span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavAdmi;