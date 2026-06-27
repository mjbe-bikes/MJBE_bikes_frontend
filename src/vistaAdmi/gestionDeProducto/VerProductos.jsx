import { Link } from "react-router-dom"

import NavAdmi from "../../componentes/NavAdmi"
import FooterAdmi from "../../componentes/FooterAdmi";

function VerProductos() {

  return (
    <>
      <div className="app">

        <NavAdmi />

          <div className="contenido">
            <div className="maincontainer-fluid py-4"> 
              <div className="container mt-12 ">
                <div className="card shadow">

                    {/* Encabezado */}

                    <div className="card-header bg-success text-white">
                      <h4 className="mb-0">📦 Productos</h4>
                      <small>Listado de productos registrados</small>
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

                      {/* Botón */}
                      
                      <div className="d-flex justify-content-end mt-3">
                        <Link className="btn btn-success" to="/CrearProducto">
                          <i className="bi bi-plus-circle me-2"></i>
                          Crear Producto
                        </Link >
                      </div>

                      <div className="col-8 mt-4 d-flex justify-content-end gap-2">

                        <button type="reset" className="btn btn-outline-secondary">
                          Cancelar
                        </button>

                        <button type="submit" className="btn btn-outline-warning px-4" >
                          Guardar Producto
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