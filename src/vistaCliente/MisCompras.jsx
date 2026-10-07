// Historial de compras del cliente

import { useEffect, useState } from "react";
import NavarCliente from "../componentes/NavarCliente";

// API Laravel
const API_URL = "http://127.0.0.1:8000/api/ventas";

function MisCompras() {
  // ---------------------------------------------------------
  // ESTADOS
  // ---------------------------------------------------------

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ID del usuario guardado al iniciar sesión
  const userId = Number(
    localStorage.getItem("mjbe_user_id")
  );

  // ---------------------------------------------------------
  // CARGAR COMPRAS
  // ---------------------------------------------------------

  useEffect(() => {
    const cargarCompras = async () => {

      // Si no hay usuario logueado, no hacemos la petición
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // ---------------------------------------------------
        // OBTENER TOKEN JWT
        // ---------------------------------------------------

        const token = localStorage.getItem("mjbe_token");

        if (!token) {
          throw new Error(
            "No se encontró el token de sesión. Inicie sesión nuevamente."
          );
        }

        /*
         * Laravel se encarga de buscar:
         *
         * usuarios.id
         *      ↓
         * clientes.usuario_id
         *      ↓
         * ventas.id_cliente
         *
         * De esta manera solo recibimos las compras
         * pertenecientes al usuario actual.
         */

        const response = await fetch(
          `${API_URL}?user_id=${userId}`,
          {
            headers: {
              // JWT necesario para acceder a la ruta protegida
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(
            "No se pudieron cargar las compras"
          );
        }

        const data = await response.json();

        // Ordenar las compras de la más reciente a la más antigua
        data.sort(
          (compraA, compraB) =>
            new Date(compraB.fecha) -
            new Date(compraA.fecha)
        );

        setCompras(data);

      } catch (err) {

        console.error(err);

        setError(
          "No se pudieron cargar tus compras."
        );

      } finally {

        setLoading(false);
      }
    };

    cargarCompras();

  }, [userId]);

  // ---------------------------------------------------------
  // INTERFAZ
  // ---------------------------------------------------------

  return (
    <>
      <NavarCliente />

      <main className="container py-5">

        <h1 className="mb-4">
          Mis compras
        </h1>

        {/* -------------------------------------------------
            USUARIO NO AUTENTICADO
        ------------------------------------------------- */}
        {!userId && (
          <div className="alert alert-warning">
            Debes iniciar sesión para ver tus compras.
          </div>
        )}

        {/* -------------------------------------------------
            CARGANDO COMPRAS
        ------------------------------------------------- */}
        {userId && loading && (
          <p>
            Cargando tus compras...
          </p>
        )}

        {/* -------------------------------------------------
            ERROR
        ------------------------------------------------- */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* -------------------------------------------------
            SIN COMPRAS
        ------------------------------------------------- */}
        {userId &&
          !loading &&
          !error &&
          compras.length === 0 && (
            <div className="alert alert-info">
              Aún no tienes compras registradas.
            </div>
          )}

        {/* -------------------------------------------------
            LISTA DE COMPRAS
        ------------------------------------------------- */}
        <div className="row g-4">

          {compras.map((compra) => (

            <div
              className="col-12"
              key={compra.id}
            >

              <article className="card shadow-sm">

                {/* -------------------------------------------------
                    ENCABEZADO DE LA COMPRA
                ------------------------------------------------- */}
                <div className="card-header d-flex justify-content-between align-items-center">

                  <strong>
                    Compra #{compra.id}
                  </strong>

                  <span className="badge bg-success">
                    {compra.estado}
                  </span>

                </div>

                {/* -------------------------------------------------
                    CONTENIDO DE LA COMPRA
                ------------------------------------------------- */}
                <div className="card-body">

                  {/* FECHA Y MÉTODO DE PAGO */}
                  <p className="text-muted mb-3">

                    {compra.fecha
                      ? new Date(
                          compra.fecha
                        ).toLocaleString("es-CO")
                      : "Sin fecha"
                    }

                    {" · Pago: "}

                    {compra.metodo_pago ||
                      "No especificado"}

                  </p>

                  {/* -------------------------------------------------
                      PRODUCTOS COMPRADOS
                  ------------------------------------------------- */}

                  {Array.isArray(compra.productos) &&
                  compra.productos.length > 0 ? (

                    compra.productos.map((producto) => (

                      <div
                        className="d-flex justify-content-between border-bottom py-2"
                        key={producto.id}
                      >

                        <span>
                          {producto.nombre_producto}
                          {" x "}
                          {producto.cantidad}
                        </span>

                        <strong>
                          $
                          {(
                            Number(
                              producto.valor_unitario || 0
                            ) *
                            Number(
                              producto.cantidad || 0
                            )
                          ).toLocaleString("es-CO")}
                        </strong>

                      </div>

                    ))

                  ) : (

                    <p className="text-muted mb-0">
                      Sin productos asociados.
                    </p>

                  )}

                  {/* -------------------------------------------------
                      TOTAL DE LA COMPRA
                  ------------------------------------------------- */}
                  <div className="d-flex justify-content-between fw-bold mt-3">

                    <span>
                      Total
                    </span>

                    <span>
                      $
                      {Number(
                        compra.total || 0
                      ).toLocaleString("es-CO")}
                    </span>

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