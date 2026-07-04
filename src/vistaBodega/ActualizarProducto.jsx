import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

const API_URL = "http://localhost:3001/productos";

function ActualizarProducto() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    img_producto: "",
    nombre_producto: "",
    descripcion: "",
    color_producto: "",
    marca_producto: "",
    cant_producto: "",
    modelo: "",
    id_medida: "",
    id_proveedor: "",
    id_local: "",
    valor_unitario: "",
    estado: "activo"
  });

  const medidas = [
    { id: 1, nombre: "Unidad" },
    { id: 2, nombre: "Caja" },
    { id: 3, nombre: "Kilogramo" }
  ];

  const proveedores = [
    { id: 1, nombre: "Shimano Import" },
    { id: 2, nombre: "GW Distribuciones" }
  ];

  const locales = [
    { id: 1, nombre: "Local Centro" },
    { id: 2, nombre: "Local Norte" }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");

        const productoEncontrado = await response.json();
        setForm({
          img_producto: productoEncontrado.img_producto || "",
          nombre_producto: productoEncontrado.nombre_producto || "",
          descripcion: productoEncontrado.descripcion || "",
          color_producto: productoEncontrado.color_producto || "",
          marca_producto: productoEncontrado.marca_producto || "",
          cant_producto: productoEncontrado.cant_producto || "",
          modelo: productoEncontrado.modelo || "",
          id_medida: productoEncontrado.id_medida || "",
          id_proveedor: productoEncontrado.id_proveedor || "",
          id_local: productoEncontrado.id_local || "",
          valor_unitario: productoEncontrado.valor_unitario || "",
          estado: productoEncontrado.estado || "activo"
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto desde la API.");
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          cant_producto: Number(form.cant_producto),
          id_medida: Number(form.id_medida),
          id_proveedor: Number(form.id_proveedor),
          id_local: Number(form.id_local),
          valor_unitario: Number(form.valor_unitario)
        })
      });

      if (!response.ok) throw new Error("No se pudo actualizar el producto");

      navigate("/VerProductos");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el producto.");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando producto...</p>;
  }

  return (
    <div className="app">

      <NavBodega />

      <main className="container-fluid py-4 contenido">

        <div className="row justify-content-center">

          <div className="col-xl-10 col-lg-11 col-md-12">

            <div className="card shadow border-0 rounded-4">

              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-0">✏️ Actualizar Producto</h3>
                <small>Modifica la información del producto</small>
              </div>

              <div className="card-body p-4">

                <form className="row g-4" onSubmit={handleSubmit}>

                  <div className="col-md-6">
                    <label>Imagen URL</label>
                    <input
                      type="text"
                      name="img_producto"
                      className="form-control"
                      value={form.img_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Nombre Producto</label>
                    <input
                      type="text"
                      name="nombre_producto"
                      className="form-control"
                      value={form.nombre_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label>Descripción</label>
                    <input
                      type="text"
                      name="descripcion"
                      className="form-control"
                      value={form.descripcion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Color</label>
                    <input
                      type="text"
                      name="color_producto"
                      className="form-control"
                      value={form.color_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Marca</label>
                    <input
                      type="text"
                      name="marca_producto"
                      className="form-control"
                      value={form.marca_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      className="form-control"
                      value={form.modelo}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      name="cant_producto"
                      className="form-control"
                      value={form.cant_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Valor Unitario</label>
                    <input
                      type="number"
                      name="valor_unitario"
                      className="form-control"
                      value={form.valor_unitario}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Medida</label>
                    <select
                      name="id_medida"
                      className="form-select"
                      value={form.id_medida}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      {medidas.map(m => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Proveedor</label>
                    <select
                      name="id_proveedor"
                      className="form-select"
                      value={form.id_proveedor}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      {proveedores.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Local</label>
                    <select
                      name="id_local"
                      className="form-select"
                      value={form.id_local}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      {locales.map(l => (
                        <option key={l.id} value={l.id}>{l.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Estado</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={form.estado}
                      onChange={handleChange}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="col-12 d-flex justify-content-between mt-3">

                    <Link
                      to="/VerProductos"
                      className="btn btn-outline-secondary"
                    >
                      Volver
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Actualizar Producto
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>
        </div>

      </main>

      <FooterBodega />

    </div>
  );
}

export default ActualizarProducto;