import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavarCliente from "../componentes/NavarCliente";
import { useCart } from "./Carrito";

const API_URL = "http://localhost:3001/productos";

function ProductosCliente() {
  const { agregarAlCarrito } = useCart();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [marca, setMarca] = useState("");
  const [orden, setOrden] = useState("");
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

  const marcas = [...new Set(productos.map((producto) => producto.marca_producto).filter(Boolean))].sort();
  const productosFiltrados = productos
    .filter((producto) => {
      const texto = busqueda.toLowerCase().trim();
      const coincideBusqueda = [producto.nombre_producto, producto.descripcion, producto.marca_producto]
        .some((valor) => String(valor || "").toLowerCase().includes(texto));
      const coincideMarca = !marca || producto.marca_producto === marca;
      return coincideBusqueda && coincideMarca;
    })
    .sort((productoA, productoB) => {
      if (orden === "menor") return Number(productoA.valor_unitario) - Number(productoB.valor_unitario);
      if (orden === "mayor") return Number(productoB.valor_unitario) - Number(productoA.valor_unitario);
      return 0;
    });

  return (
    <>
      <NavarCliente />
      <main className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="mb-1">Nuestros productos</h1>
            <p className="text-muted mb-0">Encuentra el producto que necesitas</p>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setBusqueda("");
              setMarca("");
              setOrden("");
            }}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="buscar-productos" className="form-label">Buscar</label>
            <input
              id="buscar-productos"
              type="search"
              className="form-control"
              placeholder="Nombre, descripción o marca"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="filtrar-marca" className="form-label">Marca</label>
            <select
              id="filtrar-marca"
              className="form-select"
              value={marca}
              onChange={(event) => setMarca(event.target.value)}
            >
              <option value="">Todas las marcas</option>
              {marcas.map((marcaProducto) => (
                <option key={marcaProducto} value={marcaProducto}>{marcaProducto}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="ordenar-precio" className="form-label">Ordenar por precio</label>
            <select
              id="ordenar-precio"
              className="form-select"
              value={orden}
              onChange={(event) => setOrden(event.target.value)}
            >
              <option value="">Predeterminado</option>
              <option value="menor">Menor a mayor</option>
              <option value="mayor">Mayor a menor</option>
            </select>
          </div>
        </div>

        {loading && <p>Cargando productos...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && productosFiltrados.length === 0 && (
          <div className="alert alert-info">No encontramos productos con esos filtros.</div>
        )}

        <div className="row">
          {productosFiltrados.map((producto) => (
            <div className="col-md-4 mb-4" key={producto.id}>
              <div className="card h-100 shadow-sm">
                <Link to={`/producto/${producto.id}`} className="text-decoration-none text-dark">
                  <img
                    src={producto.img_producto}
                    className="card-img-top"
                    alt={producto.nombre_producto}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <small className="text-muted">{producto.marca_producto}</small>
                    <h5 className="card-title mt-2">{producto.nombre_producto}</h5>
                    <h5 className="fw-bold">
                      ${Number(producto.valor_unitario).toLocaleString("es-CO")}
                    </h5>
                  </div>
                </Link>
                <div className="card-body pt-0">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default ProductosCliente;
