// Registrar una compra (admin)

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:8000/api";

const initialForm = {
  id_proveedor: "",
  fecha: new Date().toISOString().slice(0, 10),
  pago: false
};

function CrearCompra() {
  const [form, setForm] = useState(initialForm);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([{ id_producto: "", cantidad: "1", precio: "" }]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [proveedoresRespuesta, productosRespuesta] = await Promise.all([
          fetch(`${API_URL}/proveedores`, { credentials: "include" }),
          fetch(`${API_URL}/productos`, { credentials: "include" })
        ]);
        if (!proveedoresRespuesta.ok || !productosRespuesta.ok) {
          throw new Error("No se pudieron cargar los datos");
        }
        setProveedores(await proveedoresRespuesta.json());
        setProductos(await productosRespuesta.json());
      } catch (error) {
        console.error("Error cargando datos de compra:", error);
        alert("No se pudieron cargar proveedores y productos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const total = detalles.reduce((suma, detalle) => {
    return suma + (Number(detalle.cantidad) || 0) * (Number(detalle.precio) || 0);
  }, 0);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((actual) => ({ ...actual, [name]: type === "checkbox" ? checked : value }));
  };

  const handleDetalleChange = (index, event) => {
    const { name, value } = event.target;
    setDetalles((actuales) => actuales.map((detalle, detalleIndex) => {
      if (detalleIndex !== index) return detalle;

      const actualizado = { ...detalle, [name]: value };
      // Al elegir producto, sugiere su valor unitario como costo
      if (name === "id_producto" && !detalle.precio) {
        const producto = productos.find((item) => String(item.id) === String(value));
        if (producto) actualizado.precio = String(producto.valor_unitario);
      }
      return actualizado;
    }));
  };

  const agregarProducto = () => {
    setDetalles((actuales) => [...actuales, { id_producto: "", cantidad: "1", precio: "" }]);
  };

  const quitarProducto = (index) => {
    setDetalles((actuales) => actuales.filter((_, detalleIndex) => detalleIndex !== index));
  };

  const guardarCompra = async (event) => {
    event.preventDefault();
    setGuardando(true);

    try {
      const compra = {
        id_proveedor: Number(form.id_proveedor),
        fecha: form.fecha,
        total_compra: total,
        pago: form.pago
      };

      const respuesta = await fetch(`${API_URL}/compras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compra)
      });
      if (!respuesta.ok) throw new Error("No se pudo crear la compra");
      const compraCreada = await respuesta.json();

      const respuestasDetalles = await Promise.all(detalles.map((detalle) => (
        fetch(`${API_URL}/detalles_compra`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_compra: compraCreada.id,
            id_producto: Number(detalle.id_producto),
            cantidad: Number(detalle.cantidad),
            precio_unitario_momento: Number(detalle.precio)
          })
        })
      )));
      if (respuestasDetalles.some((item) => !item.ok)) {
        throw new Error("No se pudieron crear todos los detalles de la compra");
      }
      navigate("/compras");
    } catch (error) {
      console.error("Error creando compra:", error);
      alert("No se pudo crear la compra");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center mt-5">Cargando información...</p>;

  return (
    <div className="app">
      <NavAdmi />
      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-md-12">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-success text-white py-3">
                <h3 className="mb-1">Crear compra</h3>
                <small>Complete la información de la compra</small>
              </div>
              <div className="card-body p-4">
                <form className="row g-4" onSubmit={guardarCompra}>
                  <div className="col-md-5">
                    <label className="form-label fw-semibold" htmlFor="id_proveedor">Proveedor</label>
                    <select id="id_proveedor" name="id_proveedor" className="form-select" value={form.id_proveedor} onChange={handleChange} required>
                      <option value="">Seleccione un proveedor</option>
                      {proveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre_proveedor}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold" htmlFor="fecha">Fecha</label>
                    <input id="fecha" name="fecha" type="date" className="form-control" value={form.fecha} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <div className="form-check">
                      <input id="pago" name="pago" type="checkbox" className="form-check-input" checked={form.pago} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="pago">Pagada</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-semibold mb-0">Productos</label>
                      <button type="button" className="btn btn-outline-success btn-sm" onClick={agregarProducto}>
                        Agregar producto
                      </button>
                    </div>
                    {detalles.map((detalle, index) => (
                      <div className="row g-2 mb-2" key={`${index}-${detalle.id_producto}`}>
                        <div className="col-md-5">
                          <select name="id_producto" className="form-select" value={detalle.id_producto} onChange={(event) => handleDetalleChange(index, event)} required>
                            <option value="">Seleccione un producto</option>
                            {productos.map((item) => (
                              <option key={item.id} value={item.id}>{item.nombre_producto}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <input name="cantidad" type="number" min="1" className="form-control" placeholder="Cant." value={detalle.cantidad} onChange={(event) => handleDetalleChange(index, event)} required />
                        </div>
                        <div className="col-md-3">
                          <input name="precio" type="number" min="0" step="0.01" className="form-control" placeholder="Costo unitario" value={detalle.precio} onChange={(event) => handleDetalleChange(index, event)} required />
                        </div>
                        <div className="col-md-2">
                          <button type="button" className="btn btn-outline-danger w-100" onClick={() => quitarProducto(index)} disabled={detalles.length === 1}>Quitar</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="col-12 d-flex align-items-end justify-content-md-end">
                    <h4 className="mb-2">Total: ${total.toLocaleString("es-CO")}</h4>
                  </div>
                  <div className="col-12 d-flex justify-content-between mt-4">
                    <Link to="/compras" className="btn btn-outline-secondary">Volver</Link>
                    <button type="submit" className="btn btn-success" disabled={guardando || detalles.some((detalle) => !detalle.id_producto || Number(detalle.cantidad) < 1 || Number(detalle.precio) < 0)}>
                      {guardando ? "Guardando..." : "Guardar compra"}
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

export default CrearCompra;
