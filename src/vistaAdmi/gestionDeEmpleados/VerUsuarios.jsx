import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function VerUsuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  const [filtroPor, setFiltroPor] = useState("login");
  const [valorFiltro, setValorFiltro] = useState("");

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setUsuariosFiltrados(data);
      })
      .catch(err => console.log(err));
  }, []);

  const aplicarFiltro = () => {
    const filtrados = usuarios.filter((u) => {
      const valor = u[filtroPor];
      if (!valor) return false;

      return valor
        .toString()
        .toLowerCase()
        .includes(valorFiltro.toLowerCase());
    });

    setUsuariosFiltrados(filtrados);
  };

  // ABRIR MODAL
  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  // DESACTIVAR (SOFT DELETE)
  const desactivarUsuario = () => {
    fetch(`http://localhost:3001/usuarios/${usuarioSeleccionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...usuarioSeleccionado,
        estado: "invalido"
      })
    })
      .then(() => {
        const nuevos = usuariosFiltrados.map(u =>
          u.id === usuarioSeleccionado.id
            ? { ...u, estado: "invalido" }
            : u
        );

        setUsuariosFiltrados(nuevos);
        setUsuarios(nuevos);

        setShowModal(false);
        setUsuarioSeleccionado(null);
      })
      .catch(err => console.log(err));
  };

  // ELIMINAR REAL
  const eliminarUsuarioFisico = () => {
    fetch(`http://localhost:3001/usuarios/${usuarioSeleccionado.id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");

        const nuevos = usuariosFiltrados.filter(
          u => u.id !== usuarioSeleccionado.id
        );

        setUsuariosFiltrados(nuevos);
        setUsuarios(nuevos);

        setShowModal(false);
        setUsuarioSeleccionado(null);
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
                    <h4 className="mb-0">👥 Usuarios</h4>
                    <small>Listado de usuarios registrados</small>
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
                        <option value="login">Usuario</option>
                        <option value="email">Email</option>
                        <option value="estado">Estado</option>
                        <option value="tipo_rol">Rol</option>
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
                          <th>Usuario</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th className="no-print">Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {usuariosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No hay usuarios disponibles
                            </td>
                          </tr>
                        ) : (
                          usuariosFiltrados.map((u) => (
                            <tr key={u.id} className="text-center">
                              <td>{u.id}</td>
                              <td>{u.login}</td>
                              <td>{u.email}</td>
                              <td>{u.tipo_rol}</td>
                              <td>{u.estado}</td>

                              <td className="no-print">
                                <button
                                  className="btn btn-danger btn-sm me-2 no-print"
                                  onClick={() => abrirModalEliminar(u)}
                                >
                                  Acción
                                </button>

                                <Link
                                  className="btn btn-warning btn-sm no-print"
                                  to={`/ActualizarEmpleados/${u.id}`}
                                >
                                  Actualizar
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>

                  {/* BOTÓN IMPRIMIR */}
                  <div className="btn no-print mx-auto d-block">
                    <button
                      className="btn bg-success text-white ms-2 col-2"
                      onClick={() => window.print()}
                    >
                      <i className="bi bi-printer-fill me-2"></i>
                      Imprimir
                    </button>
                  </div>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <Link className="btn btn-success" to="/CrearEmpleado">
                      <i className="bi bi-plus-circle me-2"></i>
                      Crear Empleado
                    </Link > 
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterAdmi />

        {/* MODAL */}
        {showModal && usuarioSeleccionado && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Gestión de usuario</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p>Selecciona una acción para este usuario:</p>

                  <ul className="list-group">
                    <li className="list-group-item">
                      <b>ID:</b> {usuarioSeleccionado.id}
                    </li>
                    <li className="list-group-item">
                      <b>Usuario:</b> {usuarioSeleccionado.login}
                    </li>
                    <li className="list-group-item">
                      <b>Email:</b> {usuarioSeleccionado.email}
                    </li>
                    <li className="list-group-item">
                      <b>Estado:</b> {usuarioSeleccionado.estado}
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
                      onClick={desactivarUsuario}
                    >
                      Desactivar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={eliminarUsuarioFisico}
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

export default VerUsuarios;