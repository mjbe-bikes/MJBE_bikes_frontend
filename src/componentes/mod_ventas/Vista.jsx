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

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Ventas;