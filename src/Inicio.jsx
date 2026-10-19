// Portada / catálogo público

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavarCliente from "./componentes/NavarCliente";
import { useCart } from "./vistaCliente/Carrito";

// API Laravel/PHP que obtiene los productos desde MySQL
const API_URL = "http://localhost:5000/api/productos";

function Inicio() {
  // Función para agregar productos al carrito
  const { agregarAlCarrito } = useCart();

  // Productos obtenidos desde la API
  const [productos, setProductos] = useState([]);

  // Estado de carga mientras se consulta la API
  const [loading, setLoading] = useState(true);

  // Mensaje de error si falla la consulta
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        // Consultar productos desde la API Laravel
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos");
        }

        const data = await response.json();

        // Mostrar únicamente productos que estén activos
        setProductos(
          data.filter(
            (producto) =>
              producto.estado?.toLowerCase() === "activo"
          )
        );
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos desde la API.");
      } finally {
        // Finalizar el estado de carga
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <>
      {/* Barra de navegación del cliente */}
      <NavarCliente />

      <div className="container py-5">

        {/* Encabezado de la página */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">
            Bienvenido a MJBE Bikes
          </h1>

          <p className="lead text-muted">
            Encuentra la bicicleta perfecta para cada aventura
          </p>
        </div>

        {/* Título del catálogo */}
        <h2 className="mb-4">Nuestros productos</h2>

        {/* Mensaje mientras se cargan los productos */}
        {loading && <p>Cargando productos...</p>}

        {/* Mensaje si ocurre un error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Catálogo de productos */}
        <div className="row">
          {productos.map((producto) => (
            <div
              className="col-md-4 mb-4"
              key={producto.id}
            >
              {/* Enlace hacia el detalle del producto */}
              <Link
                to={`/producto/${producto.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 shadow-sm">

                  {/* Imagen del producto */}
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

                    {/* Marca */}
                    <small className="text-muted">
                      {producto.marca_producto}
                    </small>

                    {/* Nombre */}
                    <h5 className="card-title mt-2">
                      {producto.nombre_producto}
                    </h5>

                    {/* Precio en formato colombiano */}
                    <h5 className="fw-bold">
                      $
                      {Number(
                        producto.valor_unitario
                      ).toLocaleString("es-CO")}
                    </h5>

                    {/* Agregar producto al carrito */}
                    <button
                      type="button"
                      className="btn btn-dark mt-2"
                      onClick={(event) => {
                        // Evita que el botón también active
                        // el Link del producto
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
