// Historial y detalle de ventas
// Esta vista permite consultar las ventas del vendedor
// y abrir el detalle completo de una venta.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavVentas from "../../componentes/NavVentas";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

// Formatear valores como pesos colombianos
const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

// Obtener el nombre del cliente desde la lista de clientes
const getClientName = (venta, clientes) => {
  const cliente = clientes.find(
    (item) => Number(item.id) === Number(venta.id_cliente)
  );

  return cliente
    ? `${cliente.nombres} ${cliente.apellidos}`
    : `Cliente #${venta.id_cliente}`;
};

function DetallesVenta() {
  // =========================
  // Estados del historial
  // =========================

  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Estados del detalle
  // =========================

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");

  // ID del vendedor que inició sesión
  const vendedorId = Number(localStorage.getItem("mjbe_user_id"));

  // =========================
  // Cargar historial de ventas
  // =========================

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setCargando(true);
        setError("");

        // Recuperamos el JWT guardado después del login.
        const token = localStorage.getItem("mjbe_token");

        // Header utilizado por las peticiones protegidas de Laravel.
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [ventasRespuesta, clientesRespuesta] = await Promise.all([
          fetch(`${API_URL}/ventas`, {
            headers,
          }),
          fetch(`${API_URL}/clientes`, {
            headers,
          }),
        ]);

        if (!ventasRespuesta.ok || !clientesRespuesta.ok) {
          throw new Error("No se pudieron cargar las ventas y clientes");
        }

        const ventasData = await ventasRespuesta.json();
        const clientesData = await clientesRespuesta.json();

        // Guardar clientes para mostrar sus nombres
        setClientes(clientesData);

        // Mostrar únicamente las ventas realizadas por el vendedor actual
        const ventasDelVendedor = ventasData.filter(
          (venta) => Number(venta.id_vendedor) === vendedorId
        );

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

  // =========================
  // Cargar detalle de una venta
  // =========================

  const verDetalle = async (idVenta) => {
    try {
      setCargandoDetalle(true);
      setErrorDetalle("");
      setVentaSeleccionada(null);

      // Recuperamos el JWT guardado después del login.
      const token = localStorage.getItem("mjbe_token");

      // El endpoint /ventas/{id} ya devuelve:
      // cliente, vendedor, productos y detalles.
      const respuesta = await fetch(`${API_URL}/ventas/${idVenta}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!respuesta.ok) {
        throw new Error("No se encontró la venta");
      }

      const datos = await respuesta.json();

      setVentaSeleccionada(datos);
    } catch (loadError) {
      console.error("Error cargando detalle:", loadError);
      setErrorDetalle("No fue posible cargar el detalle de la venta.");
    } finally {
      setCargandoDetalle(false);
    }
  };

  // =========================
  // Volver al historial
  // =========================

  const cerrarDetalle = () => {
    setVentaSeleccionada(null);
    setErrorDetalle("");
  };

  // =========================
  // Filtrar ventas
  // =========================

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = `
      ${venta.id}
      ${getClientName(venta, clientes)}
      ${venta.estado ?? ""}
    `.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="app">
      <NavVentas />

      <main className="contenido">
        <div className="container mt-4 py-3">

          {/* ==================================================
              HISTORIAL DE VENTAS
          ================================================== */}

          {!ventaSeleccionada && (
            <div className="card shadow">
              <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Detalles de ventas</h4>

                <Link to="/CrearVenta" className="btn btn-light">
                  Crear venta
                </Link>
              </div>

              <div className="card-body">

                {/* Buscador */}
                <div className="row mb-4 g-2">
                  <div className="col-md-8">
                    <label
                      className="form-label"
                      htmlFor="buscar-venta"
                    >
                      Buscar venta
                    </label>

                    <input
                      id="buscar-venta"
                      type="search"
                      className="form-control"
                      placeholder="ID, cliente o estado"
                      value={busqueda}
                      onChange={(event) =>
                        setBusqueda(event.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      className="btn btn-primary w-100"
                      type="button"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                {/* Sin ventas */}
                {!cargando && !error && ventas.length === 0 && (
                  <div className="alert alert-info">
                    No hay ventas registradas para este vendedor.
                  </div>
                )}

                {/* Tabla de ventas */}
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
                        <tr>
                          <td colSpan="5" className="text-center">
                            Cargando ventas...
                          </td>
                        </tr>
                      ) : ventasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No se encontraron ventas
                          </td>
                        </tr>
                      ) : (
                        ventasFiltradas.map((venta) => (
                          <tr key={venta.id}>

                            <td>
                              {venta.id}
                            </td>

                            <td>
                              {getClientName(venta, clientes)}
                            </td>

                            <td>
                              {venta.fecha
                                ? new Date(
                                    venta.fecha
                                  ).toLocaleDateString("es-CO")
                                : "Sin fecha"}
                            </td>

                            <td>
                              {formatCurrency(venta.total)}
                            </td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  verDetalle(venta.id)
                                }
                              >
                                Ver detalle
                              </button>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              DETALLE DE UNA VENTA
          ================================================== */}

          {ventaSeleccionada && (
            <div className="card shadow border-0 rounded-4">

              {/* Encabezado */}
              <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                <h4 className="mb-0">
                  Detalle de venta #{ventaSeleccionada.id}
                </h4>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={cerrarDetalle}
                >
                  Volver
                </button>

              </div>

              <div className="card-body p-4">

                {/* Cargando detalle */}
                {cargandoDetalle && (
                  <p>Cargando detalle...</p>
                )}

                {/* Error del detalle */}
                {errorDetalle && (
                  <div className="alert alert-danger">
                    {errorDetalle}
                  </div>
                )}

                {!cargandoDetalle && !errorDetalle && (
                  <>

                    {/* ==========================================
                        INFORMACIÓN GENERAL
                    ========================================== */}

                    <div className="row g-4 mb-4">

                      <div className="col-md-4">
                        <strong>Cliente</strong>

                        <p className="mb-0">
                          {ventaSeleccionada.cliente
                            ? `${ventaSeleccionada.cliente.nombres} ${ventaSeleccionada.cliente.apellidos}`
                            : getClientName(
                                ventaSeleccionada,
                                clientes
                              )}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <strong>Fecha</strong>

                        <p className="mb-0">
                          {ventaSeleccionada.fecha
                            ? new Date(
                                ventaSeleccionada.fecha
                              ).toLocaleDateString("es-CO")
                            : "Sin fecha"}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <strong>Total</strong>

                        <p className="mb-0">
                          {formatCurrency(
                            ventaSeleccionada.total
                          )}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <strong>Estado</strong>

                        <p className="mb-0">
                          {ventaSeleccionada.estado ?? "Pendiente"}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <strong>Pago</strong>

                        <p className="mb-0">
                          {ventaSeleccionada.pago
                            ? "Pagado"
                            : "Pendiente"}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <strong>Vendedor</strong>

                        <p className="mb-0">
                          {ventaSeleccionada.vendedor?.login ??
                            `Usuario #${ventaSeleccionada.id_vendedor}`}
                        </p>
                      </div>

                    </div>

                    {/* ==========================================
                        PRODUCTOS
                    ========================================== */}

                    <h5 className="mb-3">
                      Productos de la venta
                    </h5>

                    {!ventaSeleccionada.productos ||
                    ventaSeleccionada.productos.length === 0 ? (
                      <p className="text-muted">
                        No hay productos asociados a esta venta.
                      </p>
                    ) : (
                      <div className="table-responsive">

                        <table className="table table-bordered table-hover align-middle">

                          <thead className="table-dark">
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio unitario</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>

                          <tbody>
                            {ventaSeleccionada.productos.map(
                              (producto, index) => (
                                <tr
                                  key={
                                    producto.id ??
                                    producto.id_producto ??
                                    index
                                  }
                                >

                                  <td>
                                    {producto.nombre_producto ??
                                      `Producto #${producto.id_producto}`}
                                  </td>

                                  <td>
                                    {producto.cantidad}
                                  </td>

                                  <td>
                                    {formatCurrency(
                                      producto.valor_unitario ??
                                        producto.precio_unitario_momento
                                    )}
                                  </td>

                                  <td>
                                    {formatCurrency(
                                      producto.subtotal ??
                                        Number(
                                          producto.cantidad
                                        ) *
                                          Number(
                                            producto.valor_unitario ??
                                              producto.precio_unitario_momento ??
                                              0
                                          )
                                    )}
                                  </td>

                                </tr>
                              )
                            )}
                          </tbody>

                        </table>
                      </div>
                    )}

                    {/* ==========================================
                        TOTAL
                    ========================================== */}

                    <div className="text-end mt-4">

                      <h4>
                        Total:{" "}
                        {formatCurrency(
                          ventaSeleccionada.total
                        )}
                      </h4>

                    </div>

                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <FooterAdmi />
    </div>
  );
}

export default DetallesVenta;

