import { Link } from "react-router-dom"
import { Dropdown } from "react-bootstrap";

import NavAdmi from "../../componentes/NavAdmi"
import FooterAdmi from "../../componentes/FooterAdmi";

function VerProductos() {

  return (
    <>
      <div className="app ">

        <NavAdmi />

          <div className="contenido">
            <div className="maincontainer-fluid py-4"> 
              <div className="container mt-12 ">
                <div className="card shadow">

                    {/* Encabezado */}

                    <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                      <div>
                        <h4 className="mb-0">📦 Productos</h4>
                        <small>Listado de productos registrados</small>
                      </div>

                      <Dropdown className="no-print">
                        <Dropdown.Toggle variant="light">
                          Filtrar
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>
                          <label className="form-label ">Filtrar por</label>

                          <select className="form-select mb-3 ">
                            <option>Producto</option>
                            <option>Marca</option>
                            <option>Modelo</option>
                            <option>Estado</option>
                            <option>Proveedor</option>
                          </select>

                          <input
                            type="text"
                            className="form-control mb-3 "
                            placeholder="Ingrese el valor"
                          />

                          <button className="btn btn-success w-100">
                            Aplicar filtro
                          </button>
                        </Dropdown.Menu>
                      </Dropdown>

                    </div>

                    {/* Tabla */}

                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                          <thead className="table-success text-center">
                            <tr>
                              <th>#ID</th>
                              <th>Producto</th>
                              <th>Modelo</th>
                              <th>Marca</th>
                              <th>Color</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Medida</th>
                              <th>Estado</th>
                              <th>Proveedor</th>
                              <th colspan="4">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* registros */}

                          </tbody>
                        </table>
                      </div>

                      {/* Imprimir */}
                      <div className="btn no-print mx-auto d-block ">
                        <button
                          className="btn bg-success text-white ms-2 no-print col-2"
                          onClick={() => window.print()}
                        >
                          <i className="bi bi-printer-fill me-2"></i>
                            Imprimir
                        </button>
                      </div>
                     
                    </div>
                  </div>
              </div>
            </div>
          </div>

        <FooterAdmi/>
        
      </div>
    </>
  )
}

export default VerProductos;