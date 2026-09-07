import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import NavVentas from "../../componentes/NavVentas";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001";

const formatCurrency = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(value);

function InformacionVenta() {
  const { id_venta } = useParams();
  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const respuestas = await Promise.all([
          fetch(`${API_URL}/ventas/${encodeURIComponent(id_venta)}`),
          fetch(`${API_URL}/detalles_venta?id_venta=${encodeURIComponent(id_venta)}`),
          fetch(`${API_URL}/clientes`),
          fetch(`${API_URL}/productos`)
        ]);
        if (respuestas.some((respuesta) => !respuesta.ok)) throw new Error("No se pudo cargar el detalle");

        const [ventaData, detallesData, clientesData, productosData] = await Promise.all(
          respuestas.map((respuesta) => respuesta.json())
        );
        setVenta(ventaData);
        setDetalles(detallesData);
        setCliente(clientesData.find((item) => Number(item.id_cliente) === Number(ventaData.id_cliente)) ?? null);
        setProductos(productosData);
      } catch (loadError) {
        console.error("Error cargando detalle:", loadError);
        setError("No fue posible cargar el detalle de la venta.");
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id_venta]);

  return (
    <div className="app">
      <NavVentas />
      <main className="container-fluid py-4 contenido">
        <div className="container">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Detalle de venta #{id_venta}</h3>
              <Link className="btn btn-light" to="/Historialventas">Volver</Link>
            </div>
            <div className="card-body p-4">
              {cargando && <p>Cargando detalle...</p>}
              {error && <div className="alert alert-danger">{error}</div>}
              {!cargando && !error && venta && (
                <>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4"><strong>Cliente</strong><p className="mb-0">{cliente ? `${cliente.nombres} ${cliente.apellidos}` : `Cliente #${venta.id_cliente}`}</p></div>
                    <div className="col-md-4"><strong>Fecha</strong><p className="mb-0">{new Date(venta.fecha).toLocaleDateString("es-CO")}</p></div>
                    <div className="col-md-4"><strong>Total</strong><p className="mb-0">{formatCurrency(venta.total)}</p></div>
                  </div>
                  <h5 className="mb-3">Productos de la venta</h5>
                  {detalles.length === 0 ? <p className="text-muted">No hay productos asociados.</p> : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark"><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
                        <tbody>{detalles.map((detalle) => {
                          const producto = productos.find((item) => Number(item.id) === Number(detalle.id_producto));
                          const subtotal = Number(detalle.cantidad) * Number(detalle.precio_unitario_momento);
                          return <tr key={detalle.id}><td>{producto?.nombre_producto ?? `Producto #${detalle.id_producto}`}</td><td>{detalle.cantidad}</td><td>{formatCurrency(detalle.precio_unitario_momento)}</td><td>{formatCurrency(subtotal)}</td></tr>;
                        })}</tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <FooterAdmi />
    </div>
  );
}

export default InformacionVenta;
