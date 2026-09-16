// Listado de clientes

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavVentas from "../../../componentes/NavVentas";
import FooterAdmi from "../../../componentes/FooterAdmi";

// URL base de nuestra API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function VerClientes() {
  const [clientes, setClientes] = useState([]);

  // Cargar clientes al entrar a la vista
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        // Consultar los clientes en Laravel
        const respuesta = await fetch(`${API_URL}/clientes`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los clientes");
        }

        const datos = await respuesta.json();

        // Guardar los clientes obtenidos
        setClientes(datos);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };

    cargarClientes();
  }, []);

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    // Pedir confirmación antes de eliminar
    if (!window.confirm("¿Deseas eliminar este cliente?")) {
      return;
    }

    try {
      // Enviar solicitud DELETE a Laravel
      const respuesta = await fetch(
        `${API_URL}/clientes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el cliente");
      }

      // Quitar el cliente eliminado de la tabla
      // La PK de clientes en MySQL es "id"
      setClientes((actuales) =>
        actuales.filter((cliente) => cliente.id !== id)
      );
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert("No se pudo eliminar el cliente");
    }
  };

  return (
    <div className="app print-area">

      <NavVentas />

      <main className="container-fluid py-4 contenido">

        <div className="container mt-4">

          <div className="card shadow">

            {/* Encabezado */}
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

              <div>
                <h4 className="mb-0">Clientes</h4>

                <small>
                  Listado de clientes registrados
                </small>
              </div>

              {/* Ir a crear cliente */}
              <Link
                className="btn btn-light no-print"
                to="/CrearClientes"
              >
                Crear cliente
              </Link>

            </div>

            <div className="card-body">

              <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                  <thead className="table-success text-center">

                    <tr>
                      <th>ID</th>
                      <th>Documento</th>
                      <th>Nombre completo</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th className="no-print">
                        Acciones
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {/* Cuando no existen clientes */}
                    {clientes.length === 0 ? (

                      <tr>
                        <td
                          colSpan="6"
                          className="text-center"
                        >
                          No hay clientes disponibles
                        </td>
                      </tr>

                    ) : (

                      // Mostrar clientes
                      clientes.map((cliente) => (

                        <tr key={cliente.id}>

                          {/* ID del cliente */}
                          <td className="text-center">
                            {cliente.id}
                          </td>

                          {/* Número de documento */}
                          <td>
                            {cliente.numero_documento}
                          </td>

                          {/* Nombre completo */}
                          <td>
                            {cliente.nombres}{" "}
                            {cliente.apellidos}
                          </td>

                          {/* Dirección */}
                          <td>
                            {cliente.direccion}
                          </td>

                          {/* Teléfono */}
                          <td>
                            {cliente.telefono_clnt}
                          </td>

                          <td className="text-center no-print">

                            {/* Actualizar cliente */}
                            <Link
                              className="btn btn-warning btn-sm me-2"
                              to={`/ActualizarClientes/${cliente.id}`}
                            >
                              Actualizar
                            </Link>

                            {/* Eliminar cliente */}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                eliminarCliente(cliente.id)
                              }
                            >
                              Eliminar
                            </button>

                          </td>

                        </tr>

                      ))
                    )}

                  </tbody>

                </table>

              </div>

              {/* Imprimir listado */}
              <button
                className="btn btn-success no-print"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer-fill me-2"></i>
                Imprimir
              </button>

            </div>

          </div>

        </div>

      </main>

      <FooterAdmi />

    </div>
  );
}

export default VerClientes;

