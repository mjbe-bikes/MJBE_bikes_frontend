import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:3000/pedidos";

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

  // 🔥 Cargar pedidos (GET API)
  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setPedidos(data);
  };

  // 🔥 Cambiar inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Crear pedido (POST API)
  const crearPedido = async (e) => {
    e.preventDefault();

    if (Object.values(form).some(v => v === "")) {
      alert("Debes completar todos los campos obligatorios.");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

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

    obtenerPedidos();
  };

  // 🔥 Eliminar (DELETE API)
  const eliminarPedido = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    obtenerPedidos();
  };

  // 🔥 Editar (simple: carga + borra + recrea luego)
  const editarPedido = async (pedido) => {

    setForm(pedido);

    await fetch(`${API_URL}/${pedido.id}`, {
      method: "DELETE"
    });

    obtenerPedidos();
  };

  const total = (p) => p.cantidad * p.precio;

  return (

    <div className="container py-5">

      <div className="card shadow">

        <div className="card-header bg-dark text-white text-center">
          <h2>Crear Pedido</h2>
        </div>

        <div className="card-body">

          {/* FORM */}
          <form onSubmit={crearPedido}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Cliente</label>
                <input
                  className="form-control"
                  name="cliente"
                  value={form.cliente}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Documento</label>
                <input
                  className="form-control"
                  name="documento"
                  value={form.documento}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Teléfono</label>
                <input
                  className="form-control"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Dirección</label>
                <input
                  className="form-control"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="row">

              <div className="col-md-4 mb-3">
                <label>Categoría</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option>Bicicleta</option>
                  <option>Repuesto</option>
                  <option>Accesorio</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label>Producto</label>
                <select
                  className="form-select"
                  name="producto"
                  value={form.producto}
                  onChange={handleChange}
                >
                  <option>Bicicleta MTB Rin 29</option>
                  <option>Bicicleta Ruta</option>
                  <option>Cadena</option>
                  <option>Llanta</option>
                  <option>Casco</option>
                </select>
              </div>

              <div className="col-md-2 mb-3">
                <label>Cantidad</label>
                <input
                  className="form-control"
                  name="cantidad"
                  type="number"
                  value={form.cantidad}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2 mb-3">
                <label>Precio</label>
                <input
                  className="form-control"
                  name="precio"
                  type="number"
                  value={form.precio}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mb-3">
              <label>Observaciones</label>
              <textarea
                className="form-control"
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
              />
            </div>

            <div className="text-end">
              <button className="btn btn-success me-2">
                Guardar Pedido
              </button>

              <button type="reset" className="btn btn-secondary">
                Limpiar
              </button>
            </div>

          </form>

          <hr />

          {/* TABLA */}
          <h3 className="text-center">Pedidos Registrados</h3>

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Cliente</th>
                  <th>Documento</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Dirección</th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.cliente}</td>
                    <td>{p.documento}</td>
                    <td>{p.producto}</td>
                    <td>{p.cantidad}</td>
                    <td>${Number(p.precio).toLocaleString()}</td>
                    <td>${Number(total(p)).toLocaleString()}</td>
                    <td>{p.direccion}</td>
                    <td>{p.observaciones}</td>
                    <td>

                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => editarPedido(p)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarPedido(p.id)}
                      >
                        Eliminar
                      </button>

                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      </div>

    </div>
  );
}