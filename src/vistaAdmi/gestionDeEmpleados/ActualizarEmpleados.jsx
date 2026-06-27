import { Link } from "react-router-dom"

import NavAdmi from "../../componentes/NavAdmi"
import FooterAdmi from "../../componentes/FooterAdmi"

function ActualizarEmpleados() {

  return (
    <>
      <div className="app"> 

        <NavAdmi />

        <main className="container-fluid py-4 contenido">

          <div className="row justify-content-center">

            <div className="col-xl-11">

              <div className="card shadow border-0 rounded-4">

                {/* Header */}
                <div className="card-header py-3 bg-warning ">
                  <h3 className="mb-1">✏️ Actualizar Producto</h3>
                  <small>Seleccione un producto y modifique su información</small>
                </div>

                <div className="card-body p-4">

                  <form className="row g-4">

                    {/* SELECCIONAR PRODUCTO */}
                    <div className="col-12">
                      <h5 className="border-bottom pb-2">
                        Información del Producto
                      </h5>
                    </div>

                    <div className="col-md-10">
                      <label className="form-label fw-semibold">
                        Buscar producto
                      </label>

                      <select className="form-select">
                        <option value="">Seleccione un producto...</option>
                        <option value="1">Bicicleta MTB Trek XTR</option>
                        <option value="2">Bicicleta Ruta GW</option>
                        <option value="3">BMX Venzo</option>
                      </select>
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100"
                      >
                        Cargar
                      </button>
                    </div>

                    {/* INFORMACIÓN GENERAL */}
                    <div className="col-12 mt-3">
                      <h5 className="border-bottom pb-2">
                        Información General
                      </h5>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Nombre del producto
                      </label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Modelo
                      </label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Marca
                      </label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-semibold">
                        Dirección del Local
                      </label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Color
                      </label>
                      <select className="form-select">
                        <option value="">Seleccione...</option>
                        <option>Negro</option>
                        <option>Rojo</option>
                        <option>Azul</option>
                      </select>
                    </div>

                    {/* INVENTARIO */}
                    <div className="col-12 mt-3">
                      <h5 className="border-bottom pb-2">
                        Inventario
                      </h5>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Cantidad
                      </label>
                      <input type="number" className="form-control" />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Precio
                      </label>
                      <input type="number" className="form-control" />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Medida
                      </label>
                      <select className="form-select">
                        <option value="">Seleccione...</option>
                        <option>Unidad</option>
                        <option>Caja</option>
                        <option>Paquete</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Estado
                      </label>
                      <select className="form-select">
                        <option value="">Seleccione...</option>
                        <option>Disponible</option>
                        <option>Agotado</option>
                      </select>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="col-12 mt-3">
                      <h5 className="border-bottom pb-2">
                        Descripción
                      </h5>
                    </div>

                    <div className="col-12">
                      <textarea
                        className="form-control"
                        rows="5"
                      ></textarea>
                    </div>

                    {/* PROVEEDOR */}
                    <div className="col-12 mt-3">
                      <h5 className="border-bottom pb-2">
                        Proveedor
                      </h5>
                    </div>

                    <div className="col-12">
                      <select className="form-select">
                        <option value="">Seleccione un proveedor</option>
                        <option>Proveedor 1</option>
                        <option>Proveedor 2</option>
                        <option>Proveedor 3</option>
                      </select>
                    </div>

                    {/* IMAGEN */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Imagen del producto
                      </label>

                      <input type="file" className="form-control" />
                    </div>

                    {/* CHECKBOX */}
                    <div className="col-12 mt-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="confirmar"
                        />
                        <label className="form-check-label" htmlFor="confirmar">
                          Confirmo que deseo actualizar este producto
                        </label>
                      </div>
                    </div>

                    {/* BOTÓN */}
                    <div className="col-4 mt-4 d-flex  justify-content gap-2">
                      <Link type="reset" className="btn btn-outline-secondary" to="/VerProductos" >
                        Volver
                      </Link>
                    </div>

                    <div className="col-8 mt-4 d-flex justify-content-end gap-2">

                      <button type="reset" className="btn btn-outline-secondary">
                        Cancelar
                      </button>

                      <button type="submit" className="btn btn-outline-warning px-4" >
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

export default ActualizarEmpleados