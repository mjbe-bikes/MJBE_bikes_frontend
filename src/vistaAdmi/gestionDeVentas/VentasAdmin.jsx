// Todas las ventas del administrador (rol 1)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

// =========================================================
// OBTENER NOMBRE DEL VENDEDOR
// =========================================================
// La API puede devolver:
// 1. vendedor como texto
// 2. vendedor como objeto Usuario
//
// Cuando llega como objeto, tomamos únicamente el campo
// "login" para evitar que React intente renderizar todo
// el objeto directamente.
const nombreVendedor = (venta) => {
  // Si vendedor es un objeto, obtenemos su login.
  if (
    venta.vendedor &&
    typeof venta.vendedor === "object"
  ) {
    return (
      venta.vendedor.login ||
      `Vendedor #${venta.id_vendedor}`
    );
  }

  // Si vendedor ya viene como texto, lo mostramos.
  if (venta.vendedor) {
    return venta.vendedor;
  }

  // Si no existe el vendedor, mostramos su ID.
  return `Vendedor #${venta.id_vendedor}`;
};


// =========================================================
// OBTENER NOMBRE DEL CLIENTE
// =========================================================
// La API puede devolver:
// 1. cliente como texto
// 2. cliente como objeto Cliente
//
// Cuando llega como objeto, construimos el nombre completo
// usando "nombres" y "apellidos".
const nombreCliente = (venta) => {
  // Si cliente es un objeto, obtenemos nombres y apellidos.
  if (
    venta.cliente &&
    typeof venta.cliente === "object"
  ) {
    const nombres = venta.cliente.nombres || "";
    const apellidos = venta.cliente.apellidos || "";

    // Unimos los dos campos para mostrar el nombre completo.
    const nombreCompleto = `${nombres} ${apellidos}`.trim();

    return (
      nombreCompleto ||
      `Cliente #${venta.id_cliente}`
    );
  }

  // Si cliente ya viene como texto, lo mostramos directamente.
  if (venta.cliente) {
    return venta.cliente;
  }

  // Si no existe información del cliente, mostramos su ID.
  return `Cliente #${venta.id_cliente}`;
};


// =========================================================
// FORMATEAR VALORES MONETARIOS
// =========================================================
// Convierte el valor recibido de la API a pesos colombianos.
const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));


