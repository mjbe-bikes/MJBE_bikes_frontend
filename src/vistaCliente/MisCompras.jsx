// Historial de compras del cliente (usa las rutas de ventas)

import { useEffect, useState } from "react";
import NavarCliente from "../componentes/NavarCliente";

const API_URL = "http://localhost:5000/api/ventas";

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
        // Se usan las rutas de ventas, filtradas por el usuario logueado.
        // La API ya incluye "productos" (detalle formateado) en cada venta.
        const respuestaVentas = await fetch(`${API_URL}?user_id=${userId}`, { credentials: "include" });
        if (!respuestaVentas.ok) throw new Error("No se pudieron cargar las compras");

        const ventas = await respuestaVentas.json();

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
                        key={detalle.id_producto}
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
