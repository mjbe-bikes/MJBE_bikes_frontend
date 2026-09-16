// Editar cliente

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import NavVentas from "../../../componentes/NavVentas";
import FooterAdmi from "../../../componentes/FooterAdmi";

// URL base de nuestra API Laravel
const API_URL = "http://127.0.0.1:8000/api";

const emptyForm = {
  usuario_id: "",
  tipo_documento_id: "1",
  numero_documento: "",
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono_clnt: "",
};

function ActualizarClientes() {
  // ID del cliente recibido desde la ruta
  const { id_cliente } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // =========================================================
  // CARGAR CLIENTE
  // =========================================================
  useEffect(() => {
    const cargarCliente = async () => {
      try {
        // Laravel utiliza el ID real de la tabla clientes
        const respuesta = await fetch(
          `${API_URL}/clientes/${encodeURIComponent(id_cliente)}`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el cliente");
        }

        const datos = await respuesta.json();

        // Laravel puede devolver directamente el cliente
        // o envolverlo dentro de la propiedad "cliente".
        const cliente = datos?.cliente ?? datos;

        if (!cliente || !cliente.id) {
          throw new Error("Cliente no encontrado");
        }

        // Cargar los datos actuales en el formulario
        setForm({
          usuario_id: cliente.usuario_id ?? "",
          tipo_documento_id: String(cliente.tipo_documento_id ?? 1),
          numero_documento: cliente.numero_documento ?? "",
          nombres: cliente.nombres ?? "",
          apellidos: cliente.apellidos ?? "",
          direccion: cliente.direccion ?? "",
          telefono_clnt: cliente.telefono_clnt ?? "",
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

  // =========================================================
  // ACTUALIZAR FORMULARIO
  // =========================================================
  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  // =========================================================
  // ACTUALIZAR CLIENTE
  // =========================================================
  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);

    try {
      // Preparar los datos para Laravel
      const datosCliente = {
        // Si existe usuario asociado, convertirlo a número.
        // Si está vacío, enviar null.
        usuario_id:
          form.usuario_id === "" ? null : Number(form.usuario_id),

        tipo_documento_id: Number(form.tipo_documento_id),

        numero_documento: form.numero_documento.trim(),

        nombres: form.nombres.trim(),

        apellidos: form.apellidos.trim(),

        direccion: form.direccion.trim(),

        telefono_clnt: form.telefono_clnt.trim(),
      };

      // Actualizar directamente utilizando el ID del cliente.
      // La ruta Laravel es PUT /api/clientes/{id}
      const respuesta = await fetch(
        `${API_URL}/clientes/${encodeURIComponent(id_cliente)}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(datosCliente),
        }
      );

      // Intentar obtener la respuesta del servidor
      const datos = await respuesta.json().catch(() => null);

      // Si Laravel devuelve un error
      if (!respuesta.ok) {
        console.error("Error de Laravel:", datos);

        throw new Error(
          datos?.mensaje ||
            datos?.message ||
            "No se pudo actualizar el cliente"
        );
      }

      console.log("Cliente actualizado:", datos);

      // Volver al listado
      navigate("/VerClientes");
    } catch (error) {
      console.error("Error actualizando cliente:", error);

      alert(
        error.message || "No se pudo actualizar el cliente"
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // ESTADO DE CARGA
  // =========================================================
  if (cargando) {
    return (
      <p className="text-center mt-5">
        Cargando cliente...
      </p>
    );
  }

  // =========================================================
  // VISTA
  // =========================================================
  return (
    <div className="app">
      <NavVentas />

      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-md-12">
            <div className="card shadow border-0 rounded-4">

              {/* Encabezado */}
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-1">
                  Actualizar cliente
                </h3>

                <small>
                  Modifique la información del cliente
                </small>
              </div>

              {/* Formulario */}
              <div className="card-body p-4">
                <form
                  className="row g-4"
                  onSubmit={handleSubmit}
                >

                  {/* Tipo de documento */}
                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="tipo_documento_id"
                    >
                      Tipo de documento
                    </label>

                    <select
                      id="tipo_documento_id"
                      name="tipo_documento_id"
                      className="form-select"
                      value={form.tipo_documento_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">
                        Cédula de ciudadanía
                      </option>

                      <option value="2">
                        Cédula de extranjería
                      </option>

                      <option value="3">
                        Pasaporte
                      </option>

                      <option value="4">
                        NIT
                      </option>
                    </select>
                  </div>

                  {/* Número de documento */}
                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="numero_documento"
                    >
                      Número de documento
                    </label>

                    <input
                      id="numero_documento"
                      name="numero_documento"
                      className="form-control"
                      value={form.numero_documento}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Nombres */}
                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="nombres"
                    >
                      Nombres
                    </label>

                    <input
                      id="nombres"
                      name="nombres"
                      className="form-control"
                      value={form.nombres}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Apellidos */}
                  <div className="col-md-6">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="apellidos"
                    >
                      Apellidos
                    </label>

                    <input
                      id="apellidos"
                      name="apellidos"
                      className="form-control"
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Dirección */}
                  <div className="col-md-8">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="direccion"
                    >
                      Dirección
                    </label>

                    <input
                      id="direccion"
                      name="direccion"
                      className="form-control"
                      value={form.direccion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="col-md-4">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="telefono_clnt"
                    >
                      Teléfono
                    </label>

                    <input
                      id="telefono_clnt"
                      name="telefono_clnt"
                      type="tel"
                      className="form-control"
                      value={form.telefono_clnt}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Botones */}
                  <div className="col-12 d-flex justify-content-between mt-4">
                    <Link
                      to="/VerClientes"
                      className="btn btn-outline-secondary"
                    >
                      Volver
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={guardando}
                    >
                      {guardando
                        ? "Guardando..."
                        : "Actualizar cliente"}
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
