// Todas las ventas (admin, rol 1)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:5000/api";

// La API embebe el objeto completo de vendedor/cliente, no un texto.
const nombreVendedor = (venta) => venta.vendedor?.login || `Vendedor #${venta.id_vendedor}`;
const nombreCliente = (venta) => (venta.cliente ? `${venta.cliente.nombres} ${venta.cliente.apellidos}` : `Cliente #${venta.id_cliente}`);

const formatCurrency = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(Number(value ?? 0));

function VentasAdmin() {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/ventas`, { credentials: "include" });
        if (!respuesta.ok) throw new Error("No se pudieron cargar las ventas");
        setVentas(await respuesta.json());
      } catch (loadError) {
        console.error("Error cargando ventas:", loadError);
        setError("No fue posible cargar las ventas.");
      } finally {
        setCargando(false);
      }
    };

    cargarVentas();
  }, []);

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = `${venta.id} ${nombreVendedor(venta)} ${nombreCliente(venta)} ${venta.pago ? "pagada" : "pendiente"}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="app">
      <NavAdmi />
      <main className="contenido">
        <div className="container mt-4 py-3">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Ventas</h4>
              <small>Todas las ventas registradas y su vendedor</small>
            </div>

            <div className="card-body">
              <div className="row mb-4 g-2">
                <div className="col-md-8">
                  <label className="form-label" htmlFor="buscar-venta">Buscar venta</label>
                  <input
                    id="buscar-venta"
                    type="search"
                    className="form-control"
                    placeholder="ID, vendedor, cliente o estado"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button className="btn btn-primary w-100" type="button">
                    Buscar
                  </button>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {!cargando && !error && ventas.length === 0 && (
                <div className="alert alert-info">No hay ventas registradas.</div>
              )}

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Vendedor</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr><td colSpan="7" className="text-center">Cargando ventas...</td></tr>
                    ) : ventasFiltradas.length === 0 ? (
                      <tr><td colSpan="7" className="text-center">No se encontraron ventas</td></tr>
                    ) : (
                      ventasFiltradas.map((venta) => (
                        <tr key={venta.id}>
                          <td>{venta.id}</td>
                          <td>{nombreVendedor(venta)}</td>
                          <td>{nombreCliente(venta)}</td>
                          <td>{venta.fecha ? new Date(venta.fecha).toLocaleDateString("es-CO") : "Sin fecha"}</td>
                          <td>{formatCurrency(venta.total)}</td>
                          <td>
                            <span className={`badge ${venta.pago ? "bg-success" : "bg-secondary"}`}>
                              {venta.pago ? "Pagada" : "Pendiente"}
                            </span>
                          </td>
                          <td>
                            <Link className="btn btn-primary btn-sm" to={`/DetallesVenta/${venta.id}`}>
                              Ver detalle
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterAdmi />
    </div>
  );
}

export default VentasAdmin;
