import { useEffect, useState } from "react";
import axios from "axios";


function Facturacion() {

  const [facturas, setFacturas] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:3000/facturas")
      .then((res) => {
        setFacturas(res.data);
      });

  }, []);


  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">

        <h2>
          Facturación
        </h2>

        <button className="btn btn-primary">
          Nueva factura
        </button>

      </div>


      <div className="card shadow">

        <div className="card-body">


          <table className="table table-striped">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>

            </thead>


            <tbody>

              {
                facturas.map((factura)=>(

                  <tr key={factura.id}>

                    <td>
                      {factura.id}
                    </td>

                    <td>
                      {factura.numero_factura}
                    </td>

                    <td>
                      Cliente #{factura.cliente_id}
                    </td>

                    <td>
                      {factura.fecha}
                    </td>

                    <td>
                      ${factura.total}
                    </td>

                    <td>

                      <span className="badge bg-success">
                        {factura.estado}
                      </span>

                    </td>


                  </tr>

                ))
              }


            </tbody>


          </table>


        </div>

      </div>


    </div>
  )
}


export default Facturacion;