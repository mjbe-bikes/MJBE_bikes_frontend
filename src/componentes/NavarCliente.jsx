import { Link } from "react-router-dom";

function NavarCliente() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 no-print">
      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand fw-bold fs-3"
          to="/Inicio"
        >
          🚲 MJBE Bikes
        </Link>

        {/* Botón responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCliente"
          aria-controls="navbarCliente"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div
          className="collapse navbar-collapse"
          id="navbarCliente"
        >

          {/* Opciones principales */}
          <ul className="navbar-nav mx-auto">

            <li className="nav-item mx-2">
              <Link
                className="nav-link"
                to="/Inicio"
              >
                Inicio
              </Link>
            </li>

            <li className="nav-item mx-2">
              <a
                className="nav-link"
                href="#bicicletas"
              >
                Bicicletas
              </a>
            </li>

            <li className="nav-item mx-2">
              <a
                className="nav-link"
                href="#categorias"
              >
                Categorías
              </a>
            </li>

            <li className="nav-item mx-2">
              <a
                className="nav-link"
                href="#ofertas"
              >
                Ofertas
              </a>
            </li>

          </ul>

          {/* Acciones */}
          <div className="d-flex align-items-center gap-2">

            {/* Carrito */}
            <Link
              to="/carrito"
              className="btn btn-outline-dark"
              title="Carrito"
            >
              🛒
            </Link>

            {/* Inicio de sesión */}
            <Link
              to="/login"
              className="btn btn-dark"
            >
              Iniciar sesión
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default NavarCliente;