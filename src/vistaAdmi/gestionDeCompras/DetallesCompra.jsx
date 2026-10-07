// Detalle de una compra (admin)

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

// Formatea los valores como pesos colombianos
const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

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
        // Obtenemos el JWT guardado al iniciar sesión
        const token = localStorage.getItem("mjbe_token");

        // Si no existe el token, no intentamos acceder a las rutas protegidas
        if (!token) {
          throw new Error(
            "No se encontró el token de sesión. Inicie sesión nuevamente."
          );
        }

        // Cargamos la compra, sus detalles, proveedores y productos
        const respuestas = await Promise.all([
          fetch(
            `${API_URL}/compras/${encodeURIComponent(id_compra)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
              }
            }
          ),

          fetch(
            `${API_URL}/detalles_compra?id_compra=${encodeURIComponent(
              id_compra
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
              }
            }
          ),

          fetch(`${API_URL}/proveedores`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }),

          fetch(`${API_URL}/productos`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          })
        ]);

        // Verificamos que todas las peticiones hayan funcionado
        if (respuestas.some((respuesta) => !respuesta.ok)) {
          throw new Error(
            "No se pudo cargar el detalle de la compra"
          );
        }

        const [
          compraData,
          detallesData,
          proveedoresData,
          productosData
        ] = await Promise.all(
          respuestas.map((respuesta) =>
            respuesta.json()
          )
        );

        setCompra(compraData);
        setDetalles(detallesData);
        setProductos(productosData);

        // Buscamos el proveedor correspondiente a la compra
        const proveedorEncontrado =
          proveedoresData.find(
            (item) =>
              Number(item.id) ===
              Number(compraData.id_proveedor)
          );

        setProveedor(proveedorEncontrado ?? null);

      } catch (loadError) {
        console.error(
          "Error cargando detalle:",
          loadError
        );

        setError(
          "No fue posible cargar el detalle de la compra."
        );
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

              <h3 className="mb-0">
                Detalle de compra #{id_compra}
              </h3>

              <Link
                className="btn btn-light"
                to="/compras"
              >
                Volver
              </Link>

            </div>

            <div className="card-body p-4">

              {/* Estado de carga */}
              {cargando && (
                <p>
                  Cargando detalle...
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {/* Información de la compra */}
              {!cargando &&
                !error &&
                compra && (
                  <>
                    <div className="row g-4 mb-4">

                      {/* Proveedor */}
                      <div className="col-md-3">
                        <strong>
                          Proveedor
                        </strong>

                        <p className="mb-0">
                          {proveedor
                            ? proveedor.nombre_proveedor
                            : `Proveedor #${compra.id_proveedor}`}
                        </p>
                      </div>

                      {/* Fecha */}
                      <div className="col-md-3">
                        <strong>
                          Fecha
                        </strong>

                        <p className="mb-0">
                          {compra.fecha
                            ? new Date(
                                compra.fecha
                              ).toLocaleDateString(
                                "es-CO"
                              )
                            : "Sin fecha"}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="col-md-3">
                        <strong>
                          Total
                        </strong>

                        <p className="mb-0">
                          {formatCurrency(
                            compra.total_compra
                          )}
                        </p>
                      </div>

                      {/* Estado */}
                      <div className="col-md-3">
                        <strong>
                          Estado
                        </strong>

                        <p className="mb-0">
                          {compra.pago
                            ? "Pagada"
                            : "Pendiente"}
                        </p>
                      </div>

                    </div>

                    <h5 className="mb-3">
                      Productos de la compra
                    </h5>

                    {/* Cuando la compra no tiene detalles */}
                    {detalles.length === 0 ? (
                      <p className="text-muted">
                        No hay productos asociados.
                      </p>
                    ) : (
                      <div className="table-responsive">

                        <table className="table table-bordered table-hover align-middle">

                          <thead className="table-dark">

                            <tr>
                              <th>
                                Producto
                              </th>

                              <th>
                                Cantidad
                              </th>

                              <th>
                                Precio unitario
                              </th>

                              <th>
                                Subtotal
                              </th>
                            </tr>

                          </thead>

                          <tbody>

                            {detalles.map(
                              (detalle) => {

                                // Buscamos el producto asociado
                                const producto =
                                  productos.find(
                                    (item) =>
                                      Number(
                                        item.id
                                      ) ===
                                      Number(
                                        detalle.id_producto
                                      )
                                  );

                                // Calculamos el subtotal
                                const subtotal =
                                  Number(
                                    detalle.cantidad
                                  ) *
                                  Number(
                                    detalle.precio_unitario_momento
                                  );

                                return (
                                  <tr
                                    key={
                                      detalle.id
                                    }
                                  >

                                    <td>
                                      {producto?.nombre_producto ??
                                        detalle.nombre_producto ??
                                        `Producto #${detalle.id_producto}`}
                                    </td>

                                    <td>
                                      {
                                        detalle.cantidad
                                      }
                                    </td>

                                    <td>
                                      {formatCurrency(
                                        detalle.precio_unitario_momento
                                      )}
                                    </td>

                                    <td>
                                      {formatCurrency(
                                        subtotal
                                      )}
                                    </td>

                                  </tr>
                                );
                              }
                            )}

                          </tbody>

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