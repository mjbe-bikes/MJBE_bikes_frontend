import React from "react";

const TablaPedidos = ({ pedidos, onEliminar, onEditar }) => {
  return (
    <div className="card p-3 mt-3">
      <h5>Lista de Pedidos</h5>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hay pedidos
              </td>
            </tr>
          ) : (
            pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombreCliente}</td>
                <td>{p.producto}</td>
                <td>{p.cantidad}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => onEditar(p)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onEliminar(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPedidos;