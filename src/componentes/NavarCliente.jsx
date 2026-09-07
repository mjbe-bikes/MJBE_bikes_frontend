import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Carrito } from "../vistaCliente/Carrito";

function NavarCliente() {
  const navigate = useNavigate();
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const { carrito, cantidadTotal, precioTotal, cambiarCantidad, quitarDelCarrito } = Carrito();
  const usuarioAutenticado = localStorage.getItem("mjbe_auth") === "true";
  const userName = localStorage.getItem("mjbe_user_login") || "Cliente";

  const handleLogout = () => {
    localStorage.removeItem("mjbe_auth");
    localStorage.removeItem("mjbe_user_id");
    localStorage.removeItem("mjbe_user_login");
    localStorage.removeItem("mjbe_user_email");
    localStorage.removeItem("mjbe_rol_id");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 no-print">
      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand fw-bold fs-3"
          to="/"
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
                to="/"
              >
                Inicio
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/productos">
                Productos
              </Link>
            </li>

            {usuarioAutenticado && Number(localStorage.getItem("mjbe_rol_id")) === 4 && (
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/mis-compras">
                  Mis compras
                </Link>
              </li>
            )}

          </ul>

          {/* Acciones */}
          <div className="d-flex align-items-center gap-2">

            {/* Carrito */}
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-outline-light"
                title="Carrito"
                aria-expanded={carritoAbierto}
                onClick={() => setCarritoAbierto((abierto) => !abierto)}
              >
                🛒 <span className="badge bg-light text-dark">{cantidadTotal}</span>
              </button>

              {carritoAbierto && (
                <div className="dropdown-menu dropdown-menu-end show p-3 shadow" style={{ minWidth: "320px" }}>
                  <h6 className="border-bottom pb-2">Tu carrito</h6>

                  {carrito.length === 0 ? (
                    <p className="text-muted mb-0">No tienes productos agregados.</p>
                  ) : (
                    <>
                      {carrito.map((producto) => (
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-3" key={producto.id}>
                          <div className="flex-grow-1">
                            <strong className="d-block">{producto.nombre_producto}</strong>
                            <small className="text-muted">
                              ${Number(producto.valor_unitario).toLocaleString("es-CO")}
                            </small>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => cambiarCantidad(producto.id, producto.cantidad - 1)}
                            >
                              -
                            </button>
                            <span>{producto.cantidad}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => cambiarCantidad(producto.id, producto.cantidad + 1)}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger"
                              onClick={() => quitarDelCarrito(producto.id)}
                              aria-label={`Quitar ${producto.nombre_producto}`}
                            >
                              x
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-top pt-2 d-flex justify-content-between fw-bold">
                        <span>Total</span>
                        <span>${precioTotal.toLocaleString("es-CO")}</span>
                      </div>
                      <Link to="/checkout" className="btn btn-dark w-100 mt-3" onClick={() => setCarritoAbierto(false)}>
                        Finalizar compra
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {usuarioAutenticado ? (
              <div className="d-flex align-items-center text-white gap-2">
                <span>Hola, {userName}</span>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-dark">
                Iniciar sesión
              </Link>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default NavarCliente;