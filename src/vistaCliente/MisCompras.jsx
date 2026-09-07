import { useEffect, useState } from "react";
import NavarCliente from "../componentes/NavarCliente";

function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = Number(localStorage.getItem("mjbe_user_id"));

  useEffect(() => {
    const cargarCompras = async () => {
      try {
        const response = await fetch(`http://localhost:3001/ventas?user_id=${userId}`);
        if (!response.ok) throw new Error("No se pudieron cargar las commpras");

        const data = await response.json();
        setCompras(data.sort((compraA, compraB) => new Date(compraB.fecha) - new Date(compraA.fecha)));
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

        {loading && <p>Cargando tus compras...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && compras.length === 0 && (
          <div className="alert alert-info">Aún no tienes compras registradas.</div>
        )}

        <div className="row g-4">
          {compras.map((compra) => (
            <div className="col-12" key={compra.id}>
              <article className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>Compra #{compra.id}</strong>
                  <span className="badge bg-success">{compra.estado}</span>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-3">
                    {new Date(compra.fecha).toLocaleString("es-CO")} · Pago: {compra.metodo_pago}
                  </p>
                  {compra.productos.map((producto) => (
                    <div className="d-flex justify-content-between border-bottom py-2" key={producto.id}>
                      <span>{producto.nombre_producto} x {producto.cantidad}</span>
                      <strong>${(Number(producto.valor_unitario) * producto.cantidad).toLocaleString("es-CO")}</strong>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between fw-bold mt-3">
                    <span>Total</span>
                    <span>${Number(compra.total).toLocaleString("es-CO")}</span>
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