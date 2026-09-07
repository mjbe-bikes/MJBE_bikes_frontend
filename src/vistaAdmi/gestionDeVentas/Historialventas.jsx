import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavVentas from "../../componentes/NavVentas";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001";

const getSaleId = (venta) => venta.id;
const getSaleDate = (venta) => venta.fecha;
const getSaleTotal = (venta) => Number(venta.total ?? 0);
const getClientName = (venta, clientes) => {
  const cliente = clientes.find(
    (item) => Number(item.id_cliente) === Number(venta.id_cliente)
  );

  return cliente ? `${cliente.nombres} ${cliente.apellidos}` : `Cliente #${venta.id_cliente}`;
};

const formatCurrency = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(value);

function Historialventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const vendedorId = Number(localStorage.getItem("mjbe_user_id"));

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const [ventasRespuesta, clientesRespuesta] = await Promise.all([
          fetch(`${API_URL}/ventas`),
          fetch(`${API_URL}/clientes`)
        ]);
        if (!ventasRespuesta.ok || !clientesRespuesta.ok) {
          throw new Error("No se pudieron cargar las ventas y clientes");
        }

        const data = await ventasRespuesta.json();
        setClientes(await clientesRespuesta.json());
        const ventasDelVendedor = data.filter((venta) => {
          const id = venta.id_vendedor;
          return Number.isNaN(vendedorId) || Number(id) === vendedorId;
        });
        setVentas(ventasDelVendedor);
      } catch (loadError) {
        console.error("Error cargando historial:", loadError);
        setError("No fue posible cargar el historial de ventas.");
      } finally {
        setCargando(false);
      }
    };

    cargarVentas();
  }, [vendedorId]);

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = `${getSaleId(venta)} ${getClientName(venta, clientes)} ${venta.estado ?? ""}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="app">
      <NavVentas />
      <main className="contenido">
        <div className="container mt-4 py-3">
          <div className="card shadow">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Ventas</h4>
              <Link to="/CrearVenta" className="btn btn-light">
                Crear venta
              </Link>
            </div>

            <div className="card-body">
              <div className="row mb-4 g-2">
                <div className="col-md-8">
                  <label className="form-label" htmlFor="buscar-venta">Buscar venta</label>
                  <input
                    id="buscar-venta"
                    type="search"
                    className="form-control"
                    placeholder="ID, cliente o estado"
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
                <div className="alert alert-info">No hay ventas registradas para este vendedor.</div>
              )}

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID de la venta</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr><td colSpan="5" className="text-center">Cargando ventas...</td></tr>
                    ) : ventasFiltradas.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">No se encontraron ventas</td></tr>
                    ) : (
                      ventasFiltradas.map((venta) => (
                        <tr key={getSaleId(venta)}>
                          <td>{getSaleId(venta)}</td>
                          <td>{getClientName(venta, clientes)}</td>
                          <td>{getSaleDate(venta) ? new Date(getSaleDate(venta)).toLocaleDateString("es-CO") : "Sin fecha"}</td>
                          <td>{formatCurrency(getSaleTotal(venta))}</td>
                          <td>
                            <Link className="btn btn-primary btn-sm" to={`/InformacionVenta/${getSaleId(venta)}`}>
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

export default Historialventas;
