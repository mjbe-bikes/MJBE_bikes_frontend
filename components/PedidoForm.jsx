import React, { useEffect, useState } from "react";

const PedidoForm = ({ onGuardar, pedidoEditando }) => {
  const [pedido, setPedido] = useState({
    nombreCliente: "",
    producto: "",
    cantidad: ""
  });

  // Cargar datos cuando estás editando
  useEffect(() => {
    if (pedidoEditando) {
      setPedido(pedidoEditando);
    }
  }, [pedidoEditando]);

  const handleChange = (e) => {
    setPedido({
      ...pedido,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pedido.nombreCliente || !pedido.producto || !pedido.cantidad) {
      alert("Completa todos los campos");
      return;
    }

    onGuardar(pedido);

    setPedido({
      nombreCliente: "",
      producto: "",
      cantidad: ""
    });
  };

  return (
    <form className="card p-3" onSubmit={handleSubmit}>
      <h5>{pedido.id ? "Editar Pedido" : "Crear Pedido"}</h5>

      <input
        className="form-control mb-2"
        placeholder="Nombre cliente"
        name="nombreCliente"
        value={pedido.nombreCliente}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Producto"
        name="producto"
        value={pedido.producto}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Cantidad"
        name="cantidad"
        type="number"
        value={pedido.cantidad}
        onChange={handleChange}
      />

      <button className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
};

export default PedidoForm;