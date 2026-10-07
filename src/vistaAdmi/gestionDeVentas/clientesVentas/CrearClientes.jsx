// Alta de cliente

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavVentas from "../../../componentes/NavVentas";
import FooterAdmi from "../../../componentes/FooterAdmi";

// URL base de nuestra API Laravel
const API_URL = "http://127.0.0.1:8000/api";

const initialForm = {
  usuario_id: "",
  tipo_documento_id: "1",
  numero_documento: "",
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono_clnt: "",
};

function CrearClientes() {
  const [form, setForm] = useState(initialForm);
  const [guardando, setGuardando] = useState(false);

  const navigate = useNavigate();

  // Actualizar los campos del formulario
  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  // Crear cliente
  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);

    try {
      // Obtener el token JWT guardado al iniciar sesión
      const token = localStorage.getItem("mjbe_token");

      // Verificar que exista una sesión válida
      if (!token) {
        throw new Error(
          "No se encontró el token de sesión. Inicie sesión nuevamente."
        );
      }

      // Preparar los datos que se enviarán a Laravel
      const datosCliente = {
        // Si existe un usuario asociado, convertirlo a número.
        // Si está vacío, se envía null.
        usuario_id:
          form.usuario_id === ""
            ? null
            : Number(form.usuario_id),

        tipo_documento_id: Number(form.tipo_documento_id),

        numero_documento: form.numero_documento.trim(),

        nombres: form.nombres.trim(),

        apellidos: form.apellidos.trim(),

        direccion: form.direccion.trim(),

        telefono_clnt: form.telefono_clnt.trim(),
      };

      // Enviar el nuevo cliente a Laravel
      const respuesta = await fetch(`${API_URL}/clientes`, {
        method: "POST",

        headers: {
          // JWT necesario para las rutas protegidas de Laravel
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",

          Accept: "application/json",
        },

        body: JSON.stringify(datosCliente),
      });

      // Intentar obtener la respuesta de Laravel
      const datos = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        console.error("Error de Laravel:", datos);

        // Laravel devuelve los errores de validación dentro de "errores".
        const erroresValidacion = datos?.errores
          ? Object.values(datos.errores).flat().join("\n")
          : null;

        throw new Error(
          erroresValidacion ||
          datos?.mensaje ||
          datos?.message ||
          "No se pudo crear el cliente"
        );
      }

      // Mostrar en consola la respuesta del servidor
      console.log("Cliente creado:", datos);

      // Volver al listado de clientes
      navigate("/VerClientes");

    } catch (error) {
      console.error("Error creando cliente:", error);

      alert(
        error.message || "No se pudo crear el cliente"
      );

    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="app">

      <NavVentas />

      <main className="container-fluid py-4 contenido">

        <div className="row justify-content-center">

          <div className="col-xl-8 col-lg-9 col-md-12">

            <div className="card shadow border-0 rounded-4">

              {/* Encabezado */}
              <div className="card-header bg-success text-white py-3">

                <h3 className="mb-1">
                  Registrar cliente
                </h3>

                <small>
                  Complete la información del cliente
                </small>

              </div>

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
                      className="btn btn-success"
                      disabled={guardando}
                    >
                      {guardando
                        ? "Guardando..."
                        : "Guardar cliente"}
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

export default CrearClientes;