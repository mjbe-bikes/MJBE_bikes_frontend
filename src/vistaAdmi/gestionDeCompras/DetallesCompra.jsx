// Detalle de una compra (admin)

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:5000/api";

const formatCurrency = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(value);

function DetallesCompra() {
  const { id_compra } = useParams();
  const [compra, setCompra] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const respuestas = await Promise.all([
          fetch(`${API_URL}/compras/${encodeURIComponent(id_compra)}`),
          fetch(`${API_URL}/detalles_compra?id_compra=${encodeURIComponent(id_compra)}`),
          fetch(`${API_URL}/proveedores`),
          fetch(`${API_URL}/productos`)
        ]);
        if (respuestas.some((respuesta) => !respuesta.ok)) throw new Error("No se pudo cargar el detalle");

        const [compraData, detallesData, proveedoresData, productosData] = await Promise.all(
          respuestas.map((respuesta) => respuesta.json())
        );
        setCompra(compraData);
        setDetalles(detallesData);
        setProveedor(proveedoresData.find((item) => Number(item.id) === Number(compraData.id_proveedor)) ?? null);
        setProductos(productosData);
      } catch (loadError) {
        console.error("Error cargando detalle:", loadError);
        setError("No fue posible cargar el detalle de la compra.");
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id_compra]);

  return (
    <div className="app">
      <NavAdmi />
      <main className="container-fluid py-4 contenido">
        <div className="container">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Detalle de compra #{id_compra}</h3>
              <Link className="btn btn-light" to="/compras">Volver</Link>
            </div>
            <div className="card-body p-4">
              {cargando && <p>Cargando detalle...</p>}
              {error && <div className="alert alert-danger">{error}</div>}
              {!cargando && !error && compra && (
                <>
                  <div className="row g-4 mb-4">
                    <div className="col-md-3"><strong>Proveedor</strong><p className="mb-0">{proveedor ? proveedor.nombre_proveedor : `Proveedor #${compra.id_proveedor}`}</p></div>
                    <div className="col-md-3"><strong>Fecha</strong><p className="mb-0">{compra.fecha ? new Date(compra.fecha).toLocaleDateString("es-CO") : "Sin fecha"}</p></div>
                    <div className="col-md-3"><strong>Total</strong><p className="mb-0">{formatCurrency(compra.total_compra)}</p></div>
                    <div className="col-md-3"><strong>Estado</strong><p className="mb-0">{compra.pago ? "Pagada" : "Pendiente"}</p></div>
                  </div>
                  <h5 className="mb-3">Productos de la compra</h5>
                  {detalles.length === 0 ? <p className="text-muted">No hay productos asociados.</p> : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark"><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
                        <tbody>{detalles.map((detalle) => {
                          const producto = productos.find((item) => Number(item.id) === Number(detalle.id_producto));
                          const subtotal = Number(detalle.cantidad) * Number(detalle.precio_unitario_momento);
                          return <tr key={detalle.id}><td>{producto?.nombre_producto ?? detalle.nombre_producto ?? `Producto #${detalle.id_producto}`}</td><td>{detalle.cantidad}</td><td>{formatCurrency(detalle.precio_unitario_momento)}</td><td>{formatCurrency(subtotal)}</td></tr>;
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

export default DetallesCompra;
