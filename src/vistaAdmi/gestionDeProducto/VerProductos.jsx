// Inventario del admin

import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de la API Laravel
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

  // ==========================================================
  // CARGAR PRODUCTOS DESDE LARAVEL
  // ==========================================================
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError("");

        // Obtener el JWT guardado al iniciar sesión
        const token = localStorage.getItem("mjbe_token");

        if (!token) {
          throw new Error(
            "No se encontró el token de sesión. Inicie sesión nuevamente."
          );
        }

        // GET http://127.0.0.1:8000/api/productos
        const response = await fetch(`${API_URL}/productos`, {
          method: "GET",
          headers: {
            // Enviar el JWT para autenticar la petición
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.mensaje || "No se pudo cargar el inventario"
          );
        }

        setProductos(data);
        setProductosFiltrados(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(
          err.message || "No se pudo cargar el inventario desde la API."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // ==========================================================
  // FILTRAR Y ORDENAR PRODUCTOS
  // ==========================================================
  useEffect(() => {
    const filtrados = productos.filter((p) => {
      const valor = p[filtroPor];

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

    const productosOrdenados =
      filtroPor === "cant_producto"
        ? [...filtrados].sort((a, b) => {
            const cantidadA = Number(a.cant_producto) || 0;
            const cantidadB = Number(b.cant_producto) || 0;

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

  // ==========================================================
  // ABRIR MODAL
  // ==========================================================
  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
    setError("");
  };

  // ==========================================================
  // CERRAR MODAL
  // ==========================================================
  const cerrarModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  // ==========================================================
  // DESACTIVAR PRODUCTO
  // ==========================================================
  const desactivarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      setError("");

      // Obtener el JWT guardado al iniciar sesión
      const token = localStorage.getItem("mjbe_token");

      if (!token) {
        throw new Error(
          "No se encontró el token de sesión. Inicie sesión nuevamente."
        );
      }

      // El controlador Laravel requiere todos los campos
      // para actualizar el producto.
      // Por eso enviamos el producto completo cambiando
      // únicamente el estado a "inactivo".
      const response = await fetch(
        `${API_URL}/productos/${productoSeleccionado.id}`,
        {
          method: "PUT",
          headers: {
            // Enviar el JWT para autenticar la actualización
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            img_producto: productoSeleccionado.img_producto,
            nombre_producto: productoSeleccionado.nombre_producto,
            descripcion: productoSeleccionado.descripcion,
            color_producto: productoSeleccionado.color_producto,
            marca_producto: productoSeleccionado.marca_producto,
            cant_producto: Number(
              productoSeleccionado.cant_producto
            ),
            modelo: productoSeleccionado.modelo,

            // IMPORTANTE:
            // La base de datos usa id_talla, no id_medida.
            id_talla: Number(
              productoSeleccionado.id_talla
            ),

            id_proveedor: Number(
              productoSeleccionado.id_proveedor
            ),
            id_local: Number(
              productoSeleccionado.id_local
            ),
            valor_unitario: Number(
              productoSeleccionado.valor_unitario
            ),
            estado: "inactivo",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Error de Laravel:", data);

        throw new Error(
          data.mensaje ||
            "No se pudo desactivar el producto"
        );
      }

      // Laravel devuelve:
      // {
      //   mensaje: "...",
      //   producto: {...}
      // }
      const actualizado = data.producto;

      setProductos((prev) =>
        prev.map((p) =>
          p.id === actualizado.id ? actualizado : p
        )
      );

      cerrarModal();
    } catch (err) {
      console.error("Error al desactivar:", err);
      setError(
        err.message || "No se pudo desactivar el producto."
      );
    }
  };

  // ==========================================================
  // ELIMINAR PRODUCTO
  // ==========================================================
  const eliminarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      setError("");

      // Obtener el JWT guardado al iniciar sesión
      const token = localStorage.getItem("mjbe_token");

      if (!token) {
        throw new Error(
          "No se encontró el token de sesión. Inicie sesión nuevamente."
        );
      }

      // DELETE http://127.0.0.1:8000/api/productos/{id}
      const response = await fetch(
        `${API_URL}/productos/${productoSeleccionado.id}`,
        {
          method: "DELETE",
          headers: {
            // Enviar el JWT para autenticar la eliminación
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Error de Laravel:", data);

        throw new Error(
          data.mensaje ||
            "No se pudo eliminar el producto"
        );
      }

      // Quitamos el producto eliminado de la lista.
      setProductos((prev) =>
        prev.filter(
          (p) => p.id !== productoSeleccionado.id
        )
      );

      cerrarModal();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError(
        err.message || "No se pudo eliminar el producto."
      );
    }
  };

  return (
    <>
      <div className="app print-area">

        <NavAdmi />

        <div className="contenido">

          <div className="maincontainer-fluid py-4">

            <div className="container mt-4">

              <div className="card shadow">

                {/* ==================================================
                    ENCABEZADO
                ================================================== */}
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

                      <button
                        className="btn btn-primary w-100"
                        onClick={() => {}}
                      >
                        Aplicar filtro
                      </button>

                    </Dropdown.Menu>

                  </Dropdown>

                </div>

                {/* ==================================================
                    CONTENIDO
                ================================================== */}
                <div className="card-body">

                  {/* MENSAJE DE ERROR */}
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

                          /* PRODUCTOS */
                          productosFiltrados.map((p) => (

                            <tr
                              key={p.id}
                              className="text-center"
                            >

                              <td>
                                {p.id}
                              </td>

                              <td>
                                {p.nombre_producto}
                              </td>

                              <td>
                                {p.modelo}
                              </td>

                              <td>
                                {p.marca_producto}
                              </td>

                              <td>
                                {p.color_producto}
                              </td>

                              <td>
                                {p.cant_producto}
                              </td>

                              <td>
                                {p.estado}
                              </td>

                              <td className="no-print">

                                <button
                                  className="btn btn-danger btn-sm me-2"
                                  onClick={() =>
                                    abrirModal(p)
                                  }
                                >
                                  Acción
                                </button>

                                <Link
                                  className="btn btn-warning btn-sm"
                                  to={`/ActualizarProducto/${p.id}`}
                                >
                                  Actualizar
                                </Link>

                              </td>

                            </tr>

                          ))

                        )}

                      </tbody>

                    </table>

                    {/* ==================================================
                        IMPRIMIR
                    ================================================== */}
                    <div className="btn no-print mx-auto d-block">

                      <button
                        className="btn btn-success text-white ms-2 col-2"
                        onClick={() => window.print()}
                      >
                        🖨️ Imprimir
                      </button>

                    </div>

                  </div>

                  {/* ==================================================
                      CREAR PRODUCTO
                  ================================================== */}
                  <div className="d-flex justify-content-end mt-3 no-print">

                    <Link
                      className="btn btn-success"
                      to="/CrearProducto"
                    >
                      ➕ Crear Producto
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <FooterAdmi />

        {/* ==========================================================
            MODAL DE GESTIÓN
        ========================================================== */}
        {showModal && productoSeleccionado && (

          <div
            className="modal show d-block"
            tabIndex="-1"
          >

            <div className="modal-dialog">

              <div className="modal-content">

                <div className="modal-header bg-danger text-white">

                  <h5 className="modal-title">
                    Gestión de producto
                  </h5>

                  <button
                    className="btn-close"
                    onClick={cerrarModal}
                  ></button>

                </div>

                <div className="modal-body">

                  <ul className="list-group">

                    <li className="list-group-item">
                      <b>ID:</b>{" "}
                      {productoSeleccionado.id}
                    </li>

                    <li className="list-group-item">
                      <b>Producto:</b>{" "}
                      {productoSeleccionado.nombre_producto}
                    </li>

                    <li className="list-group-item">
                      <b>Marca:</b>{" "}
                      {productoSeleccionado.marca_producto}
                    </li>

                    <li className="list-group-item">
                      <b>Estado:</b>{" "}
                      {productoSeleccionado.estado}
                    </li>

                  </ul>

                </div>

                <div className="modal-footer d-flex justify-content-between">

                  <button
                    className="btn btn-secondary"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>

                  <div>

                    <button
                      className="btn btn-warning me-2"
                      onClick={desactivarProducto}
                    >
                      Desactivar
                    </button>

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