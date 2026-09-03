import { Link, useNavigate  } from "react-router-dom";

function NavVentas() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("mjbe_user_login") || "Usuario";

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

              {/* Información de venta */}
            <li className="nav-item mx-2">
             <Link className="nav-link text-white" to="/InicioVentas">
             📊 Inicio de ventas
             </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/Historialventas">
                💰 Ventas
              </Link>
            </li>


            {/* Cliente */}
            <li className="nav-item mx-2">
             <Link className="nav-link text-white" to="/Cliente">
             🙍‍♂️ cliente
             </Link>
            </li>

          </ul>
        </div>

      </div>
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
    </nav>
  );
}

export default NavVentas;