function VentasAdmin() {
  // Guarda todas las ventas obtenidas desde Laravel.
  const [ventas, setVentas] = useState([]);

  // Guarda el texto introducido en el buscador.
  const [busqueda, setBusqueda] = useState("");

  // Controla el estado de carga de la petición.
  const [cargando, setCargando] = useState(true);

  // Guarda posibles mensajes de error.
  const [error, setError] = useState("");


  // =========================================================
  // CARGAR VENTAS
  // =========================================================
  useEffect(() => {
    const cargarVentas = async () => {
      try {
        // Obtener el JWT guardado durante el inicio de sesión.
        const token = localStorage.getItem("mjbe_token");

        // Si no existe el token, no podemos acceder
        // a la ruta protegida de ventas.
        if (!token) {
          throw new Error(
            "No se encontró el token de sesión. Inicie sesión nuevamente."
          );
        }

        // Solicitud GET al endpoint de ventas de Laravel.
        const respuesta = await fetch(`${API_URL}/ventas`, {
          headers: {
            // JWT necesario para Authenticate:api
            Authorization: `Bearer ${token}`,

            // Indica que esperamos una respuesta JSON.
            Accept: "application/json",
          },
        });

        // Si Laravel devuelve un código diferente a 2xx,
        // consideramos que la petición falló.
        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron cargar las ventas"
          );
        }

        // Convertimos la respuesta de Laravel a JSON.
        const datos = await respuesta.json();

        // La API normalmente devuelve un arreglo de ventas.
        // Esta validación evita guardar un objeto inesperado
        // dentro del estado.
        setVentas(
          Array.isArray(datos)
            ? datos
            : []
        );

      } catch (loadError) {
        // Mostramos el error en consola para depuración.
        console.error(
          "Error cargando ventas:",
          loadError
        );

        // Mostramos un mensaje amigable en la interfaz.
        setError(
          "No fue posible cargar las ventas."
        );

      } finally {
        // La carga termina tanto si hay éxito como si hay error.
        setCargando(false);
      }
    };

    cargarVentas();
  }, []);


  // =========================================================
  // FILTRAR VENTAS
  // =========================================================
  // El filtro utiliza texto, por lo que primero obtenemos
  // vendedor y cliente mediante las funciones anteriores.
  const ventasFiltradas = ventas.filter((venta) => {
    const texto = `
      ${venta.id}
      ${nombreVendedor(venta)}
      ${nombreCliente(venta)}
      ${venta.pago ? "pagada" : "pendiente"}
    `.toLowerCase();

    return texto.includes(
      busqueda.toLowerCase()
    );
  });


  return (
    <div className="app">
      <NavAdmi />

      <main className="contenido">
        <div className="container mt-4 py-3">
          <div className="card shadow">

            {/* =================================================
                ENCABEZADO DE LA VISTA
            ================================================= */}
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                Ventas
              </h4>

              <small>
                Todas las ventas registradas y su vendedor
              </small>
            </div>


            <div className="card-body">

              {/* =================================================
                  BUSCADOR
              ================================================= */}
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
                    placeholder="ID, vendedor, cliente o estado"
                    value={busqueda}
                    onChange={(event) =>
                      setBusqueda(
                        event.target.value
                      )
                    }
                  />
                </div>


                <div className="col-md-4 d-flex align-items-end">

                  {/* El filtro se ejecuta automáticamente
                      mientras el usuario escribe. */}
                  <button
                    className="btn btn-primary w-100"
                    type="button"
                  >
                    Buscar
                  </button>

                </div>
              </div>


              {/* =================================================
                  MENSAJE DE ERROR
              ================================================= */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}


              {/* =================================================
                  MENSAJE CUANDO NO EXISTEN VENTAS
              ================================================= */}
              {!cargando &&
                !error &&
                ventas.length === 0 && (
                  <div className="alert alert-info">
                    No hay ventas registradas.
                  </div>
                )}


              {/* =================================================
                  TABLA DE VENTAS
              ================================================= */}
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

                    {/* =================================================
                        ESTADO DE CARGA
                    ================================================= */}
                    {cargando ? (

                      <tr>
                        <td
                          colSpan="7"
                          className="text-center"
                        >
                          Cargando ventas...
                        </td>
                      </tr>

                    ) : ventasFiltradas.length === 0 ? (

                      /* =================================================
                         CUANDO EL FILTRO NO ENCUENTRA RESULTADOS
                      ================================================= */
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center"
                        >
                          No se encontraron ventas
                        </td>
                      </tr>

                    ) : (

                      /* =================================================
                         MOSTRAR LAS VENTAS
                      ================================================= */
                      ventasFiltradas.map((venta) => (

                        <tr key={venta.id}>

                          {/* ID DE LA VENTA */}
                          <td>
                            {venta.id}
                          </td>


                          {/* =================================================
                              VENDEDOR
                              Aquí ya no mostramos el objeto directamente.
                              nombreVendedor() extrae su login.
                          ================================================= */}
                          <td>
                            {nombreVendedor(venta)}
                          </td>


                          {/* =================================================
                              CLIENTE
                              Aquí ya no mostramos el objeto directamente.
                              nombreCliente() construye nombres + apellidos.
                          ================================================= */}
                          <td>
                            {nombreCliente(venta)}
                          </td>


                          {/* FECHA */}
                          <td>
                            {venta.fecha
                              ? new Date(
                                  venta.fecha
                                ).toLocaleDateString(
                                  "es-CO"
                                )
                              : "Sin fecha"}
                          </td>


                          {/* TOTAL */}
                          <td>
                            {formatCurrency(
                              venta.total
                            )}
                          </td>


                          {/* =================================================
                              ESTADO DE LA VENTA
                              Se toma el campo "pago" de la BD.
                          ================================================= */}
                          <td>
                            <span
                              className={`badge ${
                                venta.pago
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {venta.pago
                                ? "Pagada"
                                : "Pendiente"}
                            </span>
                          </td>


                          {/* =================================================
                              DETALLE DE LA VENTA
                              Envía el ID de la venta a la vista
                              de detalles.
                          ================================================= */}
                          <td>
                            <Link
                              className="btn btn-primary btn-sm"
                              to={`/DetallesVenta/${venta.id}`}
                            >
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