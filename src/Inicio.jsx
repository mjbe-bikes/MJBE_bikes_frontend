import { Link } from "react-router-dom";
import NavarCliente from "./componentes/NavarCliente";


const productos = [
  {
    id: 1,
    nombre: "Bicicleta MTB X1",
    precio: 1500000,
    categoria: "Montaña",
    imagen:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182",
  },
  {
    id: 2,
    nombre: "Bicicleta Urban Pro",
    precio: 1200000,
    categoria: "Urbana",
    imagen:
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e",
  },
  {
    id: 3,
    nombre: "Bicicleta Adventure",
    precio: 1800000,
    categoria: "Aventura",
    imagen:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
  },
];

function Inicio() {
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

      <div className="row">
        {productos.map((producto) => (
          <div className="col-md-4 mb-4" key={producto.id}>
            <Link
              to={`/producto/${producto.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm">

                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  <small className="text-muted">
                    {producto.categoria}
                  </small>

                  <h5 className="card-title mt-2">
                    {producto.nombre}
                  </h5>

                  <h5 className="fw-bold">
                    ${producto.precio.toLocaleString("es-CO")}
                  </h5>

                  <span className="btn btn-dark mt-2">
                    Ver producto
                  </span>
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