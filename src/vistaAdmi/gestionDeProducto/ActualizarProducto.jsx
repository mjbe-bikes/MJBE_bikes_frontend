// Editar producto (admin)

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = 'http://localhost:8000/api/productos';
const TALLAS_URL = 'http://localhost:8000/api/tallas';
const PROVEEDORES_URL = 'http://localhost:8000/api/proveedores';
const LOCALES_URL = 'http://localhost:8000/api/locales';

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
    id_talla: "",
    id_proveedor: "",
    id_local: "",
    valor_unitario: "",
    estado: "activo"
  });

  const [tallas, setTallas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [locales, setLocales] = useState([]);

  // Catálogos reales: talla (con su medida), proveedor y local.
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [tallasRes, proveedoresRes, localesRes] = await Promise.all([
          fetch(TALLAS_URL, { credentials: "include" }),
          fetch(PROVEEDORES_URL, { credentials: "include" }),
          fetch(LOCALES_URL, { credentials: "include" })
        ]);

        setTallas(await tallasRes.json());
        setProveedores(await proveedoresRes.json());
        setLocales(await localesRes.json());
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      }
    };

    cargarCatalogos();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`, { credentials: "include" });
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
          id_talla: productoEncontrado.id_talla || "",
          id_proveedor: productoEncontrado.id_proveedor || "",
          id_local: productoEncontrado.id_local || "",
          valor_unitario: productoEncontrado.valor_unitario || "",
          estado: String(productoEncontrado.estado || "activo").toLowerCase()
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          cant_producto: Number(form.cant_producto),
          id_talla: Number(form.id_talla),
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

      <NavAdmi />

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
                    <label>Talla</label>
                    <select
                      name="id_talla"
                      className="form-select"
                      value={form.id_talla}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      {tallas.map(t => (
                        <option key={t.id} value={t.id}>{t.talla} ({t.medida?.tipo_medida})</option>
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
                        <option key={p.id} value={p.id}>{p.nombre_proveedor}</option>
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
                        <option key={l.id} value={l.id}>{l.nombre_local}</option>
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

      <FooterAdmi />

    </div>
  );
}

export default ActualizarProducto;