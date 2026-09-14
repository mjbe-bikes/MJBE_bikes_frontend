// Listado de compras (admin)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:5000/api";

const getPurchaseId = (compra) => compra.id;
const getPurchaseDate = (compra) => compra.fecha;
const getPurchaseTotal = (compra) => Number(compra.total_compra ?? 0);
const getProviderName = (compra, proveedores) => {
  if (compra.proveedor) return compra.proveedor;

  const proveedor = proveedores.find(
    (item) => Number(item.id) === Number(compra.id_proveedor)
  );

  return proveedor ? proveedor.nombre_proveedor : `Proveedor #${compra.id_proveedor}`;
};

const formatCurrency = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(value);

function VerCompra() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCompras = async () => {
      try {
        const [comprasRespuesta, proveedoresRespuesta] = await Promise.all([
          fetch(`${API_URL}/compras`),
          fetch(`${API_URL}/proveedores`)
        ]);
        if (!comprasRespuesta.ok || !proveedoresRespuesta.ok) {
          throw new Error("No se pudieron cargar las compras y proveedores");
        }

        setCompras(await comprasRespuesta.json());
        setProveedores(await proveedoresRespuesta.json());
      } catch (loadError) {
        console.error("Error cargando compras:", loadError);
        setError("No fue posible cargar el historial de compras.");
      } finally {
        setCargando(false);
      }
    };

    cargarCompras();
  }, []);

  const comprasFiltradas = compras.filter((compra) => {
    const texto = `${getPurchaseId(compra)} ${getProviderName(compra, proveedores)} ${compra.pago ? "pagada" : "pendiente"}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="app">
      <NavAdmi />
      <main className="contenido">
        <div className="container mt-4 py-3">
          <div className="card shadow">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Compras</h4>
              <Link to="/CrearCompra" className="btn btn-light">
                Crear compra
              </Link>
            </div>

            <div className="card-body">
              <div className="row mb-4 g-2">
                <div className="col-md-8">
                  <label className="form-label" htmlFor="buscar-compra">Buscar compra</label>
                  <input
                    id="buscar-compra"
                    type="search"
                    className="form-control"
                    placeholder="ID, proveedor o estado"
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
              {!cargando && !error && compras.length === 0 && (
                <div className="alert alert-info">No hay compras registradas.</div>
              )}

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID de la compra</th>
                      <th>Proveedor</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr><td colSpan="6" className="text-center">Cargando compras...</td></tr>
                    ) : comprasFiltradas.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No se encontraron compras</td></tr>
                    ) : (
                      comprasFiltradas.map((compra) => (
                        <tr key={getPurchaseId(compra)}>
                          <td>{getPurchaseId(compra)}</td>
                          <td>{getProviderName(compra, proveedores)}</td>
                          <td>{getPurchaseDate(compra) ? new Date(getPurchaseDate(compra)).toLocaleDateString("es-CO") : "Sin fecha"}</td>
                          <td>{formatCurrency(getPurchaseTotal(compra))}</td>
                          <td>
                            <span className={`badge ${compra.pago ? "bg-success" : "bg-secondary"}`}>
                              {compra.pago ? "Pagada" : "Pendiente"}
                            </span>
                          </td>
                          <td>
                            <Link className="btn btn-primary btn-sm" to={`/DetallesCompra/${getPurchaseId(compra)}`}>
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

export default VerCompra;
