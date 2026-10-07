// Registrar una venta (vendedor)

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavVentas from "../../componentes/NavVentas";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

const initialForm = {
  id_cliente: "",
  fecha: new Date().toISOString().slice(0, 10)
};

function CrearVenta() {
  const [form, setForm] = useState(initialForm);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([
    { id_producto: "", cantidad: "1" }
  ]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const navigate = useNavigate();

  // =========================================================
  // Cargar clientes y productos desde Laravel
  // =========================================================

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener el JWT guardado al iniciar sesión
        const token = localStorage.getItem("mjbe_token");

        // Headers que se enviarán a las rutas protegidas
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        };

        const [clientesRespuesta, productosRespuesta] =
          await Promise.all([
            fetch(`${API_URL}/clientes`, {
              headers
            }),
            fetch(`${API_URL}/productos`, {
              headers
            })
          ]);

        if (!clientesRespuesta.ok || !productosRespuesta.ok) {
          throw new Error("No se pudieron cargar los datos");
        }

        const clientesData = await clientesRespuesta.json();
        const productosData = await productosRespuesta.json();

        setClientes(clientesData);
        setProductos(productosData);
      } catch (error) {
        console.error("Error cargando datos de venta:", error);
        alert("No se pudieron cargar clientes y productos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // =========================================================
  // Productos disponibles
  // =========================================================

  const productosDisponibles = productos.filter(
    (producto) =>
      producto.estado?.toLowerCase() === "activo" &&
      Number(producto.cant_producto) > 0
  );

  // =========================================================
  // Calcular total de la venta
  // =========================================================

  const total = detalles.reduce((suma, detalle) => {
    const producto = productos.find(
      (item) =>
        String(item.id) === String(detalle.id_producto)
    );

    return (
      suma +
      (Number(detalle.cantidad) || 0) *
        Number(producto?.valor_unitario || 0)
    );
  }, 0);

  // =========================================================
  // Cambiar datos generales de la venta
  // =========================================================

  const handleChange = (event) => {
    setForm((actual) => ({
      ...actual,
      [event.target.name]: event.target.value
    }));
  };

  // =========================================================
  // Cambiar un producto de la venta
  // =========================================================

  const handleDetalleChange = (index, event) => {
    setDetalles((actuales) =>
      actuales.map((detalle, detalleIndex) =>
        detalleIndex === index
          ? {
              ...detalle,
              [event.target.name]: event.target.value
            }
          : detalle
      )
    );
  };

  // =========================================================
  // Agregar otro producto
  // =========================================================

  const agregarProducto = () => {
    setDetalles((actuales) => [
      ...actuales,
      {
        id_producto: "",
        cantidad: "1"
      }
    ]);
  };

  // =========================================================
  // Quitar producto
  // =========================================================

  const quitarProducto = (index) => {
    setDetalles((actuales) =>
      actuales.filter(
        (_, detalleIndex) => detalleIndex !== index
      )
    );
  };

  // =========================================================
  // Guardar venta
  // =========================================================

  const guardarVenta = async (event) => {
    event.preventDefault();

    setGuardando(true);

    try {
      // =====================================================
      // Obtener el token JWT de la sesión
      // =====================================================

      const token = localStorage.getItem("mjbe_token");

      if (!token) {
        throw new Error(
          "No se encontró el token de sesión. Inicie sesión nuevamente."
        );
      }

      // ID del usuario vendedor que inició sesión
      const vendedorId = Number(
        localStorage.getItem("mjbe_user_id")
      );

      if (!vendedorId) {
        throw new Error(
          "No se encontró el usuario vendedor en la sesión"
        );
      }

      // Buscar el cliente seleccionado
      const clienteSeleccionado = clientes.find(
        (cliente) =>
          Number(cliente.id) === Number(form.id_cliente)
      );

      if (!clienteSeleccionado) {
        throw new Error("Debe seleccionar un cliente válido");
      }

      // Validar que todos los productos tengan información
      const detallesValidos = detalles.every(
        (detalle) =>
          detalle.id_producto &&
          Number(detalle.cantidad) > 0
      );

      if (!detallesValidos) {
        throw new Error(
          "Todos los productos deben tener una cantidad válida"
        );
      }

      // =====================================================
      // Crear la venta
      //
      // Estos son los nombres reales de las columnas
      // que espera nuestro VentaController de Laravel.
      // =====================================================

      const venta = {
        id_vendedor: vendedorId,
        id_cliente: Number(form.id_cliente),
        fecha: form.fecha,
        total: Number(total),
        pago: true
      };

      // Enviar la venta a Laravel incluyendo el JWT
      const respuesta = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(venta)
      });

      const datosVenta = await respuesta.json();

      if (!respuesta.ok) {
        console.error("Respuesta de Laravel:", datosVenta);

        throw new Error(
          datosVenta?.mensaje ||
            "No se pudo crear la venta"
        );
      }

      // Laravel devuelve directamente la venta creada.
      //
      // Ejemplo:
      // {
      //   "id": 1,
      //   "id_vendedor": 1,
      //   "id_cliente": 1,
      //   "fecha": "...",
      //   "total": "100.00",
      //   "pago": true
      // }

      const ventaCreada = datosVenta;

      if (!ventaCreada?.id) {
        throw new Error(
          "Laravel creó la venta pero no devolvió su ID"
        );
      }

      // =====================================================
      // Crear los detalles de la venta
      //
      // Cada producto se guarda en detalles_venta y queda
      // relacionado con la venta mediante id_venta.
      // =====================================================

      const respuestasDetalles = await Promise.all(
        detalles.map(async (detalle) => {
          const producto = productos.find(
            (item) =>
              String(item.id) ===
              String(detalle.id_producto)
          );

          return fetch(`${API_URL}/detalles_venta`, {
            method: "POST",
            headers: {
              // El JWT también es necesario para esta ruta
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              id_venta: ventaCreada.id,
              id_producto: Number(detalle.id_producto),
              cantidad: Number(detalle.cantidad),
              precio_unitario_momento: Number(
                producto?.valor_unitario || 0
              )
            })
          });
        })
      );

      // Verificar que todos los detalles hayan sido creados
      if (
        respuestasDetalles.some(
          (respuestaDetalle) => !respuestaDetalle.ok
        )
      ) {
        throw new Error(
          "La venta fue creada, pero no se pudieron crear todos sus detalles"
        );
      }

      // =====================================================
      // Ir al historial/detalles de ventas
      // =====================================================

      navigate("/DetallesVenta");
    } catch (error) {
      console.error("Error creando venta:", error);

      alert(
        error.message ||
          "No se pudo crear la venta"
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // Pantalla de carga
  // =========================================================

  if (cargando) {
    return (
      <p className="text-center mt-5">
        Cargando información...
      </p>
    );
  }

  // =========================================================
  // Interfaz
  // =========================================================

  return (
    <div className="app">

      <NavVentas />

      <main className="container-fluid py-4 contenido">

        <div className="row justify-content-center">

          <div className="col-xl-8 col-lg-9 col-md-12">

            <div className="card shadow border-0 rounded-4">

              {/* Encabezado */}
              <div className="card-header bg-success text-white py-3">

                <h3 className="mb-1">
                  Crear venta
                </h3>

                <small>
                  Complete la información de la venta
                </small>

              </div>

              <div className="card-body p-4">

                <form
                  className="row g-4"
                  onSubmit={guardarVenta}
                >

                  {/* ==========================================
                      CLIENTE
                  ========================================== */}

                  <div className="col-md-6">

                    <label
                      className="form-label fw-semibold"
                      htmlFor="id_cliente"
                    >
                      Cliente
                    </label>

                    <select
                      id="id_cliente"
                      name="id_cliente"
                      className="form-select"
                      value={form.id_cliente}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Seleccione un cliente
                      </option>

                      {clientes.map((cliente) => (
                        <option
                          key={cliente.id}
                          value={cliente.id}
                        >
                          {cliente.nombres}{" "}
                          {cliente.apellidos}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* ==========================================
                      FECHA
                  ========================================== */}

                  <div className="col-md-6">

                    <label
                      className="form-label fw-semibold"
                      htmlFor="fecha"
                    >
                      Fecha
                    </label>

                    <input
                      id="fecha"
                      name="fecha"
                      type="date"
                      className="form-control"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* ==========================================
                      PRODUCTOS
                  ========================================== */}

                  <div className="col-12">

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <label className="form-label fw-semibold mb-0">
                        Productos
                      </label>

                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={agregarProducto}
                      >
                        Agregar producto
                      </button>

                    </div>

                    {detalles.map((detalle, index) => {

                      const producto = productos.find(
                        (item) =>
                          String(item.id) ===
                          String(detalle.id_producto)
                      );

                      return (
                        <div
                          className="row g-2 mb-2"
                          key={`${index}-${detalle.id_producto}`}
                        >

                          {/* Producto */}
                          <div className="col-md-7">

                            <select
                              name="id_producto"
                              className="form-select"
                              value={detalle.id_producto}
                              onChange={(event) =>
                                handleDetalleChange(
                                  index,
                                  event
                                )
                              }
                              required
                            >

                              <option value="">
                                Seleccione un producto
                              </option>

                              {productosDisponibles.map(
                                (item) => (
                                  <option
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.nombre_producto} - $
                                    {Number(
                                      item.valor_unitario
                                    ).toLocaleString(
                                      "es-CO"
                                    )}
                                  </option>
                                )
                              )}

                            </select>

                          </div>

                          {/* Cantidad */}
                          <div className="col-md-3">

                            <input
                              name="cantidad"
                              type="number"
                              min="1"
                              max={
                                producto?.cant_producto ||
                                undefined
                              }
                              className="form-control"
                              value={detalle.cantidad}
                              onChange={(event) =>
                                handleDetalleChange(
                                  index,
                                  event
                                )
                              }
                              required
                            />

                          </div>

                          {/* Quitar */}
                          <div className="col-md-2">

                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() =>
                                quitarProducto(index)
                              }
                              disabled={
                                detalles.length === 1
                              }
                            >
                              Quitar
                            </button>

                          </div>

                        </div>
                      );
                    })}

                  </div>

                  {/* ==========================================
                      TOTAL
                  ========================================== */}

                  <div className="col-12 d-flex align-items-end justify-content-md-end">

                    <h4 className="mb-2">
                      Total: $
                      {total.toLocaleString("es-CO")}
                    </h4>

                  </div>

                  {/* ==========================================
                      BOTONES
                  ========================================== */}

                  <div className="col-12 d-flex justify-content-between mt-4">

                    <Link
                      to="/DetallesVenta"
                      className="btn btn-outline-secondary"
                    >
                      Volver
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={
                        guardando ||
                        detalles.some(
                          (detalle) =>
                            !detalle.id_producto ||
                            Number(detalle.cantidad) < 1
                        )
                      }
                    >
                      {guardando
                        ? "Guardando..."
                        : "Guardar venta"}
                    </button>

                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>

      </main>

      <FooterAdmi />

    </div>
  );
}

export default CrearVenta;