import { useEffect, useState } from "react";
import {
  getPedidos,
  createPedido,
  deletePedido
} from "./api/api.js";

export default function App() {

  const [pedidos, setPedidos] = useState([]);

  const [form, setForm] = useState({
    cliente: "",
    documento: "",
    telefono: "",
    direccion: "",
    categoria: "Bicicleta",
    producto: "Bicicleta MTB Rin 29",
    cantidad: 1,
    precio: "",
    observaciones: ""
  });

  // 🔥 Cargar datos
  useEffect(() => {
  cargarPedidos();
}, []);

const cargarPedidos = async () => {
  try {
    const data = await getPedidos();
    setPedidos(data || []);
  } catch (error) {
    console.log("Error cargando pedidos:", error);
  }
};
  // 🔥 Input change seguro
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Crear pedido
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some(v => v === "")) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await createPedido(form);
      setForm({
        cliente: "",
        documento: "",
        telefono: "",
        direccion: "",
        categoria: "Bicicleta",
        producto: "Bicicleta MTB Rin 29",
        cantidad: 1,
        precio: "",
        observaciones: ""
      });

      cargarPedidos();
    } catch (error) {
      console.log("Error creando:", error);
    }
  };

  // 🔥 Eliminar
  const eliminar = async (id) => {
    try {
      await deletePedido(id);
      cargarPedidos();
    } catch (error) {
      console.log("Error eliminando:", error);
    }
  };

  const total = (p) => Number(p.cantidad || 0) * Number(p.precio || 0);

  return (
    <div className="container py-5">

      <div className="card shadow">

        <div className="card-header bg-dark text-white text-center">
          <h2>Crear Pedido</h2>
        </div>

        <div className="card-body">

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <input
                  className="form-control"
                  name="cliente"
                  placeholder="Cliente"
                  value={form.cliente}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <input
                  className="form-control"
                  name="documento"
                  placeholder="Documento"
                  value={form.documento}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button className="btn btn-success">
              Guardar Pedido
            </button>

          </form>

          <hr />

          {/* TABLA */}
          <table className="table table-bordered mt-3">

            <thead className="table-dark">
              <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {Array.isArray(pedidos) && pedidos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay pedidos
                  </td>
                </tr>
              ) : (
                Array.isArray(pedidos) && pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.cliente}</td>
                    <td>{p.producto}</td>
                    <td>${total(p)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminar(p.id)}
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

      </div>

    </div>
  );
}