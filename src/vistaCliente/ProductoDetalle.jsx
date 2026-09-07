import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./Carrito";

const API_URL = "http://localhost:3001/productos";

function ProductoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");

        setProducto(await response.json());
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto desde la API.");
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (loading) {
    return <div className="container py-5 text-center">Cargando producto...</div>;
  }

  if (error || !producto) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>
        <p>{error || "El producto que buscas no existe."}</p>

        <Link to="/" className="btn btn-dark">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* BOTÓN VOLVER */}
      <div className="mb-4">
        <Link to="/" className="text-decoration-none">
          ← Volver
        </Link>
      </div>

      <div className="row align-items-center">

        {/* IMAGEN */}
        <div className="col-md-6 mb-4">
          <div className="producto-imagen-detalle">
            <img
              src={producto.img_producto}
              alt={producto.nombre_producto}
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="col-md-6">

          <span className="badge bg-secondary mb-3">
            {producto.marca_producto}
          </span>

          <h1 className="fw-bold">
            {producto.nombre_producto}
          </h1>

          <h2 className="text-primary fw-bold my-4">
            ${Number(producto.valor_unitario).toLocaleString("es-CO")}
          </h2>

          <h5>Descripción</h5>

          <p className="text-muted">
            {producto.descripcion}
          </p>

          <hr />

          <h5 className="mb-3">
            Características
          </h5>

          <ul>
            {[producto.color_producto, producto.modelo, producto.marca_producto, `Stock: ${producto.cant_producto}`].map((caracteristica, index) => (
              <li key={index} className="mb-2">
                {caracteristica}
              </li>
            ))}
          </ul>

          <div className="mt-4">

            <button className="btn btn-dark btn-lg me-2">
              Comprar
            </button>

            <button
              type="button"
              className="btn btn-outline-dark btn-lg"
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;