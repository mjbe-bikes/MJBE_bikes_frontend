import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function ActualizarEmpleados() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    email: "",
    password_harsh: "",
    rol_id: "",
    estado: "activo"
  });

  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 TRAER USUARIO POR ID
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:3001/usuarios/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data?.mensaje || "Error al cargar usuario");
          return;
        }

        setForm({
          login: data.login || "",
          email: data.email || "",
          password_harsh: "", // normalmente no se trae por seguridad
          rol_id: data.rol_id || "",
          estado: data.estado || "activo"
        });

      } catch (error) {
        console.log("Error cargando usuario:", error);
        alert("Error de servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  // 🔥 ACTUALIZAR USUARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        login: form.login,
        email: form.email,
        rol_id: Number(form.rol_id),
        estado: form.estado
      };

      if (form.password_harsh.trim() !== "") {
        body.password_harsh = await hashPassword(form.password_harsh);
      }

      const res = await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: "PUT", // o PATCH si tu backend lo usa
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      console.log("RESPUESTA BACKEND:", data);

      if (!res.ok) {
        alert(data?.mensaje || "Error al actualizar empleado");
        return;
      }

      alert("Empleado actualizado correctamente");
      navigate("/VerUsuarios");

    } catch (error) {
      console.log("Error actualizando empleado:", error);
      alert("Error de servidor");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando usuario...</p>;
  }

  return (
    <div className="app">
      <NavAdmi />

      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-md-12">

            <div className="card shadow border-0 rounded-4">

              {/* HEADER */}
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-1">✏️ Actualizar Empleado</h3>
                <small>Modifique la información del usuario</small>
              </div>

              <div className="card-body p-4">

                <form className="row g-4" onSubmit={handleSubmit}>

                  {/* LOGIN */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Usuario</label>
                    <input
                      type="text"
                      name="login"
                      className="form-control"
                      value={form.login}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Correo</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* PASSWORD (opcional) */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Nueva Contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      name="password_harsh"
                      className="form-control"
                      value={form.password_harsh}
                      onChange={handleChange}
                      placeholder="Dejar vacío si no cambia"
                    />
                  </div>

                  {/* ROL */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Rol</label>
                    <select
                      name="rol_id"
                      className="form-select"
                      value={form.rol_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione rol</option>
                      <option value="1">Administrador</option>
                      <option value="2">Empleado</option>
                      <option value="3">Bodeguero</option>
                    </select>
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
                  <div className="col-12 mt-4 d-flex justify-content-between">

                    <Link
                      to="/VerUsuarios"
                      className="btn btn-outline-secondary"
                    >
                      Volver
                    </Link>

                    <div className="d-flex gap-2">

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setForm({
                            login: "",
                            email: "",
                            password_harsh: "",
                            rol_id: "",
                            estado: "activo"
                          })
                        }
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                      >
                        Actualizar Empleado
                      </button>

                    </div>

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

export default ActualizarEmpleados;