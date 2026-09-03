import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavVentas from "../../../componentes/NavVentas";
import FooterAdmi from "../../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001";

function VerClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/clientes`);
        if (!respuesta.ok) throw new Error("No se pudieron cargar los clientes");
        setClientes(await respuesta.json());
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };

    cargarClientes();
  }, []);

  const eliminarCliente = async (id) => {
    if (!window.confirm("¿Deseas eliminar este cliente?")) return;

    try {
      const respuesta = await fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" });
      if (!respuesta.ok) throw new Error("No se pudo eliminar el cliente");
      setClientes((actuales) => actuales.filter((cliente) => cliente.id_cliente !== id));
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
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">Clientes</h4>
                <small>Listado de clientes registrados</small>
              </div>
              <Link className="btn btn-light no-print" to="/CrearClientes">Crear cliente</Link>
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
                      <th className="no-print">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No hay clientes disponibles</td></tr>
                    ) : clientes.map((cliente) => (
                      <tr key={cliente.id_cliente}>
                        <td className="text-center">{cliente.id_cliente}</td>
                        <td>{cliente.numero_documento}</td>
                        <td>{cliente.nombres} {cliente.apellidos}</td>
                        <td>{cliente.direccion}</td>
                        <td>{cliente.telefono_clnt}</td>
                        <td className="text-center no-print">
                          <Link className="btn btn-warning btn-sm me-2" to={`/ActualizarClientes/${cliente.id_cliente}`}>
                            Actualizar
                          </Link>
                          <button className="btn btn-danger btn-sm" onClick={() => eliminarCliente(cliente.id_cliente)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-success no-print" onClick={() => window.print()}>
                <i className="bi bi-printer-fill me-2"></i>Imprimir
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
