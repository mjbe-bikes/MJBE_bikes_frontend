import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavarCliente from "./componentes/NavarCliente";
import { useCart } from "./vistaCliente/Carrito";

const API_URL = "http://localhost:3001/productos";

function Inicio() {
  const { agregarAlCarrito } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("No se pudieron cargar los productos");

        const data = await response.json();
        setProductos(data.filter((producto) => producto.estado?.toLowerCase() === "activo"));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos desde la API.");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <> <NavarCliente />
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          Bienvenido a MJBE Bikes
        </h1>

        <p className="lead text-muted">
          Encuentra la bicicleta perfecta para cada aventura
        </p>
      </div>

      <h2 className="mb-4">Nuestros productos</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {productos.map((producto) => (
          <div className="col-md-4 mb-4" key={producto.id}>
            <Link
              to={`/producto/${producto.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm">

                <img
                  src={producto.img_producto}
                  className="card-img-top"
                  alt={producto.nombre_producto}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  <small className="text-muted">
                    {producto.marca_producto}
                  </small>

                  <h5 className="card-title mt-2">
                    {producto.nombre_producto}
                  </h5>

                  <h5 className="fw-bold">
                    ${Number(producto.valor_unitario).toLocaleString("es-CO")}
                  </h5>

                  <button
                    type="button"
                    className="btn btn-dark mt-2"
                    onClick={(event) => {
                      event.preventDefault();
                      agregarAlCarrito(producto);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>

              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
    </>
  );
}

export default Inicio;