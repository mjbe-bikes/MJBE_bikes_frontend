import React, { useState } from "react";

const CrearReporte = () => {
  const [productos] = useState([
    {
      id: 1,
      producto: "Bicicleta MTB",
      modelo: "XTR",
      marca: "Trek",
      color: "Negro",
      cantidad: 10,
      precio: 850,
      medida: "29",
      estado: "Disponible",
      proveedor: "Bike Store"
    },
    {
      id: 2,
      producto: "Casco",
      modelo: "Pro",
      marca: "Giro",
      color: "Rojo",
      cantidad: 20,
      precio: 60,
      medida: "M",
      estado: "Disponible",
      proveedor: "Safety Bike"
    }
  ]);

  const generarReporte = () => {
    window.print();
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-success text-white">
          <h3>📋 Crear Reporte</h3>
        </div>

        <div className="card-body">

          <table className="table table-bordered table-hover table-striped">
            <thead className="table-success">
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
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.producto}</td>
                  <td>{p.modelo}</td>
                  <td>{p.marca}</td>
                  <td>{p.color}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio}</td>
                  <td>{p.medida}</td>
                  <td>{p.estado}</td>
                  <td>{p.proveedor}</td>
                </tr>
              ))}
            </tbody>

          </table>

          <div className="text-end">
            <button
              className="btn btn-success"
              onClick={generarReporte}
            >
              Crear Reporte
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CrearReporte;