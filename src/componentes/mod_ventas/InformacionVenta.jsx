import Navar from "./navar";
import Footer from "./footer";

function InfoVenta () {
    return(
    <>
    <Navar />

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
    </>
);
}

export default InfoVenta;