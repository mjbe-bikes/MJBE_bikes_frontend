// Inventario de bodega

import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

// API Laravel/PHP conectada a MySQL
const API_URL = "http://127.0.0.1:8000/api";

function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [filtroPor, setFiltroPor] = useState("nombre_producto");
  const [valorFiltro, setValorFiltro] = useState("");
  const [ordenCantidad, setOrdenCantidad] = useState("desc");

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // CARGAR PRODUCTOS DESDE LARAVEL
  // ============================================================
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError("");

        // Obtener el token JWT guardado al iniciar sesión
        const token = localStorage.getItem("mjbe_token");

        // Verificar que exista una sesión válida
        if (!token) {
          throw new Error(
            "No se encontró el token de sesión. Inicie sesión nuevamente."
          );
        }

        const response = await fetch(`${API_URL}/productos`, {
          headers: {
            // JWT necesario para acceder a la ruta protegida
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el inventario");
        }

        const data = await response.json();

        setProductos(data);
        setProductosFiltrados(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);

        setError(
          err.message ||
          "No se pudo cargar el inventario desde la API."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // ============================================================
  // FILTRAR Y ORDENAR PRODUCTOS
  // ============================================================
  useEffect(() => {
    const filtrados = productos.filter((producto) => {
      const valor = producto[filtroPor];

      if (
        valor === undefined ||
        valor === null ||
        valor === ""
      ) {
        return false;
      }

      return String(valor)
        .toLowerCase()
        .includes(valorFiltro.toLowerCase());
    });

    // Cuando se filtra por cantidad, también se ordena
    const productosOrdenados =
      filtroPor === "cant_producto"
        ? [...filtrados].sort((a, b) => {
            const cantidadA =
              Number(a.cant_producto) || 0;

            const cantidadB =
              Number(b.cant_producto) || 0;

            return ordenCantidad === "asc"
              ? cantidadA - cantidadB
              : cantidadB - cantidadA;
          })
        : filtrados;

    setProductosFiltrados(productosOrdenados);
  }, [
    productos,
    filtroPor,
    valorFiltro,
    ordenCantidad,
  ]);

  // ============================================================
  // ABRIR MODAL
  // ============================================================
  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
    setError("");
  };

  // ============================================================
  // DESACTIVAR PRODUCTO
  // ============================================================
  const desactivarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      setError("");

      // Obtener el token JWT guardado al iniciar sesión
      const token = localStorage.getItem("mjbe_token");

      // Verificar que exista una sesión válida
      if (!token) {
        throw new Error(
          "No se encontró el token de sesión. Inicie sesión nuevamente."
        );
      }

      // Laravel utiliza PUT para actualizar productos
      const response = await fetch(
        `${API_URL}/productos/${productoSeleccionado.id}`,
        {
          method: "PUT",

          headers: {
            // JWT necesario para acceder a la ruta protegida
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",

            Accept: "application/json",
          },

          body: JSON.stringify({
            estado: "inactivo",
          }),
        }
      );

      const datos = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Error de Laravel:", datos);

        throw new Error(
          "No se pudo desactivar el producto"
        );
      }

      // Actualizar el producto en el estado local
      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === datos.id
            ? datos
            : producto
        )
      );

      // Cerrar modal
      setShowModal(false);
      setProductoSeleccionado(null);
    } catch (err) {
      console.error(
        "Error al desactivar producto:",
        err
      );

      setError(
        err.message ||
        "No se pudo desactivar el producto."
      );
    }
  };

  // ============================================================
  // ELIMINAR PRODUCTO
  // ============================================================
  const eliminarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      setError("");

      // Obtener el token JWT guardado al iniciar sesión
      const token = localStorage.getItem("mjbe_token");

      // Verificar que exista una sesión válida
      if (!token) {
        throw new Error(
          "No se encontró el token de sesión. Inicie sesión nuevamente."
        );
      }

      const response = await fetch(
        `${API_URL}/productos/${productoSeleccionado.id}`,
        {
          method: "DELETE",

          headers: {
            // JWT necesario para acceder a la ruta protegida
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const datos = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Error de Laravel:", datos);

        throw new Error(
          "No se pudo eliminar el producto"
        );
      }

      // Eliminar el producto del estado local
      setProductos((prev) =>
        prev.filter(
          (producto) =>
            producto.id !== productoSeleccionado.id
        )
      );

      // Cerrar modal
      setShowModal(false);
      setProductoSeleccionado(null);
    } catch (err) {
      console.error(
        "Error al eliminar producto:",
        err
      );

      setError(
        err.message ||
        "No se pudo eliminar el producto."
      );
    }
  };

  // ============================================================
  // INTERFAZ
  // ============================================================
  return (
    <>
      <div className="app print-area">
        <NavBodega />

        <div className="contenido">
          <div className="maincontainer-fluid py-4">
            <div className="container mt-4">
              <div className="card shadow">

                {/* ENCABEZADO */}
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

                  <div>
                    <h4 className="mb-0">
                      🛒 Productos
                    </h4>
                  </div>

                  {/* FILTROS */}
                  <Dropdown className="no-print">
                    <Dropdown.Toggle variant="light">
                      Filtrar
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      className="p-3"
                      style={{ minWidth: "250px" }}
                    >
                      <label className="form-label">
                        Filtrar por
                      </label>

                      <select
                        className="form-select mb-3"
                        value={filtroPor}
                        onChange={(e) =>
                          setFiltroPor(e.target.value)
                        }
                      >
                        <option value="nombre_producto">
                          Producto
                        </option>

                        <option value="modelo">
                          Modelo
                        </option>

                        <option value="marca_producto">
                          Marca
                        </option>

                        <option value="color_producto">
                          Color
                        </option>

                        <option value="cant_producto">
                          Cantidad
                        </option>

                        <option value="estado">
                          Estado
                        </option>
                      </select>

                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Ingrese el valor"
                        value={valorFiltro}
                        onChange={(e) =>
                          setValorFiltro(e.target.value)
                        }
                      />

                      <label className="form-label">
                        Orden por cantidad
                      </label>

                      <select
                        className="form-select mb-3"
                        value={ordenCantidad}
                        onChange={(e) =>
                          setOrdenCantidad(e.target.value)
                        }
                      >
                        <option value="desc">
                          Mayor a menor
                        </option>

                        <option value="asc">
                          Menor a mayor
                        </option>
                      </select>

                      {/* Los filtros se aplican automáticamente */}
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => {}}
                      >
                        Aplicar filtro
                      </button>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                {/* TABLA */}
                <div className="card-body">

                  {error && (
                    <div
                      className="alert alert-danger py-2"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">

                      <thead className="table-primary text-center">
                        <tr>
                          <th>ID</th>
                          <th>Producto</th>
                          <th>Modelo</th>
                          <th>Marca</th>
                          <th>Color</th>
                          <th>Cantidad</th>
                          <th>Estado</th>
                          <th className="no-print">
                            Acciones
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {/* CARGANDO */}
                        {loading ? (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center"
                            >
                              Cargando productos...
                            </td>
                          </tr>

                        ) : productosFiltrados.length === 0 ? (

                          /* SIN PRODUCTOS */
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center"
                            >
                              No hay productos disponibles
                            </td>
                          </tr>

                        ) : (

                          /* LISTA DE PRODUCTOS */
                          productosFiltrados.map(
                            (producto) => (
                              <tr
                                key={producto.id}
                                className="text-center"
                              >
                                <td>
                                  {producto.id}
                                </td>

                                <td>
                                  {
                                    producto.nombre_producto
                                  }
                                </td>

                                <td>
                                  {producto.modelo}
                                </td>

                                <td>
                                  {
                                    producto.marca_producto
                                  }
                                </td>

                                <td>
                                  {
                                    producto.color_producto
                                  }
                                </td>

                                <td>
                                  {
                                    producto.cant_producto
                                  }
                                </td>

                                <td>
                                  {producto.estado}
                                </td>

                                <td className="no-print">

                                  {/* ABRIR MODAL */}
                                  <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() =>
                                      abrirModal(
                                        producto
                                      )
                                    }
                                  >
                                    Acción
                                  </button>

                                  {/* ACTUALIZAR */}
                                  <Link
                                    className="btn btn-warning btn-sm"
                                    to={`/ActualizarProducto/${producto.id}`}
                                  >
                                    Actualizar
                                  </Link>

                                </td>
                              </tr>
                            )
                          )
                        )}

                      </tbody>
                    </table>

                    {/* IMPRIMIR */}
                    <div className="btn no-print mx-auto d-block">
                      <button
                        className="btn btn-success text-white ms-2 col-2"
                        onClick={() => window.print()}
                      >
                        🖨️ Imprimir
                      </button>
                    </div>
                  </div>

                  {/* CREAR PRODUCTO 
                  <div className="d-flex justify-content-end mt-3 no-print">
                    <Link
                      className="btn btn-success"
                      to="/CrearProducto"
                    >
                      ➕ Crear Producto
                    </Link>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterBodega />

        {/* MODAL DE GESTIÓN */}
        {showModal && productoSeleccionado && (
          <div
            className="modal show d-block"
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">

                {/* ENCABEZADO DEL MODAL */}
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    Gestión de producto
                  </h5>

                  <button
                    className="btn-close"
                    onClick={() =>
                      setShowModal(false)
                    }
                  ></button>
                </div>

                {/* INFORMACIÓN DEL PRODUCTO */}
                <div className="modal-body">
                  <ul className="list-group">

                    <li className="list-group-item">
                      <b>ID:</b>{" "}
                      {productoSeleccionado.id}
                    </li>

                    <li className="list-group-item">
                      <b>Producto:</b>{" "}
                      {
                        productoSeleccionado.nombre_producto
                      }
                    </li>

                    <li className="list-group-item">
                      <b>Marca:</b>{" "}
                      {
                        productoSeleccionado.marca_producto
                      }
                    </li>

                    <li className="list-group-item">
                      <b>Estado:</b>{" "}
                      {
                        productoSeleccionado.estado
                      }
                    </li>

                  </ul>
                </div>

                {/* BOTONES */}
                <div className="modal-footer d-flex justify-content-between">

                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancelar
                  </button>

                  <div>

                    {/* DESACTIVAR */}
                    <button
                      className="btn btn-warning me-2"
                      onClick={desactivarProducto}
                    >
                      Desactivar
                    </button>

                    {/* ELIMINAR */}
                    <button
                      className="btn btn-danger"
                      onClick={eliminarProducto}
                    >
                      Eliminar
                    </button>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VerProductos;