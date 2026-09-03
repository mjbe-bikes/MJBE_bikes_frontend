import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import NavVentas from "../../../componentes/NavVentas";
import FooterAdmi from "../../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001";

const emptyForm = {
  usuario_id: "",
  tipo_documento_id: "1",
  numero_documento: "",
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono_clnt: ""
};

function ActualizarClientes() {
  const { id_cliente } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/clientes?id_cliente=${encodeURIComponent(id_cliente)}`);
        if (!respuesta.ok) throw new Error("No se pudo cargar el cliente");

        const clientes = await respuesta.json();
        const cliente = clientes[0];
        if (!cliente) throw new Error("Cliente no encontrado");

        setForm({
          usuario_id: cliente.usuario_id ?? "",
          tipo_documento_id: String(cliente.tipo_documento_id ?? 1),
          numero_documento: cliente.numero_documento ?? "",
          nombres: cliente.nombres ?? "",
          apellidos: cliente.apellidos ?? "",
          direccion: cliente.direccion ?? "",
          telefono_clnt: cliente.telefono_clnt ?? ""
        });
      } catch (error) {
        console.error("Error cargando cliente:", error);
        alert("No se pudo cargar el cliente");
        navigate("/VerClientes");
      } finally {
        setCargando(false);
      }
    };

    cargarCliente();
  }, [id_cliente, navigate]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);

    try {
      const respuesta = await fetch(`${API_URL}/clientes?id_cliente=${encodeURIComponent(id_cliente)}`);
      if (!respuesta.ok) throw new Error("No se pudo localizar el cliente");

      const clientes = await respuesta.json();
      const clienteActual = clientes[0];
      if (!clienteActual) throw new Error("Cliente no encontrado");

      const respuestaActualizacion = await fetch(
        `${API_URL}/clientes/${clienteActual.id_cliente}`,
        {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: clienteActual.id_cliente,
          id_cliente: clienteActual.id_cliente,
          usuario_id: form.usuario_id === "" ? null : Number(form.usuario_id),
          tipo_documento_id: Number(form.tipo_documento_id),
          numero_documento: form.numero_documento.trim(),
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          direccion: form.direccion.trim(),
          telefono_clnt: form.telefono_clnt.trim()
        })
        }
      );

      if (!respuestaActualizacion.ok) throw new Error("No se pudo actualizar el cliente");
      navigate("/VerClientes");
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      alert("No se pudo actualizar el cliente");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center mt-5">Cargando cliente...</p>;

  return (
    <div className="app">
      <NavVentas />
      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-md-12">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-1">Actualizar cliente</h3>
                <small>Modifique la información del cliente</small>
              </div>
              <div className="card-body p-4">
                <form className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="tipo_documento_id">Tipo de documento</label>
                    <select id="tipo_documento_id" name="tipo_documento_id" className="form-select" value={form.tipo_documento_id} onChange={handleChange} required>
                      <option value="1">Cédula de ciudadanía</option>
                      <option value="2">Cédula de extranjería</option>
                      <option value="3">Pasaporte</option>
                      <option value="4">NIT</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="numero_documento">Número de documento</label>
                    <input id="numero_documento" name="numero_documento" className="form-control" value={form.numero_documento} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="nombres">Nombres</label>
                    <input id="nombres" name="nombres" className="form-control" value={form.nombres} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="apellidos">Apellidos</label>
                    <input id="apellidos" name="apellidos" className="form-control" value={form.apellidos} onChange={handleChange} required />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-semibold" htmlFor="direccion">Dirección</label>
                    <input id="direccion" name="direccion" className="form-control" value={form.direccion} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold" htmlFor="telefono_clnt">Teléfono</label>
                    <input id="telefono_clnt" name="telefono_clnt" type="tel" className="form-control" value={form.telefono_clnt} onChange={handleChange} required />
                  </div>
                  <div className="col-12 d-flex justify-content-between mt-4">
                    <Link to="/VerClientes" className="btn btn-outline-secondary">Volver</Link>
                    <button type="submit" className="btn btn-primary" disabled={guardando}>
                      {guardando ? "Guardando..." : "Actualizar cliente"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterAdmi />
    </div>
  );
}

export default ActualizarClientes;
