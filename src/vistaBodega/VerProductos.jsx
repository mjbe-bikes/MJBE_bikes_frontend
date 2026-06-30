import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

function VerProductos() {

  const datosIniciales = [
     {
      id: 1,
      img_producto: "",
      nombre_producto: "Cadena MTB",
      descripcion: "Cadena resistente",
      color_producto: "Negro",
      marca_producto: "Shimano",
      cant_producto: 10,
      modelo: "XTR-2024",
      id_medida: 1,
      id_proveedor: 1,
      id_local: 1,
      valor_unitario: 50000,
      estado: "activo"
    },
    {
      id: 2,
      img_producto: "",
      nombre_producto: "Freno hidráulico",
      descripcion: "Freno de disco",
      color_producto: "Plata",
      marca_producto: "Shimano",
      cant_producto: 5,
      modelo: "MT200",
      id_medida: 1,
      id_proveedor: 2,
      id_local: 1,
      valor_unitario: 120000,
      estado: "activo"
    }
  ];


  const [productos, setProductos] = useState(datosIniciales);
  const [productosFiltrados, setProductosFiltrados] = useState(datosIniciales);

  const [filtroPor, setFiltroPor] = useState("producto");
  const [valorFiltro, setValorFiltro] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // FILTRAR
  const aplicarFiltro = () => {
    const filtrados = productos.filter((p) => {
      const valor = p[filtroPor];

      if (!valor) return false;

      return valor
        .toString()
        .toLowerCase()
        .includes(valorFiltro.toLowerCase());
    });

    setProductosFiltrados(filtrados);
  };

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const desactivarProducto = () => {
    const nuevos = productosFiltrados.map(p =>
      p.id === productoSeleccionado.id
        ? { ...p, estado: "inactivo" }
        : p
    );

    setProductosFiltrados(nuevos);
    setProductos(nuevos);

    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const eliminarProducto = () => {
    const nuevos = productosFiltrados.filter(
      p => p.id !== productoSeleccionado.id
    );

    setProductosFiltrados(nuevos);
    setProductos(nuevos);

    setShowModal(false);
    setProductoSeleccionado(null);
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
                    <small>Listado de productos de prueba</small>
                  </div>

                  <Dropdown className="no-print">
                    <Dropdown.Toggle variant="light">
                      Filtrar
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>

                      <label className="form-label">Filtrar por</label>

                      <select
                        className="form-select mb-3"
                        value={filtroPor}
                        onChange={(e) => setFiltroPor(e.target.value)}
                      >
                        <option value="producto">Producto</option>
                        <option value="modelo">Modelo</option>
                        <option value="marca">Marca</option>
                        <option value="color">Color</option>
                        <option value="estado">Estado</option>
                      </select>

                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Ingrese el valor"
                        value={valorFiltro}
                        onChange={(e) => setValorFiltro(e.target.value)}
                      />

                      <button
                        className="btn btn-primary w-100"
                        onClick={aplicarFiltro}
                      >
                        Aplicar filtro
                      </button>

                    </Dropdown.Menu>
                  </Dropdown>

                </div>

                <div className="card-body">

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
                        {productosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No hay productos disponibles
                            </td>
                          </tr>
                        ) : (
                          productosFiltrados.map((p) => (
                            <tr key={p.id} className="text-center">
                              <td>{p.id}</td>
                              <td>{p.producto}</td>
                              <td>{p.modelo}</td>
                              <td>{p.marca}</td>
                              <td>{p.color}</td>
                              <td>{p.estado}</td>

                              <td className="no-print">
                                <button
                                  className="btn btn-danger btn-sm me-2"
                                  onClick={() => abrirModal(p)}
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

                    <div className="btn no-print mx-auto d-block">
                      <button
                        className="btn btn-success text-white ms-2 col-2"
                        onClick={() => window.print()}
                      >
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

        <FooterBodega/>

        {/* MODAL */}
        {showModal && productoSeleccionado && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Gestión de producto</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <b>ID:</b> {productoSeleccionado.id}
                    </li>
                    <li className="list-group-item">
                      <b>Producto:</b> {productoSeleccionado.producto}
                    </li>
                    <li className="list-group-item">
                      <b>Marca:</b> {productoSeleccionado.marca}
                    </li>
                    <li className="list-group-item">
                      <b>Estado:</b> {productoSeleccionado.estado}
                    </li>
                  </ul>
                </div>

                <div className="modal-footer d-flex justify-content-between">

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
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