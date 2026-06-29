import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function VerUsuarios() {

  const [usuarios, setEmpleados] = useState([]);

  const [filtroPor, setFiltroPor] = useState("Login");
  const [valorFiltro, setValorFiltro] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  
    useEffect(() => {
        fetch("http://localhost:3001/usuarios")
            .then(res => res.json())
            .then(data => {
                setEmpleados(data);
                setUsuariosFiltrados(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const aplicarFiltro = () => {
        const filtrados = usuarios.filter((u) => {
            const valor = u[filtroPor];

            if (!valor) return false;

            return valor
                .toString()
                .toLowerCase()
                .includes(valorFiltro.toLowerCase());
        });

        setUsuariosFiltrados(filtrados);
    };

  return (
    <>
      <div className="app print-area">

        <NavAdmi />

        <div className="contenido">
          <div className="maincontainer-fluid py-4">
            <div className="container mt-12">
              <div className="card shadow">

                {/* ENCABEZADO */}
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                  <div>
                    <h4 className="mb-0">👥 Usuarios</h4>
                    <small>Listado de usuarios registrados</small>
                  </div>

                  <Dropdown className="no-print">
                    <Dropdown.Toggle variant="light">
                      Filtrar
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>

                      <label className="form-label">Filtrar por</label>

                      <select
                        className="form-select mb-3"
                        value={filtroPor}
                        onChange={(e) => setFiltroPor(e.target.value)}
                      >
                        <option value="login">Usuario</option>
                        <option value="email">Email</option>
                        <option value="estado">Estado</option>
                        <option value="tipo_rol">Rol</option>
                      </select>

                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Ingrese el valor"
                        value={valorFiltro}
                        onChange={(e) => setValorFiltro(e.target.value)}
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
                        </tr>
                      </thead>

                      <tbody>
                        {usuariosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No hay usuarios disponibles
                            </td>
                          </tr>
                        ) : (
                          usuariosFiltrados.map((u) => (
                            <tr key={u.id} className="text-center">
                              <td>{u.id}</td>
                              <td>{u.login}</td>
                              <td>{u.email}</td>
                              <td>{u.tipo_rol}</td>
                              <td>{u.estado}</td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>

                  </div>

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

                  {/* Botón */}
        
                  <div className="d-flex justify-content-end mt-3 no-print" >
                    <Link className="btn btn-success" to="/CrearEmpleado">
                      <i className="bi bi-plus-circle me-2"></i>
                      Crear Empleado
                    </Link >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterAdmi />

      </div>

    </>
  );
}

export default VerUsuarios;