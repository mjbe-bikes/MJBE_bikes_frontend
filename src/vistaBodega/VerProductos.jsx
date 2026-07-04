import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

const API_URL = "http://localhost:3001/productos";

function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtroPor, setFiltroPor] = useState("nombre_producto");
  const [valorFiltro, setValorFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("No se pudo cargar el inventario");

        const data = await response.json();
        setProductos(data);
        setProductosFiltrados(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inventario desde la API.");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    const filtrados = productos.filter((p) => {
      const valor = p[filtroPor];
      if (valor === undefined || valor === null || valor === "") return false;
      return String(valor).toLowerCase().includes(valorFiltro.toLowerCase());
    });

    setProductosFiltrados(filtrados);
  }, [productos, filtroPor, valorFiltro]);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const desactivarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      const response = await fetch(`${API_URL}/${productoSeleccionado.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: "inactivo" })
      });

      if (!response.ok) throw new Error("No se pudo desactivar el producto");

      const actualizado = await response.json();
      setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      setShowModal(false);
      setProductoSeleccionado(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo desactivar el producto.");
    }
  };

  const eliminarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      const response = await fetch(`${API_URL}/${productoSeleccionado.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("No se pudo eliminar el producto");

      setProductos((prev) => prev.filter((p) => p.id !== productoSeleccionado.id));
      setShowModal(false);
      setProductoSeleccionado(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto.");
    }
  };

  return (
    <>
      <div className="app print-area">
        <NavBodega />

        <div className="contenido">
          <div className="maincontainer-fluid py-4">
            <div className="container mt-4">
              <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">🛒 Productos</h4>
                    <small>Listado de productos desde la API</small>
                  </div>

                  <Dropdown className="no-print">
                    <Dropdown.Toggle variant="light">Filtrar</Dropdown.Toggle>

                    <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>
                      <label className="form-label">Filtrar por</label>

                      <select
                        className="form-select mb-3"
                        value={filtroPor}
                        onChange={(e) => setFiltroPor(e.target.value)}
                      >
                        <option value="nombre_producto">Producto</option>
                        <option value="modelo">Modelo</option>
                        <option value="marca_producto">Marca</option>
                        <option value="color_producto">Color</option>
                        <option value="estado">Estado</option>
                      </select>

                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Ingrese el valor"
                        value={valorFiltro}
                        onChange={(e) => setValorFiltro(e.target.value)}
                      />

                      <button className="btn btn-primary w-100" onClick={() => {}}>
                        Aplicar filtro
                      </button>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger py-2" role="alert">
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
                          <th>Estado</th>
                          <th className="no-print">Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Cargando productos...
                            </td>
                          </tr>
                        ) : productosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No hay productos disponibles
                            </td>
                          </tr>
                        ) : (
                          productosFiltrados.map((p) => (
                            <tr key={p.id} className="text-center">
                              <td>{p.id}</td>
                              <td>{p.nombre_producto}</td>
                              <td>{p.modelo}</td>
                              <td>{p.marca_producto}</td>
                              <td>{p.color_producto}</td>
                              <td>{p.estado}</td>

                              <td className="no-print">
                                <button className="btn btn-danger btn-sm me-2" onClick={() => abrirModal(p)}>
                                  Acción
                                </button>

                                <Link className="btn btn-warning btn-sm" to={`/ActualizarProducto/${p.id}`}>
                                  Actualizar
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <div className="btn no-print mx-auto d-block">
                      <button className="btn btn-success text-white ms-2 col-2" onClick={() => window.print()}>
                        🖨️ Imprimir
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-3 no-print">
                    <Link className="btn btn-success" to="/CrearProducto">
                      ➕ Crear Producto
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterBodega />

        {showModal && productoSeleccionado && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Gestión de producto</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <b>ID:</b> {productoSeleccionado.id}
                    </li>
                    <li className="list-group-item">
                      <b>Producto:</b> {productoSeleccionado.nombre_producto}
                    </li>
                    <li className="list-group-item">
                      <b>Marca:</b> {productoSeleccionado.marca_producto}
                    </li>
                    <li className="list-group-item">
                      <b>Estado:</b> {productoSeleccionado.estado}
                    </li>
                  </ul>
                </div>

                <div className="modal-footer d-flex justify-content-between">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>

                  <div>
                    <button className="btn btn-warning me-2" onClick={desactivarProducto}>
                      Desactivar
                    </button>

                    <button className="btn btn-danger" onClick={eliminarProducto}>
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