import React, { useEffect, useState } from "react";
import { createPedido, getPedidos, deletePedido } from "../services/api";
import PedidoForm from "../components/PedidoForm";
import TablaPedidos from "../components/TablaPedidos";

const CrearPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  // Cargar pedidos
  const cargarPedidos = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Guardar (crear o editar)
  const handleGuardar = async (pedido) => {
    if (pedido.id) {
      // editar
      await deletePedido(pedido.id); // temporal simple
      await createPedido(pedido);
    } else {
      // crear
      await createPedido(pedido);
    }

    setPedidoEditando(null);
    cargarPedidos();
  };

  // Eliminar
  const handleEliminar = async (id) => {
    await deletePedido(id);
    cargarPedidos();
  };

  // Editar
  const handleEditar = (pedido) => {
    setPedidoEditando(pedido);
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Gestión de Pedidos</h2>

      {/* Formulario */}
      <PedidoForm
        onGuardar={handleGuardar}
        pedidoEditando={pedidoEditando}
      />

      <hr />

      {/* Tabla */}
      <TablaPedidos
        pedidos={pedidos}
        onEliminar={handleEliminar}
        onEditar={handleEditar}
      />
    </div>
  );
};

export default CrearPedido;