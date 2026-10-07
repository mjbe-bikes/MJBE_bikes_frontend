// Listado de proveedores (admin)

import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de nuestra API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function VerProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);

  const [filtroPor, setFiltroPor] = useState("nombre_proveedor");
  const [valorFiltro, setValorFiltro] = useState("");

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  // =========================================================
  // CARGAR PROVEEDORES
  // =========================================================
  useEffect(() => {
const cargarProveedores = async () => {
  try {
    // Recuperamos el JWT guardado al iniciar sesión.
    const token = localStorage.getItem("mjbe_token");

    // Enviamos el token para que Laravel pueda autenticar la petición.
    const respuesta = await fetch(`${API_URL}/proveedores`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar los proveedores");
    }

    const datos = await respuesta.json();

    setProveedores(datos);
    setProveedoresFiltrados(datos);
  } catch (error) {
    console.error("Error cargando proveedores:", error);
  }
};

cargarProveedores();

  }, []);

  // =========================================================
  // FILTRAR PROVEEDORES
  // =========================================================
  const aplicarFiltro = () => {
    const filtrados = proveedores.filter((proveedor) => {
      const valor = proveedor[filtroPor];

      if (!valor) {
        return false;
      }

      return valor
        .toString()
        .toLowerCase()
        .includes(valorFiltro.toLowerCase());
    });

    setProveedoresFiltrados(filtrados);
  };

  // =========================================================
  // ABRIR MODAL
  // =========================================================
  const abrirModal = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShowModal(true);
  };

  // =========================================================
  // DESACTIVAR PROVEEDOR
  // =========================================================
  const desactivarProveedor = async () => {
    if (!proveedorSeleccionado) {
      return;
    }

    try {
      const respuesta = await fetch(
        `${API_URL}/proveedores/${proveedorSeleccionado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...proveedorSeleccionado,
            estado: "inactivo",
          }),
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo desactivar el proveedor");
      }

      // Actualizar ambas listas sin volver a consultar la API
      const nuevosProveedores = proveedores.map((proveedor) =>
        proveedor.id === proveedorSeleccionado.id
          ? { ...proveedor, estado: "inactivo" }
          : proveedor
      );

      const nuevosFiltrados = proveedoresFiltrados.map((proveedor) =>
        proveedor.id === proveedorSeleccionado.id
          ? { ...proveedor, estado: "inactivo" }
          : proveedor
      );

      setProveedores(nuevosProveedores);
      setProveedoresFiltrados(nuevosFiltrados);

      setShowModal(false);
      setProveedorSeleccionado(null);
    } catch (error) {
      console.error("Error desactivando proveedor:", error);

      alert("No se pudo desactivar el proveedor");
    }
  };

  // =========================================================
  // ELIMINAR PROVEEDOR
  // =========================================================
  const eliminarProveedorFisico = async () => {
    if (!proveedorSeleccionado) {
      return;
    }

    try {
      const respuesta = await fetch(
        `${API_URL}/proveedores/${proveedorSeleccionado.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el proveedor");
      }

      // Eliminar de la lista principal
      const nuevosProveedores = proveedores.filter(
        (proveedor) => proveedor.id !== proveedorSeleccionado.id
      );

      // Eliminar de la lista filtrada
      const nuevosFiltrados = proveedoresFiltrados.filter(
        (proveedor) => proveedor.id !== proveedorSeleccionado.id
      );

      setProveedores(nuevosProveedores);
      setProveedoresFiltrados(nuevosFiltrados);

      setShowModal(false);
      setProveedorSeleccionado(null);
    } catch (error) {
      console.error("Error eliminando proveedor:", error);

      alert("No se pudo eliminar el proveedor");
    }
  };

  // =========================================================
  // VISTA
  // =========================================================
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
                    <h4 className="mb-0">
                      🚚 Proveedores
                    </h4>

                    <small>
                      Listado de proveedores registrados
                    </small>
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
                        <option value="nombre_proveedor">
                          Nombre
                        </option>

                        <option value="numero_identidad">
                          N° Identidad
                        </option>

                        {/* Campo real de la BD */}
                        <option value="telefono_prv">
                          Teléfono
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
                          <th className="no-print">
                            Acciones
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {proveedoresFiltrados.length === 0 ? (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center"
                            >
                              No hay proveedores disponibles
                            </td>
                          </tr>
                        ) : (
                          proveedoresFiltrados.map((proveedor) => (
                            <tr
                              key={proveedor.id}
                              className="text-center"
                            >
                              {/* ID */}
                              <td>
                                {proveedor.id}
                              </td>

                              {/* Nombre */}
                              <td>
                                {proveedor.nombre_proveedor}
                              </td>

                              {/* Tipo de documento */}
                              <td>
                                {proveedor.tipo_documento
                                  ? proveedor.tipo_documento
                                  : proveedor.tipo_documento_id}
                              </td>

                              {/* Número de identidad */}
                              <td>
                                {proveedor.numero_identidad}
                              </td>

                              {/* Dirección */}
                              <td>
                                {proveedor.direccion}
                              </td>

                              {/* Campo real de la BD */}
                              <td>
                                {proveedor.telefono_prv}
                              </td>

                              {/* Estado */}
                              <td>
                                {proveedor.estado}
                              </td>

                              {/* Acciones */}
                              <td className="no-print">

                                <button
                                  className="btn btn-danger btn-sm me-2"
                                  onClick={() =>
                                    abrirModal(proveedor)
                                  }
                                >
                                  Acción
                                </button>

                                <Link
                                  className="btn btn-warning btn-sm"
                                  to={`/ActualizarProveedores/${proveedor.id}`}
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

                  {/* CREAR PROVEEDOR */}
                  <div className="d-flex justify-content-end mt-3 no-print">

                    <Link
                      className="btn btn-success"
                      to="/CrearProveedores"
                    >
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

        {/* =====================================================
            MODAL DE GESTIÓN
        ====================================================== */}
        {showModal && proveedorSeleccionado && (

          <div
            className="modal show d-block"
            tabIndex="-1"
          >
            <div className="modal-dialog">

              <div className="modal-content">

                {/* HEADER DEL MODAL */}
                <div className="modal-header bg-danger text-white">

                  <h5 className="modal-title">
                    Gestión de proveedor
                  </h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>

                </div>

                {/* INFORMACIÓN */}
                <div className="modal-body">

                  <p>
                    Selecciona una acción para este proveedor:
                  </p>

                  <ul className="list-group">

                    <li className="list-group-item">
                      <b>ID:</b>{" "}
                      {proveedorSeleccionado.id}
                    </li>

                    <li className="list-group-item">
                      <b>Nombre:</b>{" "}
                      {proveedorSeleccionado.nombre_proveedor}
                    </li>

                    <li className="list-group-item">
                      <b>Documento:</b>{" "}
                      {proveedorSeleccionado.numero_identidad}
                    </li>

                    <li className="list-group-item">
                      <b>Estado:</b>{" "}
                      {proveedorSeleccionado.estado}
                    </li>

                  </ul>

                </div>

                {/* ACCIONES DEL MODAL */}
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


