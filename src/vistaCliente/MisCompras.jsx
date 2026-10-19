// Historial de compras del cliente (usa las rutas de ventas)

import { useEffect, useState } from "react";
import NavarCliente from "../componentes/NavarCliente";

const API_URL = "http://localhost:5000/api/ventas";
const DETALLES_URL = "http://localhost:5000/api/detalles_venta";

const formatearMoneda = (valor) =>
  `$${Number(valor || 0).toLocaleString("es-CO")}`;

function MisCompras() {
  const userId = Number(localStorage.getItem("mjbe_user_id"));
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const cargarCompras = async () => {
      try {
        // Ventas cuyos clientes pertenecen al usuario logueado
        const respuestaVentas = await fetch(`${API_URL}?comprador=${userId}`, { credentials: "include" });
        if (!respuestaVentas.ok) throw new Error("No se pudieron cargar las compras");

        const ventasBase = await respuestaVentas.json();

        // Los productos de cada venta están en detalles_venta
        const ventas = await Promise.all(
          ventasBase.map(async (venta) => {
            const respuestaDetalles = await fetch(
              `${DETALLES_URL}?id_venta=${venta.id}`,
              { credentials: "include" }
            );
            const detalles = respuestaDetalles.ok ? await respuestaDetalles.json() : [];
            return {
              ...venta,
              productos: detalles.map((detalle) => ({
                ...detalle,
                subtotal: Number(detalle.precio_unitario_momento) * Number(detalle.cantidad),
              })),
            };
          })
        );

        ventas.sort(
          (compraA, compraB) => new Date(compraB.fecha) - new Date(compraA.fecha)
        );
        setCompras(ventas);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus compras.");
      } finally {
        setLoading(false);
      }
    };

    cargarCompras();
  }, [userId]);

  return (
    <>
      <NavarCliente />
      <main className="container py-5">
        <h1 className="mb-4">Mis compras</h1>

        {!userId && (
          <div className="alert alert-warning">
            Debes iniciar sesión para ver tus compras.
          </div>
        )}
        {userId && loading && <p>Cargando tus compras...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {userId && !loading && !error && compras.length === 0 && (
          <div className="alert alert-info">Aún no tienes compras registradas.</div>
        )}

        <div className="row g-4">
          {compras.map((compra) => (
            <div className="col-12" key={compra.id}>
              <article className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>Compra #{compra.id}</strong>
                  <span className={`badge ${compra.pago ? "bg-success" : "bg-secondary"}`}>
                    {compra.pago ? "Pagada" : "Pendiente"}
                  </span>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-3">
                    {compra.fecha
                      ? new Date(compra.fecha).toLocaleString("es-CO")
                      : "Sin fecha"}
                  </p>

                  {compra.productos.length === 0 ? (
                    <p className="text-muted mb-0">Sin productos asociados.</p>
                  ) : (
                    compra.productos.map((detalle) => (
                      <div
                        className="d-flex justify-content-between border-bottom py-2"
                        key={detalle.id}
                      >
                        <span>
                          {detalle.nombre_producto || `Producto #${detalle.id_producto}`} x{" "}
                          {detalle.cantidad}
                        </span>
                        <strong>
                          {formatearMoneda(detalle.subtotal)}
                        </strong>
                      </div>
                    ))
                  )}

                  <div className="d-flex justify-content-between fw-bold mt-3">
                    <span>Total</span>
                    <span>{formatearMoneda(compra.total)}</span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default MisCompras;
