import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function ActualizarProveedor() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_proveedor: "",
    tipo_documento_id: "",
    numero_identidad: "",
    direccion: "",
    telefono: "",
    estado: "activo"
  });

  const [loading, setLoading] = useState(true);

  // 🔥 CAMBIAR INPUTS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 TRAER PROVEEDOR POR ID
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const res = await fetch(`http://localhost:3001/proveedores/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data?.mensaje || "Error al cargar proveedor");
          return;
        }

        setForm({
          nombre_proveedor: data.nombre_proveedor || "",
          tipo_documento_id: data.tipo_documento_id || "",
          numero_identidad: data.numero_identidad || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          estado: data.estado || "activo"
        });

      } catch (error) {
        console.log(error);
        alert("Error de servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [id]);

  // 🔥 ACTUALIZAR PROVEEDOR
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre_proveedor: form.nombre_proveedor,
      tipo_documento_id: Number(form.tipo_documento_id),
      numero_identidad: form.numero_identidad,
      direccion: form.direccion,
      telefono: form.telefono,
      estado: form.estado
    };

    try {
      const res = await fetch(`http://localhost:3001/proveedores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.mensaje || "Error al actualizar proveedor");
        return;
      }

      alert("Proveedor actualizado correctamente");
      navigate("/VerProveedores");

    } catch (error) {
      console.log(error);
      alert("Error de servidor");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando proveedor...</p>;
  }

  return (
    <div className="app">

      <NavAdmi />

      <main className="container-fluid py-4 contenido">

        <div className="row justify-content-center">

          <div className="col-xl-8 col-lg-9 col-md-12">

            {/* CARD PRINCIPAL */}
            <div className="card shadow border-0 rounded-4">

              {/* HEADER */}
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-0">✏️ Actualizar Proveedor</h3>
                <small>Modifique la información del proveedor</small>
              </div>

              {/* BODY */}
              <div className="card-body p-4">

                <form className="row g-4" onSubmit={handleSubmit}>

                  {/* NOMBRE */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Nombre Proveedor</label>
                    <input
                      type="text"
                      name="nombre_proveedor"
                      className="form-control"
                      value={form.nombre_proveedor}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* TIPO DOCUMENTO */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tipo Documento</label>

                    <select
                      name="tipo_documento_id"
                      className="form-select"
                      value={form.tipo_documento_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione tipo de documento</option>

                      <option value="1">Cédula Ciudadanía</option>
                      <option value="2">Tarjeta Identidad</option>
                      <option value="3">Registro Civil</option>
                      <option value="4">NIT</option>

                    </select>
                  </div>

                  {/* IDENTIDAD */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Número de Identidad</label>
                    <input
                      type="text"
                      name="numero_identidad"
                      className="form-control"
                      value={form.numero_identidad}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* TELEFONO */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      className="form-control"
                      value={form.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* DIRECCION */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      className="form-control"
                      value={form.direccion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* ESTADO */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Estado</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={form.estado}
                      onChange={handleChange}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  {/* BOTONES */}
                  <div className="col-12 d-flex justify-content-between mt-3">

                    <Link
                      to="/VerProveedores"
                      className="btn btn-outline-secondary"
                    >
                      Volver
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Actualizar Proveedor
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

export default ActualizarProveedor;