import Navar from "./navar";
import Footer from "./footer";
function Ventas() {
  return (
    <>
      <Navar />
      

      <div className="container py-4">

        <h1 className="mb-4">Módulo de Ventas</h1>

        <div className="row">

          {/* Información Venta */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">

              <div className="card-header">
                Información de la Venta
              </div>

              <div className="card-body">

                <label className="form-label">
                  Número de Venta
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                  value="V-0001"
                  readOnly
                />

                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="date"
                  className="form-control mb-3"
                />

                <label className="form-label">
                  Tipo de Venta
                </label>

                <select className="form-select">
                  <option>Presencial</option>
                  <option>Online</option>
                </select>

              </div>

            </div>
          </div>

          {/* Cliente */}

          <div className="col-md-6">

            <div className="card shadow-sm mb-4">

              <div className="card-header">
                Cliente
              </div>

              <div className="card-body">

                <label className="form-label">
                  Documento
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                />

                <div className="d-flex gap-2">

                  <button className="btn btn-primary">
                    Buscar Cliente
                  </button>

                  <button className="btn btn-success">
                    Registrar Cliente
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Productos */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            Productos
          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-8">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar producto"
                />

              </div>

              <div className="col-md-4 d-flex gap-2 mt-3 mt-md-0">

                <button className="btn btn-primary">
                  Buscar Producto
                </button>

                <button className="btn btn-success">
                  Agregar
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Detalle Venta */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            Detalle de Venta
          </div>

          <div className="card-body">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>P001</td>
                  <td>Bicicleta MTB</td>
                  <td>1</td>
                  <td>$1.500.000</td>
                  <td>$1.500.000</td>

                  <td>

                    <button className="btn btn-danger btn-sm">
                      Quitar
                    </button>

                  </td>

                </tr>

              </tbody>

            </table>

            <h4 className="text-end">
              Total: $1.500.000
            </h4>

          </div>

        </div>

        {/* Información de Entrega */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            Información de Entrega
          </div>

          <div className="card-body">

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Dirección"
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Ciudad"
            />

            <textarea
              className="form-control"
              rows="3"
              placeholder="Observaciones"
            ></textarea>

          </div>

        </div>

        {/* Botones */}

        <div className="text-end">

          <button className="btn btn-secondary me-2">
            Guardar
          </button>

          <button className="btn btn-success me-2">
            Finalizar Venta
          </button>

          <button className="btn btn-danger">
            Cancelar
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Ventas;