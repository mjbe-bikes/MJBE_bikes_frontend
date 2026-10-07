// Checkout del cliente

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavarCliente from "../componentes/NavarCliente";
import { Carrito } from "./Carrito";

// API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function CompraCliente() {
  const navigate = useNavigate();

  // Carrito compartido de la aplicación
  const {
    carrito,
    precioTotal,
    limpiarCarrito
  } = Carrito();

  // Estado de la compra
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState("");

  // Datos del formulario
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    metodoPago: "tarjeta",
  });

  // ---------------------------------------------------------
  // ACTUALIZAR CAMPOS DEL FORMULARIO
  // ---------------------------------------------------------

  const actualizarCampo = (event) => {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // FINALIZAR COMPRA
  // ---------------------------------------------------------

  const finalizarCompra = async (event) => {
    event.preventDefault();

    // Obtener el usuario que inició sesión
    const userId = Number(
      localStorage.getItem("mjbe_user_id")
    );

    // Obtener el token JWT guardado al iniciar sesión
    const token = localStorage.getItem("mjbe_token");

    // Si no hay sesión o token, enviar al login
    if (!userId || !token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      // -----------------------------------------------------
      // 1. BUSCAR EL CLIENTE DEL USUARIO
      // -----------------------------------------------------

      /*
       * Relación de la base de datos:
       *
       * usuarios.id
       *      ↓
       * clientes.usuario_id
       *      ↓
       * ventas.id_cliente
       *
       * Primero intentamos encontrar el cliente
       * relacionado con el usuario que inició sesión.
       */
      const respuestaClientes = await fetch(
        `${API_URL}/clientes?usuario_id=${userId}`,
        {
          headers: {
            // JWT necesario para acceder a la ruta protegida
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const clientes = respuestaClientes.ok
        ? await respuestaClientes.json()
        : [];

      let idCliente;

      // -----------------------------------------------------
      // 2. SI YA EXISTE EL CLIENTE
      // -----------------------------------------------------

      if (clientes.length > 0) {

        idCliente =
          clientes[0].id_cliente ??
          clientes[0].id;

      } else {

        // ---------------------------------------------------
        // 3. SI NO EXISTE, CREAR EL CLIENTE
        // ---------------------------------------------------

        /*
         * Separamos el nombre completo en:
         *
         * nombres
         * apellidos
         */
        const [
          primerNombre,
          ...resto
        ] = formulario.nombre
          .trim()
          .split(" ");

        const respuestaNuevoCliente = await fetch(
          `${API_URL}/clientes`,
          {
            method: "POST",

            headers: {
              // JWT para autenticar la petición
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },

            body: JSON.stringify({
              usuario_id: userId,

              // Tipo de documento utilizado
              // actualmente por el proyecto
              tipo_documento_id: 1,

              // Identificador temporal para esta demostración
              numero_documento: `USR-${userId}`,

              nombres:
                primerNombre ||
                formulario.nombre,

              apellidos:
                resto.join(" ") || "-",

              direccion:
                formulario.direccion,

              telefono_clnt:
                formulario.telefono,
            }),
          }
        );

        if (!respuestaNuevoCliente.ok) {
          throw new Error(
            "No se pudo registrar el cliente"
          );
        }

        const nuevoCliente =
          await respuestaNuevoCliente.json();

        idCliente =
          nuevoCliente.id_cliente ??
          nuevoCliente.id;
      }

      // -----------------------------------------------------
      // 4. CREAR LA VENTA
      // -----------------------------------------------------

      /*
       * La venta se registra directamente en Laravel.
       *
       * No usamos /productos porque ese endpoint
       * pertenece al módulo de productos.
       *
       * La compra es simulada, por lo que se registra
       * como completada.
       */
      const respuestaVenta = await fetch(
        `${API_URL}/ventas`,
        {
          method: "POST",

          headers: {
            // JWT para autenticar la creación de la venta
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({

            // Usuario que realiza la operación
            user_id: userId,

            // Cliente relacionado con el usuario
            cliente: idCliente,

            // Productos que forman parte de la compra
            productos: carrito,

            // Total calculado por el carrito
            total: precioTotal,

            // Dirección utilizada para la entrega
            direccion:
              formulario.direccion,

            // Método de pago seleccionado
            metodo_pago:
              formulario.metodoPago,

            // Compra simulada completada
            estado: "completada",

            // Fecha actual
            fecha:
              new Date().toISOString(),
          }),
        }
      );

      if (!respuestaVenta.ok) {
        throw new Error(
          "No se pudo registrar la compra"
        );
      }

      // Obtener la venta creada
      const venta =
        await respuestaVenta.json();

      // -----------------------------------------------------
      // 5. REGISTRAR LOS PRODUCTOS DE LA VENTA
      // -----------------------------------------------------

      /*
       * Cada producto del carrito se registra en
       * detalles_venta.
       *
       * Esto permite que posteriormente
       * "Mis compras" pueda mostrar qué productos
       * pertenecen a cada venta.
       */
      const respuestasDetalles =
        await Promise.all(

          carrito.map((producto) =>

            fetch(
              `${API_URL}/detalles_venta`,
              {
                method: "POST",

                headers: {
                  // JWT para registrar cada detalle
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                  Accept: "application/json",
                },

                body: JSON.stringify({
                  id_venta: venta.id,

                  id_producto:
                    producto.id,

                  cantidad:
                    producto.cantidad,

                  precio_unitario_momento:
                    Number(
                      producto.valor_unitario
                    ),
                }),
              }
            )
          )
        );

      // Verificar que todos los detalles fueron registrados
      if (
        respuestasDetalles.some(
          (respuesta) => !respuesta.ok
        )
      ) {
        throw new Error(
          "No se pudieron registrar todos los productos de la compra"
        );
      }

      // -----------------------------------------------------
      // 6. COMPRA COMPLETADA
      // -----------------------------------------------------

      setError("");

      // Vaciar el carrito
      limpiarCarrito();

      // Mostrar pantalla de confirmación
      setConfirmado(true);

    } catch (err) {

      console.error(err);

      setError(
        "No se pudo registrar la compra. Intenta nuevamente."
      );
    }
  };

  // ---------------------------------------------------------
  // PANTALLA DE COMPRA CONFIRMADA
  // ---------------------------------------------------------

  if (confirmado) {
    return (
      <>
        <NavarCliente />

        <main className="container py-5 text-center">

          <div
            className="alert alert-success mx-auto"
            style={{
              maxWidth: "600px",
            }}
          >

            <h2 className="alert-heading">
              Compra simulada realizada
            </h2>

            <p className="mb-3">
              Gracias, {formulario.nombre}.
              Tu pedido fue registrado correctamente
              para esta demostración.
            </p>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </button>

          </div>

        </main>
      </>
    );
  }

  // ---------------------------------------------------------
  // CARRITO VACÍO
  // ---------------------------------------------------------

  if (carrito.length === 0) {
    return (
      <>
        <NavarCliente />

        <main className="container py-5 text-center">

          <h1>
            Finalizar compra
          </h1>

          <p className="text-muted">
            Tu carrito está vacío.
          </p>

          <Link
            to="/productos"
            className="btn btn-dark"
          >
            Ver productos
          </Link>

        </main>
      </>
    );
  }

  // ---------------------------------------------------------
  // CHECKOUT
  // ---------------------------------------------------------

  return (
    <>
      <NavarCliente />

      <main className="container py-5">

        <h1 className="mb-4">
          Finalizar compra
        </h1>

        <div className="row g-4">

          {/* =================================================
              FORMULARIO DE ENTREGA
          ================================================= */}

          <section className="col-lg-7">

            <form
              onSubmit={finalizarCompra}
              className="card shadow-sm p-4"
            >

              <h2 className="h4 mb-3">
                Datos de entrega
              </h2>

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {/* NOMBRE */}
              <div className="mb-3">

                <label
                  htmlFor="nombre"
                  className="form-label"
                >
                  Nombre completo
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  className="form-control"
                  required
                  value={formulario.nombre}
                  onChange={actualizarCampo}
                />

              </div>

              {/* CORREO Y TELÉFONO */}
              <div className="row">

                <div className="col-md-6 mb-3">

                  <label
                    htmlFor="correo"
                    className="form-label"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    className="form-control"
                    required
                    value={formulario.correo}
                    onChange={actualizarCampo}
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label
                    htmlFor="telefono"
                    className="form-label"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    className="form-control"
                    required
                    value={formulario.telefono}
                    onChange={actualizarCampo}
                  />

                </div>

              </div>

              {/* DIRECCIÓN */}
              <div className="mb-3">

                <label
                  htmlFor="direccion"
                  className="form-label"
                >
                  Dirección de entrega
                </label>

                <textarea
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  rows="3"
                  required
                  value={formulario.direccion}
                  onChange={actualizarCampo}
                />

              </div>

              {/* MÉTODO DE PAGO */}
              <fieldset className="mb-4">

                <legend className="h5">
                  Método de pago simulado
                </legend>

                {/* TARJETA */}
                <div className="form-check">

                  <input
                    id="tarjeta"
                    name="metodoPago"
                    value="tarjeta"
                    type="radio"
                    className="form-check-input"
                    checked={
                      formulario.metodoPago ===
                      "tarjeta"
                    }
                    onChange={actualizarCampo}
                  />

                  <label
                    htmlFor="tarjeta"
                    className="form-check-label"
                  >
                    Tarjeta de crédito o débito
                  </label>

                </div>

                {/* TRANSFERENCIA */}
                <div className="form-check">

                  <input
                    id="transferencia"
                    name="metodoPago"
                    value="transferencia"
                    type="radio"
                    className="form-check-input"
                    checked={
                      formulario.metodoPago ===
                      "transferencia"
                    }
                    onChange={actualizarCampo}
                  />

                  <label
                    htmlFor="transferencia"
                    className="form-check-label"
                  >
                    Transferencia bancaria
                  </label>

                </div>

                {/* CONTRAENTREGA */}
                <div className="form-check">

                  <input
                    id="contraentrega"
                    name="metodoPago"
                    value="contraentrega"
                    type="radio"
                    className="form-check-input"
                    checked={
                      formulario.metodoPago ===
                      "contraentrega"
                    }
                    onChange={actualizarCampo}
                  />

                  <label
                    htmlFor="contraentrega"
                    className="form-check-label"
                  >
                    Pago contra entrega
                  </label>

                </div>

              </fieldset>

              {/* CONFIRMAR COMPRA */}
              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Confirmar compra simulada
              </button>

            </form>

          </section>

          {/* =================================================
              RESUMEN DEL PEDIDO
          ================================================= */}
          <aside className="col-lg-5">

            <div className="card shadow-sm p-4">

              <h2 className="h4 mb-3">
                Resumen del pedido
              </h2>

              {/* PRODUCTOS DEL CARRITO */}
              {carrito.map((producto) => (

                <div
                  className="d-flex justify-content-between gap-3 mb-3"
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
                        producto.valor_unitario
                      ) *
                      Number(
                        producto.cantidad
                      )
                    ).toLocaleString("es-CO")}
                  </strong>

                </div>

              ))}

              <hr />

              {/* TOTAL */}
              <div className="d-flex justify-content-between fw-bold">

                <span>
                  Total
                </span>

                <span>
                  $
                  {precioTotal.toLocaleString(
                    "es-CO"
                  )}
                </span>

              </div>

              <small className="text-muted d-block mt-3">
                No se realizará ningún cobro real.
              </small>

            </div>

          </aside>

        </div>

      </main>
    </>
  );
}

export default CompraCliente;