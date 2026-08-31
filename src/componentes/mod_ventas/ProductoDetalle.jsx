import { useParams, Link } from "react-router-dom";

const productos = [
  {
    id: 1,
    nombre: "Bicicleta MTB X1",
    precio: 1500000,
    categoria: "Montaña",
    imagen: "https://images.unsplash.com/photo-1541625602330-2277a4c46182",
    descripcion:
      "Bicicleta de montaña diseñada para ofrecer estabilidad, comodidad y buen rendimiento tanto en ciudad como en terrenos difíciles.",
    caracteristicas: [
      "Marco de aluminio",
      "21 velocidades",
      "Frenos de disco",
      "Suspensión delantera",
      "Llantas todo terreno",
    ],
  },
  {
    id: 2,
    nombre: "Bicicleta Urban Pro",
    precio: 1200000,
    categoria: "Urbana",
    imagen: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e",
    descripcion:
      "Una bicicleta cómoda y ligera pensada para desplazamientos urbanos y recorridos diarios.",
    caracteristicas: [
      "Marco liviano",
      "7 velocidades",
      "Frenos de disco",
      "Diseño urbano",
      "Asiento ergonómico",
    ],
  },
  {
    id: 3,
    nombre: "Bicicleta Adventure",
    precio: 1800000,
    categoria: "Aventura",
    imagen: "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
    descripcion:
      "Bicicleta versátil para quienes buscan disfrutar de recorridos largos y diferentes tipos de terreno.",
    caracteristicas: [
      "Marco de aluminio reforzado",
      "24 velocidades",
      "Frenos hidráulicos",
      "Suspensión delantera",
      "Llantas de alto agarre",
    ],
  },
];

function ProductoDetalle() {
  const { id } = useParams();

  const producto = productos.find(
    (producto) => producto.id === Number(id)
  );

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>
        <p>La bicicleta que buscas no existe.</p>

        <Link to="/Inicio" className="btn btn-dark">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* BOTÓN VOLVER */}
      <div className="mb-4">
        <Link to="/Inicio" className="text-decoration-none">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="row align-items-center">

        {/* IMAGEN */}
        <div className="col-md-6 mb-4">
          <div className="producto-imagen-detalle">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="col-md-6">

          <span className="badge bg-secondary mb-3">
            {producto.categoria}
          </span>

          <h1 className="fw-bold">
            {producto.nombre}
          </h1>

          <h2 className="text-primary fw-bold my-4">
            ${producto.precio.toLocaleString("es-CO")}
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
            {producto.caracteristicas.map((caracteristica, index) => (
              <li key={index} className="mb-2">
                {caracteristica}
              </li>
            ))}
          </ul>

          <div className="mt-4">

            <button className="btn btn-dark btn-lg me-2">
              Comprar
            </button>

            <button className="btn btn-outline-dark btn-lg">
              Agregar al carrito
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;