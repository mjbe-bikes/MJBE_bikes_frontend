import { Link } from "react-router-dom"

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function EliminarEmpleados() {
  return (
    <>
      <div className="app"> 

        <NavAdmi />

        <main className="container-fluid py-4 contenido">

          <div className="row justify-content-center">

            <div className="col-xl-11 col-lg-11 col-md-12">

              <div className="card shadow border-0 rounded-4">

                {/* HEADER */}
                <div className="card-header bg-danger text-white py-3">
                  <h3 className="mb-1">🗑️ Eliminar Empleado</h3>
                  <small>Seleccione un empleado y confirme su eliminación</small>
                </div>

                <div className="card-body p-4">

                  <form className="row g-4">

                    {/* SELECCIONAR EMPLEADO */}
                    <div className="col-12">
                      <h5 className="border-bottom pb-2">
                        Seleccionar Empleado
                      </h5>
                    </div>

                    <div className="col-md-10">
                      <label className="form-label fw-semibold">
                        Empleado
                      </label>

                      <select className="form-select">
                        <option value="">Seleccione un empleado...</option>
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                        <option>Bob Johnson </option>
                      </select>
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                      >
                        Cargar
                      </button>
                    </div>

                    {/* PREVISUALIZACIÓN */}
                    <div className="col-12 mt-3">
                      <h5 className="border-bottom pb-2">
                        Información del Empleado
                      </h5>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Nombre</label>
                      <input type="text" className="form-control" disabled />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Puesto</label>
                      <input type="text" className="form-control" disabled />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Departamento</label>
                      <input type="text" className="form-control" disabled />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Cantidad</label>
                      <input type="text" className="form-control" disabled />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Precio</label>
                      <input type="text" className="form-control" disabled />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Estado</label>
                      <input type="text" className="form-control" disabled />
                    </div>

                    {/* ALERTA */}
                    <div className="col-12 mt-3">
                      <div className="alert alert-warning">
                        ⚠️ Esta acción eliminará el empleado de forma permanente.
                      </div>
                    </div>

                    {/* CONFIRMACIÓN */}
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="confirmDelete"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="confirmDelete"
                        >
                          Confirmo que deseo eliminar este empleado
                        </label>
                      </div>
                    </div>

                    {/* BOTÓN */}

                    <div className="col-4 mt-4 d-flex  justify-content gap-2">
                      <Link type="reset" className="btn btn-outline-secondary" to="/VerEmpleados" >
                        Volver
                      </Link>
                    </div>

                    <div className="col-8 mt-4 d-flex  justify-content-end gap-2">

                        <button type="reset" className="btn btn-outline-secondary">
                          Cancelar
                        </button>

                        <button type="submit" className="btn btn-outline-danger px-4" >
                          Guardar Producto
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
    </>
  );
}

export default EliminarEmpleados;