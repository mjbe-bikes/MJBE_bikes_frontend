// Editar producto (bodega)

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function ActualizarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Datos del producto que se está editando
  const [form, setForm] = useState({
    img_producto: "",
    nombre_producto: "",
    descripcion: "",
    color_producto: "",
    marca_producto: "",
    cant_producto: "",
    modelo: "",
    id_talla: "",
    id_proveedor: "",
    id_local: "",
    valor_unitario: "",
    estado: "activo",
  });

  // =========================================================
  // TALLAS DISPONIBLES
  // =========================================================
  // Estos IDs corresponden a la FK productos.id_talla.
  const tallas = [
    { id: 1, nombre: "S (Ropa Ciclismo Superior)" },
    { id: 2, nombre: "M (Ropa Ciclismo Superior)" },
    { id: 3, nombre: "L (Ropa Ciclismo Superior)" },
    { id: 4, nombre: "Rin 26 (Diámetro de Rueda Montaña)" },
    { id: 5, nombre: "Rin 27.5 (Diámetro de Rueda Montaña)" },
    { id: 6, nombre: "Rin 29 (Diámetro de Rueda Montaña)" },
    { id: 7, nombre: "XS (Ropa Ciclismo Inferior)" },
    { id: 8, nombre: "XL (Ropa Ciclismo Inferior)" },
    { id: 9, nombre: "XXL (Ropa Ciclismo Inferior)" },
    { id: 10, nombre: "Marco 15 (Estatura Cuadro MTB)" },
    { id: 11, nombre: "Marco 17 (Estatura Cuadro MTB)" },
    { id: 12, nombre: "Marco 19 (Estatura Cuadro MTB)" },
    { id: 13, nombre: "Niño S (Protecciones Infantiles)" },
    { id: 14, nombre: "Niño M (Protecciones Infantiles)" },
    { id: 15, nombre: "Niño L (Protecciones Infantiles)" },
    { id: 16, nombre: "Rin 12 (Bicicletas Infantiles)" },
    { id: 17, nombre: "Rin 16 (Bicicletas Infantiles)" },
    { id: 18, nombre: "Rin 20 (Bicicletas Infantiles)" },
    { id: 19, nombre: "48 cm (Cuadro Ruta Corto)" },
    { id: 20, nombre: "51 cm (Cuadro Ruta Corto)" },
    { id: 21, nombre: "54 cm (Cuadro Ruta Corto)" },
    { id: 22, nombre: "56 cm (Cuadro Ruta Largo)" },
    { id: 23, nombre: "58 cm (Cuadro Ruta Largo)" },
    { id: 24, nombre: "60 cm (Cuadro Ruta Largo)" },
    { id: 25, nombre: "Estándar (Componentes Manubrio)" },
    { id: 26, nombre: "Ajustable (Componentes Manubrio)" },
    { id: 27, nombre: "Fija (Componentes Manubrio)" },
    { id: 28, nombre: "Ancha (Ancho de Neumático)" },
    { id: 29, nombre: "Delgada (Ancho de Neumático)" },
    { id: 30, nombre: "Media (Ancho de Neumático)" },
  ];

  // =========================================================
  // PROVEEDORES
  // =========================================================
  const proveedores = [
    { id: 1, nombre: "Shimano Distribuciones" },
    { id: 2, nombre: "GW Colombia" },
    { id: 3, nombre: "Trek Bikes Latam" },
    { id: 4, nombre: "Specialized Components" },
    { id: 5, nombre: "Maxxis Llantas SAS" },
    { id: 6, nombre: "Sram Imports" },
    { id: 7, nombre: "Pro Bike Accesorios" },
    { id: 8, nombre: "Marcos Aluminio Express" },
    { id: 9, nombre: "KMC Cadenas" },
    { id: 10, nombre: "Fox Suspensiones Col" },
    { id: 11, nombre: "Cascos Bell & Giro" },
    { id: 12, nombre: "Pedales Look Colombia" },
    { id: 13, nombre: "Ropa Ciclismo Safetti" },
    { id: 14, nombre: "Suarez Clothing" },
    { id: 15, nombre: "Luces Cateye Mayorista" },
    { id: 16, nombre: "Garmin Tecno SAS" },
    { id: 17, nombre: "Continental Neumáticos" },
    { id: 18, nombre: "Schwalbe Colombia" },
    { id: 19, nombre: "Frenos Tektro S.A." },
    { id: 20, nombre: "Rines Alexrims" },
    { id: 21, nombre: "Sillin Selle Royal" },
    { id: 22, nombre: "Grupo Elite Repuestos" },
    { id: 23, nombre: "Herramientas ParkTool" },
    { id: 24, nombre: "Caramañola Camelbak" },
    { id: 25, nombre: "CicloPartes Nacionales" },
  ];

  // =========================================================
  // LOCALES
  // =========================================================
  const locales = [
    { id: 1, nombre: "MJBE Central" },
    { id: 2, nombre: "MJBE Norte" },
    { id: 3, nombre: "MJBE Sur" },
    { id: 4, nombre: "MJBE Este" },
    { id: 5, nombre: "MJBE Oeste" },
    { id: 6, nombre: "MJBE Plaza" },
    { id: 7, nombre: "MJBE Centro" },
    { id: 8, nombre: "MJBE Terminal" },
    { id: 9, nombre: "MJBE Salitre" },
    { id: 10, nombre: "MJBE Álamos" },
    { id: 11, nombre: "MJBE Cedritos" },
    { id: 12, nombre: "MJBE Colina" },
    { id: 13, nombre: "MJBE Kennedy" },
    { id: 14, nombre: "MJBE Bosa" },
    { id: 15, nombre: "MJBE Fontibón" },
    { id: 16, nombre: "MJBE Engativá" },
    { id: 17, nombre: "MJBE Usaquén" },
    { id: 18, nombre: "MJBE Chapinero" },
    { id: 19, nombre: "MJBE Teusaquillo" },
    { id: 20, nombre: "MJBE Mártires" },
    { id: 21, nombre: "MJBE Restrepo" },
    { id: 22, nombre: "MJBE Venecia" },
    { id: 23, nombre: "MJBE Tunal" },
    { id: 24, nombre: "MJBE Suba Costa" },
    { id: 25, nombre: "MJBE Tintal" },
  ];

  // =========================================================
  // ACTUALIZAR CAMPOS DEL FORMULARIO
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((formAnterior) => ({
      ...formAnterior,
      [name]: value,
    }));
  };

  // =========================================================
  // CARGAR PRODUCTO
  // =========================================================
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/productos/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }

        const productoEncontrado = await response.json();

        // Laravel devuelve el producto directamente.
        setForm({
          img_producto:
            productoEncontrado.img_producto || "",

          nombre_producto:
            productoEncontrado.nombre_producto || "",

          descripcion:
            productoEncontrado.descripcion || "",

          color_producto:
            productoEncontrado.color_producto || "",

          marca_producto:
            productoEncontrado.marca_producto || "",

          cant_producto:
            productoEncontrado.cant_producto ?? "",

          modelo:
            productoEncontrado.modelo || "",

          // La BD usa id_talla, no id_medida.
          id_talla:
            productoEncontrado.id_talla ?? "",

          id_proveedor:
            productoEncontrado.id_proveedor ?? "",

          id_local:
            productoEncontrado.id_local ?? "",

          valor_unitario:
            productoEncontrado.valor_unitario ?? "",

          estado:
            productoEncontrado.estado || "activo",
        });
      } catch (err) {
       console.error(
  "ERRORES DE VALIDACIÓN DE LARAVEL:",
  JSON.stringify(datosError, null, 2)
);

        setError(
          "No se pudo cargar el producto desde la API."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  // =========================================================
  // ACTUALIZAR PRODUCTO
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setError("");

      const response = await fetch(
        `${API_URL}/productos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            img_producto: form.img_producto,
            nombre_producto: form.nombre_producto,
            descripcion: form.descripcion,
            color_producto: form.color_producto,
            marca_producto: form.marca_producto,
            cant_producto: Number(form.cant_producto),
            modelo: form.modelo,

            // Campo correcto según la BD.
            id_talla: Number(form.id_talla),

            id_proveedor: Number(form.id_proveedor),
            id_local: Number(form.id_local),
            valor_unitario: Number(form.valor_unitario),
            estado: form.estado,
          }),
        }
      );

      if (!response.ok) {
  const datosError =
    await response.json().catch(() => null);

  // Mostrar en consola el error completo de Laravel.
  console.error(
    "ERRORES DE VALIDACIÓN DE LARAVEL:",
    JSON.stringify(datosError, null, 2)
  );

  // Mostrar el detalle del error también en la página.
  const erroresLaravel = datosError?.errores;

  if (erroresLaravel) {
    const mensajes = Object.entries(erroresLaravel)
      .map(([campo, errores]) => {
        return `${campo}: ${errores.join(", ")}`;
      })
      .join("\n");

    setError(mensajes);
  } else {
    setError(
      datosError?.mensaje ||
      "No se pudo actualizar el producto."
    );
  }

  throw new Error(
    "No se pudo actualizar el producto"
  );

      }

      // Volver al inventario después de actualizar.
      navigate("/VerProductos");
    } catch (err) {
      console.error(
        "Error al actualizar producto:",
        err
      );

      setError(
        "No se pudo actualizar el producto."
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // ESTADO DE CARGA
  // =========================================================
  if (loading) {
    return (
      <div className="app">
        <NavBodega />

        <main className="container-fluid py-5 contenido">
          <p className="text-center">
            Cargando producto...
          </p>
        </main>

        <FooterBodega />
      </div>
    );
  }

  return (
    <div className="app">
      <NavBodega />

      <main className="container-fluid py-4 contenido">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-11 col-md-12">

            <div className="card shadow border-0 rounded-4">

              {/* Encabezado */}
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-0">
                  ✏️ Actualizar Producto
                </h3>

                <small>
                  Modifica la información del producto
                </small>
              </div>

              {/* Formulario */}
              <div className="card-body p-4">

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form
                  className="row g-4"
                  onSubmit={handleSubmit}
                >

                  {/* Imagen */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Imagen URL
                    </label>

                    <input
                      type="text"
                      name="img_producto"
                      className="form-control"
                      value={form.img_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Nombre */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Nombre Producto
                    </label>

                    <input
                      type="text"
                      name="nombre_producto"
                      className="form-control"
                      value={form.nombre_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Descripción */}
                  <div className="col-md-12">
                    <label className="form-label">
                      Descripción
                    </label>

                    <input
                      type="text"
                      name="descripcion"
                      className="form-control"
                      value={form.descripcion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Color */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color_producto"
                      className="form-control"
                      value={form.color_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Marca */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Marca
                    </label>

                    <input
                      type="text"
                      name="marca_producto"
                      className="form-control"
                      value={form.marca_producto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Modelo */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Modelo
                    </label>

                    <input
                      type="text"
                      name="modelo"
                      className="form-control"
                      value={form.modelo}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Cantidad */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Cantidad
                    </label>

                    <input
                      type="number"
                      name="cant_producto"
                      className="form-control"
                      value={form.cant_producto}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Valor unitario */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Valor Unitario
                    </label>

                    <input
                      type="number"
                      name="valor_unitario"
                      className="form-control"
                      value={form.valor_unitario}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Talla */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Talla / Medida
                    </label>

                    <select
                      name="id_talla"
                      className="form-select"
                      value={form.id_talla}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Seleccione
                      </option>

                      {tallas.map((talla) => (
                        <option
                          key={talla.id}
                          value={talla.id}
                        >
                          {talla.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Proveedor */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Proveedor
                    </label>

                    <select
                      name="id_proveedor"
                      className="form-select"
                      value={form.id_proveedor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Seleccione
                      </option>

                      {proveedores.map((proveedor) => (
                        <option
                          key={proveedor.id}
                          value={proveedor.id}
                        >
                          {proveedor.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Local */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Local
                    </label>

                    <select
                      name="id_local"
                      className="form-select"
                      value={form.id_local}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Seleccione
                      </option>

                      {locales.map((local) => (
                        <option
                          key={local.id}
                          value={local.id}
                        >
                          {local.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Estado
                    </label>

                    <select
                      name="estado"
                      className="form-select"
                      value={form.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="activo">
                        Activo
                      </option>

                      <option value="inactivo">
                        Inactivo
                      </option>
                    </select>
                  </div>

                  {/* Botones */}
                  <div className="col-12 d-flex justify-content-between mt-3">

                    <Link
                      to="/VerProductos"
                      className="btn btn-outline-secondary"
                    >
                      Volver
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={guardando}
                    >
                      {guardando
                        ? "Actualizando..."
                        : "Actualizar Producto"}
                    </button>

                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterBodega />
    </div>
  );
}

export default ActualizarProducto;

