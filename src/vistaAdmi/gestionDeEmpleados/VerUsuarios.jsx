// Listado de usuarios (admin)

import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function VerUsuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  const [filtroPor, setFiltroPor] = useState("login");
  const [valorFiltro, setValorFiltro] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Roles
  const roleLabels = {
    1: "Administrador",
    2: "Empleado",
    3: "Bodeguero",
    4: "Cliente"
  };

  // Obtener nombre del rol
  const getRoleName = (usuario) => {
    if (usuario.tipo_rol) return usuario.tipo_rol;
    if (usuario.rol) return usuario.rol;

    if (usuario.rol_id != null) {
      return (
        roleLabels[Number(usuario.rol_id)] ||
        `Rol ${usuario.rol_id}`
      );
    }

    return "Desconocido";
  };

  // Obtener valor del campo seleccionado para el filtro
  const getFieldValue = (usuario, field) => {
    if (field === "tipo_rol") {
      return getRoleName(usuario);
    }

    return usuario[field];
  };

  // =========================================================
  // CARGAR USUARIOS DESDE LARAVEL
  // =========================================================

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch(`${API_URL}/usuarios`, {
          headers: {
            "Accept": "application/json"
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.mensaje ||
            data?.message ||
            "Error al cargar usuarios"
          );
        }

        setUsuarios(data);
        setUsuariosFiltrados(data);

      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

  // =========================================================
  // FILTRAR USUARIOS
  // =========================================================

  const aplicarFiltro = () => {
    const filtrados = usuarios.filter((u) => {

      const valor = getFieldValue(u, filtroPor);

      if (!valor) return false;

      return valor
        .toString()
        .toLowerCase()
        .includes(valorFiltro.toLowerCase());
    });

    setUsuariosFiltrados(filtrados);
  };

  // =========================================================
  // ABRIR MODAL
  // =========================================================

  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  // =========================================================
  // DESACTIVAR USUARIO
  // =========================================================

  const desactivarUsuario = async () => {

    try {
      const response = await fetch(
        `${API_URL}/usuarios/${usuarioSeleccionado.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          body: JSON.stringify({
            login: usuarioSeleccionado.login,
            email: usuarioSeleccionado.email,
            rol_id: usuarioSeleccionado.rol_id,
            estado: "inactivo"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.mensaje ||
          data?.message ||
          "Error al desactivar usuario"
        );
      }

      // Actualizar la lista localmente
      const nuevos = usuarios.map((u) =>
        u.id === usuarioSeleccionado.id
          ? { ...u, estado: "inactivo" }
          : u
      );

      setUsuarios(nuevos);

      // Mantener el filtro actual
      const filtrados = nuevos.filter((u) => {

        const valor = getFieldValue(u, filtroPor);

        if (!valor) return false;

        return valor
          .toString()
          .toLowerCase()
          .includes(valorFiltro.toLowerCase());
      });

      setUsuariosFiltrados(filtrados);

      setShowModal(false);
      setUsuarioSeleccionado(null);

    } catch (error) {
      console.error("Error desactivando usuario:", error);
      alert(error.message);
    }
  };

  // =========================================================
  // ELIMINAR USUARIO FÍSICAMENTE
  // =========================================================

  const eliminarUsuarioFisico = async () => {

    try {
      const response = await fetch(
        `${API_URL}/usuarios/${usuarioSeleccionado.id}`,
        {
          method: "DELETE",

          headers: {
            "Accept": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.mensaje ||
          data?.message ||
          "Error al eliminar usuario"
        );
      }

      // Eliminar usuario de la lista
      const nuevos = usuarios.filter(
        (u) => u.id !== usuarioSeleccionado.id
      );

      setUsuarios(nuevos);

      // Mantener el filtro actual
      const filtrados = nuevos.filter((u) => {

        const valor = getFieldValue(u, filtroPor);

        if (!valor) return false;

        return valor
          .toString()
          .toLowerCase()
          .includes(valorFiltro.toLowerCase());
      });

      setUsuariosFiltrados(filtrados);

      setShowModal(false);
      setUsuarioSeleccionado(null);

    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert(error.message);
    }
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
                    <small>
                      Listado de usuarios registrados
                    </small>
                  </div>

                  {/* FILTRO */}
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
                        <option value="login">
                          Usuario
                        </option>

                        <option value="email">
                          Email
                        </option>

                        <option value="estado">
                          Estado
                        </option>

                        <option value="tipo_rol">
                          Rol
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
                          <th className="no-print">
                            Acciones
                          </th>
                        </tr>

                      </thead>

                      <tbody>

                        {usuariosFiltrados.length === 0 ? (

                          <tr>
                            <td
                              colSpan="6"
                              className="text-center"
                            >
                              No hay usuarios disponibles
                            </td>
                          </tr>

                        ) : (

                          usuariosFiltrados.map((u) => (

                            <tr
                              key={u.id}
                              className="text-center"
                            >

                              <td>{u.id}</td>

                              <td>{u.login}</td>

                              <td>{u.email}</td>

                              <td>{getRoleName(u)}</td>

                              <td>{u.estado}</td>

                              <td className="no-print">

                                <button
                                  className="btn btn-danger btn-sm me-2 no-print"
                                  onClick={() =>
                                    abrirModalEliminar(u)
                                  }
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

                  {/* CREAR EMPLEADO */}
                  <div className="d-flex justify-content-end mt-3">

                    <Link
                      className="btn btn-success"
                      to="/CrearEmpleado"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Crear Empleado
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <FooterAdmi />

        {/* =====================================================
            MODAL DE GESTIÓN
        ====================================================== */}

        {showModal && usuarioSeleccionado && (

          <div className="modal show d-block" tabIndex="-1">

            <div className="modal-dialog">

              <div className="modal-content">

                <div className="modal-header bg-danger text-white">

                  <h5 className="modal-title">
                    Gestión de usuario
                  </h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>

                </div>

                <div className="modal-body">

                  <p>
                    Selecciona una acción para este usuario:
                  </p>

                  <ul className="list-group">

                    <li className="list-group-item">
                      <b>ID:</b>{" "}
                      {usuarioSeleccionado.id}
                    </li>

                    <li className="list-group-item">
                      <b>Usuario:</b>{" "}
                      {usuarioSeleccionado.login}
                    </li>

                    <li className="list-group-item">
                      <b>Email:</b>{" "}
                      {usuarioSeleccionado.email}
                    </li>

                    <li className="list-group-item">
                      <b>Estado:</b>{" "}
                      {usuarioSeleccionado.estado}
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