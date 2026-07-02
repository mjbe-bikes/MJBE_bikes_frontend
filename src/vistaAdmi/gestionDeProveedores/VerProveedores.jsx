import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function VerProveedores() {

  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);

  const [filtroPor, setFiltroPor] = useState("nombre_proveedor");
  const [valorFiltro, setValorFiltro] = useState("");

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/proveedores")
      .then(res => res.json())
      .then(data => {
        setProveedores(data);
        setProveedoresFiltrados(data);
      })
      .catch(err => console.log(err));
  }, []);

  const aplicarFiltro = () => {
    const filtrados = proveedores.filter((p) => {
      const valor = p[filtroPor];
      if (!valor) return false;

      return valor
        .toString()
        .toLowerCase()
        .includes(valorFiltro.toLowerCase());
    });

    setProveedoresFiltrados(filtrados);
  };

  // ABRIR MODAL
  const abrirModal = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShowModal(true);
  };

  // DESACTIVAR (SOFT DELETE)
  const desactivarProveedor = () => {
    fetch(`http://localhost:3001/proveedores/${proveedorSeleccionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...proveedorSeleccionado,
        estado: "inactivo"
      })
    })
      .then(() => {
        const nuevos = proveedoresFiltrados.map(p =>
          p.id === proveedorSeleccionado.id
            ? { ...p, estado: "inactivo" }
            : p
        );

        setProveedoresFiltrados(nuevos);
        setProveedores(nuevos);

        setShowModal(false);
        setProveedorSeleccionado(null);
      })
      .catch(err => console.log(err));
  };

  // ELIMINAR REAL
  const eliminarProveedorFisico = () => {
    fetch(`http://localhost:3001/proveedores/${proveedorSeleccionado.id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");

        const nuevos = proveedoresFiltrados.filter(
          p => p.id !== proveedorSeleccionado.id
        );

        setProveedoresFiltrados(nuevos);
        setProveedores(nuevos);

        setShowModal(false);
        setProveedorSeleccionado(null);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <div className="app print-area">

        <NavAdmi />

        <div className="contenido">
          <div className="maincontainer-fluid py-4">
            <div className="container mt-12">
              <div className="card shadow">

                {/* HEADER */}
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                  <div>
                    <h4 className="mb-0">🚚 Proveedores</h4>
                    <small>Listado de proveedores registrados</small>
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
                        <option value="nombre_proveedor">Nombre</option>
                        <option value="numero_identidad">N° Identidad</option>
                        <option value="telefono">Teléfono</option>
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
                        className="btn btn-success w-100"
                        onClick={aplicarFiltro}
                      >
                        Aplicar filtro
                      </button>

                    </Dropdown.Menu>
                  </Dropdown>

                </div>

                {/* TABLA */}
                <div className="card-body">

                  <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                      <thead className="table-success text-center">
                        <tr>
                          <th>ID</th>
                          <th>Proveedor</th>
                          <th>Tipo Doc</th>
                          <th>N° Identidad</th>
                          <th>Dirección</th>
                          <th>Teléfono</th>
                          <th>Estado</th>
                          <th className="no-print">Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {proveedoresFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No hay proveedores disponibles
                            </td>
                          </tr>
                        ) : (
                          proveedoresFiltrados.map((p) => (
                            <tr key={p.id} className="text-center">
                              <td>{p.id}</td>
                              <td>{p.nombre_proveedor}</td>

                              {/* 🔥 FIX SIN ROMPER TU SISTEMA */}
                              <td>
                                {p.tipo_documento
                                  ? p.tipo_documento
                                  : p.tipo_documento_id}
                              </td>

                              <td>{p.numero_identidad}</td>
                              <td>{p.direccion}</td>
                              <td>{p.telefono}</td>
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
                                  to={`/ActualizarProveedores/${p.id}`}
                                >
                                  Actualizar
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>

                    {/* IMPRIMIR */}
                    <div className="btn no-print mx-auto d-block">
                      <button
                        className="btn bg-success text-white ms-2 col-2"
                        onClick={() => window.print()}
                      >
                        🖨️ Imprimir
                      </button>
                    </div>

                  </div>

                  {/* CREAR */}
                  <div className="d-flex justify-content-end mt-3 no-print">
                    <Link className="btn btn-success" to="/CrearProveedores">
                      <i className="bi bi-plus-circle me-2"></i>
                      Crear Proveedor
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterAdmi />

        {/* MODAL */}
        {showModal && proveedorSeleccionado && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Gestión de proveedor</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p>Selecciona una acción para este proveedor:</p>

                  <ul className="list-group">
                    <li className="list-group-item">
                      <b>ID:</b> {proveedorSeleccionado.id}
                    </li>
                    <li className="list-group-item">
                      <b>Nombre:</b> {proveedorSeleccionado.nombre_proveedor}
                    </li>
                    <li className="list-group-item">
                      <b>Documento:</b> {proveedorSeleccionado.numero_identidad}
                    </li>
                    <li className="list-group-item">
                      <b>Estado:</b> {proveedorSeleccionado.estado}
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
                      onClick={desactivarProveedor}
                    >
                      Desactivar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={eliminarProveedorFisico}
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

export default VerProveedores;