import { useState } from "react";
import { Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function CrearEmpleados() {

 const [form, setForm] = useState({
  login: "",
  email: "",
  password_harsh: "",
  rol_id: "",
  estado: "activo"
});

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const hashedPassword = await hashPassword(form.password_harsh);

    const res = await fetch("http://localhost:3001/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: form.login,
        email: form.email,
        password_harsh: hashedPassword,
        rol_id: Number(form.rol_id),
        estado: form.estado
      }),
    });

    const data = await res.json();

    console.log("RESPUESTA BACKEND:", data);

    if (!res.ok) {
      alert(data?.mensaje || "Error al crear empleado");
      return;
    }

    alert("Empleado creado correctamente");

    setForm({
      login: "",
      email: "",
      password_harsh: "",
      rol_id: "",
      estado: "activo"
    });

  } catch (error) {
    console.log("Error creando empleado:", error);
    alert("Error de servidor");
  }
};
  return (
    <div className="app">
      <NavAdmi />

      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-md-12">

            <div className="card shadow border-0 rounded-4">

              {/* HEADER */}
              <div className="card-header bg-success text-white py-3">
                <h3 className="mb-1">👤 Registrar Empleado</h3>
                <small>Complete la información del usuario</small>
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

                  {/* PASSWORD */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contraseña</label>
                    <input
                      type="password"
                      name="password_harsh"
                      className="form-control"
                      value={form.password_harsh}
                      onChange={handleChange}
                      required
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
                      <option value="4">Cliente</option>
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

                      <Link
                        to = "/VerUsuarios"
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setForm({
                            login: "",
                            email: "",
                            password_harsh: "",
                            rol_id: "",
                          })
                        }
                      >
                        Cancelar
                      </Link>

                      <button
                        type="submit"
                        className="btn btn-success px-4"
                      >
                        Guardar Empleado
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

export default CrearEmpleados;