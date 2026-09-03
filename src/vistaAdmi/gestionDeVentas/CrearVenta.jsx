import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavVentas from "../../componentes/NavVentas";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001";

const initialForm = {
  id_cliente: "",
  fecha: new Date().toISOString().slice(0, 10)
};

function CrearVenta() {
  const [form, setForm] = useState(initialForm);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([{ id_producto: "", cantidad: "1" }]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesRespuesta, productosRespuesta] = await Promise.all([
          fetch(`${API_URL}/clientes`),
          fetch(`${API_URL}/productos`)
        ]);
        if (!clientesRespuesta.ok || !productosRespuesta.ok) {
          throw new Error("No se pudieron cargar los datos");
        }
        setClientes(await clientesRespuesta.json());
        setProductos(await productosRespuesta.json());
      } catch (error) {
        console.error("Error cargando datos de venta:", error);
        alert("No se pudieron cargar clientes y productos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const productosDisponibles = productos.filter(
    (producto) => producto.estado?.toLowerCase() === "activo" && Number(producto.cant_producto) > 0
  );
  const total = detalles.reduce((suma, detalle) => {
    const producto = productos.find((item) => String(item.id) === String(detalle.id_producto));
    return suma + (Number(detalle.cantidad) || 0) * Number(producto?.valor_unitario || 0);
  }, 0);

  const handleChange = (event) => {
    setForm((actual) => ({ ...actual, [event.target.name]: event.target.value }));
  };

  const handleDetalleChange = (index, event) => {
    setDetalles((actuales) => actuales.map((detalle, detalleIndex) => (
      detalleIndex === index ? { ...detalle, [event.target.name]: event.target.value } : detalle
    )));
  };

  const agregarProducto = () => {
    setDetalles((actuales) => [...actuales, { id_producto: "", cantidad: "1" }]);
  };

  const quitarProducto = (index) => {
    setDetalles((actuales) => actuales.filter((_, detalleIndex) => detalleIndex !== index));
  };

  const guardarVenta = async (event) => {
    event.preventDefault();
    setGuardando(true);

    try {
      const venta = {
        id_vendedor: Number(localStorage.getItem("mjbe_user_id")),
        id_cliente: Number(form.id_cliente),
        fecha: form.fecha,
        total
      };

      const respuesta = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta)
      });
      if (!respuesta.ok) throw new Error("No se pudo crear la venta");
      const ventaCreada = await respuesta.json();

      const respuestasDetalles = await Promise.all(detalles.map((detalle) => {
        const producto = productos.find((item) => String(item.id) === String(detalle.id_producto));
        return fetch(`${API_URL}/detalles_venta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_venta: ventaCreada.id,
            id_producto: Number(detalle.id_producto),
            cantidad: Number(detalle.cantidad),
            precio_unitario_momento: Number(producto.valor_unitario)
          })
        });
      }));
      if (respuestasDetalles.some((respuesta) => !respuesta.ok)) {
        throw new Error("No se pudieron crear todos los detalles de la venta");
      }
      navigate("/Historialventas");
    } catch (error) {
      console.error("Error creando venta:", error);
      alert("No se pudo crear la venta");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center mt-5">Cargando información...</p>;

  return (
    <div className="app">
      <NavVentas />
      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-md-12">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-success text-white py-3">
                <h3 className="mb-1">Crear venta</h3>
                <small>Complete la información de la venta</small>
              </div>
              <div className="card-body p-4">
                <form className="row g-4" onSubmit={guardarVenta}>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="id_cliente">Cliente</label>
                    <select id="id_cliente" name="id_cliente" className="form-select" value={form.id_cliente} onChange={handleChange} required>
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id_cliente} value={cliente.id_cliente}>
                          {cliente.nombres} {cliente.apellidos}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="fecha">Fecha</label>
                    <input id="fecha" name="fecha" type="date" className="form-control" value={form.fecha} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-semibold mb-0">Productos</label>
                      <button type="button" className="btn btn-outline-success btn-sm" onClick={agregarProducto}>
                        Agregar producto
                      </button>
                    </div>
                    {detalles.map((detalle, index) => {
                      const producto = productos.find((item) => String(item.id) === String(detalle.id_producto));
                      return (
                        <div className="row g-2 mb-2" key={`${index}-${detalle.id_producto}`}>
                          <div className="col-md-7">
                            <select name="id_producto" className="form-select" value={detalle.id_producto} onChange={(event) => handleDetalleChange(index, event)} required>
                              <option value="">Seleccione un producto</option>
                              {productosDisponibles.map((item) => <option key={item.id} value={item.id}>{item.nombre_producto} - ${Number(item.valor_unitario).toLocaleString("es-CO")}</option>)}
                            </select>
                          </div>
                          <div className="col-md-3">
                            <input name="cantidad" type="number" min="1" max={producto?.cant_producto || undefined} className="form-control" value={detalle.cantidad} onChange={(event) => handleDetalleChange(index, event)} required />
                          </div>
                          <div className="col-md-2">
                            <button type="button" className="btn btn-outline-danger w-100" onClick={() => quitarProducto(index)} disabled={detalles.length === 1}>Quitar</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="col-12 d-flex align-items-end justify-content-md-end">
                    <h4 className="mb-2">Total: ${total.toLocaleString("es-CO")}</h4>
                  </div>
                  <div className="col-12 d-flex justify-content-between mt-4">
                    <Link to="/Historialventas" className="btn btn-outline-secondary">Volver</Link>
                    <button type="submit" className="btn btn-success" disabled={guardando || detalles.some((detalle) => !detalle.id_producto || Number(detalle.cantidad) < 1)}>
                      {guardando ? "Guardando..." : "Guardar venta"}
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

export default CrearVenta;
