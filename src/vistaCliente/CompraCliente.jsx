import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavarCliente from "../componentes/NavarCliente";
import { Carrito } from "./Carrito";

function CompraCliente() {
  const navigate = useNavigate();
  const { carrito, precioTotal, limpiarCarrito } = Carrito();
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    metodoPago: "tarjeta",
  });

  const actualizarCampo = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const finalizarCompra = async (event) => {
    event.preventDefault();

    const userId = Number(localStorage.getItem("mjbe_user_id"));
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          cliente: formulario.nombre,
          productos: carrito,
          total: precioTotal,
          direccion: formulario.direccion,
          metodo_pago: formulario.metodoPago,
          estado: "Confirmada",
          fecha: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("No se pudo registrar la compra");

      setError("");
      limpiarCarrito();
      setConfirmado(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar la compra. Intenta nuevamente.");
    }
  };

  if (confirmado) {
    return (
      <>
        <NavarCliente />
        <main className="container py-5 text-center">
          <div className="alert alert-success mx-auto" style={{ maxWidth: "600px" }}>
            <h2 className="alert-heading">Compra simulada realizada</h2>
            <p className="mb-3">
              Gracias, {formulario.nombre}. Tu pedido fue registrado correctamente para esta demostración.
            </p>
            <button type="button" className="btn btn-success" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </div>
        </main>
      </>
    );
  }

  if (carrito.length === 0) {
    return (
      <>
        <NavarCliente />
        <main className="container py-5 text-center">
          <h1>Finalizar compra</h1>
          <p className="text-muted">Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-dark">Ver productos</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavarCliente />
      <main className="container py-5">
        <h1 className="mb-4">Finalizar compra</h1>
        <div className="row g-4">
          <section className="col-lg-7">
            <form onSubmit={finalizarCompra} className="card shadow-sm p-4">
              <h2 className="h4 mb-3">Datos de entrega</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre completo</label>
                <input id="nombre" name="nombre" type="text" className="form-control" required value={formulario.nombre} onChange={actualizarCampo} />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="correo" className="form-label">Correo electrónico</label>
                  <input id="correo" name="correo" type="email" className="form-control" required value={formulario.correo} onChange={actualizarCampo} />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input id="telefono" name="telefono" type="tel" className="form-control" required value={formulario.telefono} onChange={actualizarCampo} />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección de entrega</label>
                <textarea id="direccion" name="direccion" className="form-control" rows="3" required value={formulario.direccion} onChange={actualizarCampo} />
              </div>

              <fieldset className="mb-4">
                <legend className="h5">Método de pago simulado</legend>
                <div className="form-check">
                  <input id="tarjeta" name="metodoPago" value="tarjeta" type="radio" className="form-check-input" checked={formulario.metodoPago === "tarjeta"} onChange={actualizarCampo} />
                  <label htmlFor="tarjeta" className="form-check-label">Tarjeta de crédito o débito</label>
                </div>
                <div className="form-check">
                  <input id="transferencia" name="metodoPago" value="transferencia" type="radio" className="form-check-input" checked={formulario.metodoPago === "transferencia"} onChange={actualizarCampo} />
                  <label htmlFor="transferencia" className="form-check-label">Transferencia bancaria</label>
                </div>
                <div className="form-check">
                  <input id="contraentrega" name="metodoPago" value="contraentrega" type="radio" className="form-check-input" checked={formulario.metodoPago === "contraentrega"} onChange={actualizarCampo} />
                  <label htmlFor="contraentrega" className="form-check-label">Pago contra entrega</label>
                </div>
              </fieldset>

              <button type="submit" className="btn btn-dark w-100">Confirmar compra simulada</button>
            </form>
          </section>

          <aside className="col-lg-5">
            <div className="card shadow-sm p-4">
              <h2 className="h4 mb-3">Resumen del pedido</h2>
              {carrito.map((producto) => (
                <div className="d-flex justify-content-between gap-3 mb-3" key={producto.id}>
                  <span>{producto.nombre_producto} x {producto.cantidad}</span>
                  <strong>${(Number(producto.valor_unitario) * producto.cantidad).toLocaleString("es-CO")}</strong>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${precioTotal.toLocaleString("es-CO")}</span>
              </div>
              <small className="text-muted d-block mt-3">No se realizará ningún cobro real.</small>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default CompraCliente;
