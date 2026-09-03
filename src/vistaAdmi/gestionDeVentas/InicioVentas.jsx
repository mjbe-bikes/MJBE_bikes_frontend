import { useEffect, useState } from "react";

import NavVentas from "../../componentes/NavVentas";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001";

const getSaleTotal = (venta) => Number(venta.total ?? 0);
const getSaleDate = (venta) => venta.fecha;
const getSellerId = (venta) => venta.id_vendedor;

const formatCurrency = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(value);

const isToday = (date) => date && new Date(date).toDateString() === new Date().toDateString();

function InicioVentas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [stats, setStats] = useState({ total: 0, completadas: 0, ingresos: 0, hoy: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const vendedorId = Number(localStorage.getItem("mjbe_user_id"));
  const vendedor = localStorage.getItem("mjbe_user_login") || "Vendedor";

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [ventasRespuesta, clientesRespuesta] = await Promise.all([
          fetch(`${API_URL}/ventas`),
          fetch(`${API_URL}/clientes`)
        ]);
        if (!ventasRespuesta.ok || !clientesRespuesta.ok) throw new Error("No se pudieron cargar las ventas");

        const todasLasVentas = await ventasRespuesta.json();
        const clientesData = await clientesRespuesta.json();
        const ventasDelVendedor = todasLasVentas.filter((venta) => Number(getSellerId(venta)) === vendedorId);
        const completadas = ventasDelVendedor.filter((venta) => Number(getSaleTotal(venta)) > 0);

        setClientes(clientesData);
        setVentas(ventasDelVendedor.slice(-5).reverse());
        setStats({
          total: ventasDelVendedor.length,
          completadas: completadas.length,
          ingresos: completadas.reduce((total, venta) => total + getSaleTotal(venta), 0),
          hoy: ventasDelVendedor.filter((venta) => isToday(getSaleDate(venta))).length
        });
      } catch (loadError) {
        console.error("Error cargando inicio de ventas:", loadError);
        setError("No fue posible cargar las estadísticas de ventas.");
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, [vendedorId]);

  const nombreCliente = (venta) => {
    const cliente = clientes.find((item) => Number(item.id_cliente) === Number(venta.id_cliente));
    return cliente ? `${cliente.nombres} ${cliente.apellidos}` : `Cliente #${venta.id_cliente}`;
  };

  return (
    <div className="app">
      <NavVentas />
      <main className="container-fluid py-4 contenido">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Inicio de ventas</h2>
              <p className="text-muted mb-0">Resumen del vendedor {vendedor}</p>
            </div>
            <span className="badge bg-success fs-6 mt-2 mt-md-0">Panel del vendedor</span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {!cargando && !error && ventas.length === 0 && <div className="alert alert-info">No hay ventas registradas para este vendedor.</div>}

          <div className="row g-4 mb-4">
            <div className="col-lg-3 col-md-6"><div className="card border-primary shadow-sm h-100"><div className="card-body text-center"><h6 className="text-muted">Ventas realizadas</h6><h2>{stats.total}</h2></div></div></div>
            <div className="col-lg-3 col-md-6"><div className="card border-success shadow-sm h-100"><div className="card-body text-center"><h6 className="text-muted">Ventas completadas</h6><h2>{stats.completadas}</h2></div></div></div>
            <div className="col-lg-3 col-md-6"><div className="card border-info shadow-sm h-100"><div className="card-body text-center"><h6 className="text-muted">Ingresos generados</h6><h2 className="fs-4">{formatCurrency(stats.ingresos)}</h2></div></div></div>
            <div className="col-lg-3 col-md-6"><div className="card border-dark shadow-sm h-100"><div className="card-body text-center"><h6 className="text-muted">Ventas de hoy</h6><h2>{stats.hoy}</h2></div></div></div>
          </div>

          <div className="card shadow">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Ventas recientes</h4>
              <a className="btn btn-light" href="/Historialventas">Ver historial</a>
            </div>
            <div className="card-body">
              {cargando ? <p className="mb-0">Cargando ventas...</p> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead><tr><th>Venta</th><th>Cliente</th><th>Fecha</th><th className="text-end">Total</th></tr></thead>
                    <tbody>{ventas.length === 0 ? <tr><td colSpan="4" className="text-center text-muted">Sin ventas recientes</td></tr> : ventas.map((venta) => <tr key={venta.id}><td>#{venta.id}</td><td>{nombreCliente(venta)}</td><td>{getSaleDate(venta) ? new Date(getSaleDate(venta)).toLocaleDateString("es-CO") : "Sin fecha"}</td><td className="text-end">{formatCurrency(getSaleTotal(venta))}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <FooterAdmi />
    </div>
  );
}

export default InicioVentas;
