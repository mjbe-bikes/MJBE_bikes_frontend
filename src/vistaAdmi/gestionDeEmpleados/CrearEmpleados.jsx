import { Link } from "react-router-dom"

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function CrearEmpleados() {
  return (
    <>
      <div className="app"> 
        <NavAdmi />

        <main className="container-fluid py-4 contenido">

          <div className="row justify-content-center">

            <div className="col-xl-11 col-lg-11 col-md-12">

              <div className="card shadow border-0 rounded-4">

                {/* Encabezado */}
                <div className="card-header bg-success text-white py-3">
                  <h3 className="mb-1">📦 Registrar Producto</h3>
                  <small>Complete la información del producto</small>
                </div>

                <div className="card-body p-4">

                  <form className="row g-4" noValidate>

                    {/* ---------------- Información General ---------------- */}

                    <div className="col-12">
                      <h5 className="border-bottom pb-2 mb-3">
                        Información General
                      </h5>
                    </div>

                    {/* Nombre */}
                    <div className="col-md-4">
                      <label htmlFor="nombre" className="form-label fw-semibold">
                        Nombre del producto
                      </label>
                      <input
                        id="nombre"
                        type="text"
                        className="form-control"
                        placeholder="Ingrese el nombre"
                      />
                    </div>

                    {/* Modelo */}
                    <div className="col-md-4">
                      <label htmlFor="modelo" className="form-label fw-semibold">
                        Modelo
                      </label>
                      
                      <input
                        id="modelo"
                        type="text"
                        className="form-control"
                        placeholder="Ingrese el modelo"
                      />
                    </div>

                    {/* Marca */}
                    <div className="col-md-4">
                      <label htmlFor="marca" className="form-label fw-semibold">
                        Marca
                      </label>
                      <input
                        id="marca"
                        type="text"
                        className="form-control"
                        placeholder="Ingrese la marca"
                      />
                    </div>

                    {/* Dirección */}
                    <div className="col-md-8">
                      <label htmlFor="direccion" className="form-label fw-semibold">
                        Dirección del Local
                      </label>
                      <input
                        id="direccion"
                        type="text"
                        className="form-control"
                        placeholder="Ingrese la dirección"
                      />
                    </div>

                    {/* Color */}
                    <div className="col-md-4">
                      <label htmlFor="color" className="form-label fw-semibold">
                        Color
                      </label>
                      <select id="color" className="form-select" defaultValue="">
                        <option value="">Seleccione...</option>
                        <option>Rojo</option>
                        <option>Azul</option>
                        <option>Negro</option>
                      </select>
                    </div>

                    {/* ---------------- Inventario ---------------- */}

                    <div className="col-12 mt-4">
                      <h5 className="border-bottom pb-2 mb-3">
                        Inventario
                      </h5>
                    </div>

                    {/* Cantidad */}
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Cantidad
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                      />
                    </div>

                    {/* Precio */}
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Precio
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="$0.00"
                      />
                    </div>

                    {/* Medida */}
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Medida
                      </label>

                      <select className="form-select" defaultValue="">
                        <option value="">Seleccione...</option>
                        <option>Unidad</option>
                        <option>Caja</option>
                        <option>Paquete</option>
                      </select>
                    </div>

                    {/* Estado */}
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Estado
                      </label>

                      <select className="form-select" defaultValue="">
                        <option value="">Seleccione...</option>
                        <option>Disponible</option>
                        <option>Agotado</option>
                      </select>
                    </div>

                    {/* ---------------- Descripción ---------------- */}

                    <div className="col-12 mt-4">
                      <h5 className="border-bottom pb-2 mb-3">
                        Descripción
                      </h5>
                    </div>

                    <div className="col-12">
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Ingrese la descripción del producto..."
                      ></textarea>
                    </div>

                    {/* ---------------- Proveedor ---------------- */}

                    <div className="col-12 mt-4">
                      <h5 className="border-bottom pb-2 mb-3">
                        Proveedor
                      </h5>
                    </div>

                    <div className="col-12">
                      <select className="form-select" defaultValue="">
                        <option value="">Seleccione un proveedor</option>
                        <option>Proveedor 1</option>
                        <option>Proveedor 2</option>
                        <option>Proveedor 3</option>
                      </select>
                    </div>

                    {/* Imagen */}

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Imagen del producto
                      </label>

                      <input
                        className="form-control"
                        type="file"
                      />
                    </div>

                    {/* Confirmación */}

                    <div className="col-12 mt-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="confirmar"
                        />

                        <label
                          className="form-check-label"
                          htmlFor="confirmar"
                        >
                          Confirmo que la información es correcta.
                        </label>
                      </div>
                    </div>

                      {/* Botón */}

                    <div className="col-4 mt-4 d-flex  justify-content gap-2">
                      <Link type="reset" className="btn btn-outline-secondary" to="/VerProductos">
                        Volver
                      </Link>
                    </div>

                      <div className="col-8 mt-4 d-flex justify-content-end gap-2">
                          <button type="reset" className="btn btn-outline-secondary">
                              Cancelar
                          </button>

                          <button type="submit" className="btn btn-outline-success px-4">
                              Guardar Empleado
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

export default CrearEmpleados;