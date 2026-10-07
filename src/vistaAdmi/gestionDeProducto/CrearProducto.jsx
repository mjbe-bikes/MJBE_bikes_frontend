// Alta de producto (admin)

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function CrearProducto() {
    const navigate = useNavigate();

    // =========================================================
    // TALLAS
    // =========================================================
    // Estos IDs corresponden a la tabla "tallas" de tu base de datos.
    // IMPORTANTE: ahora usamos id_talla, no id_medida.
    const tallas = [
        { id: 1, nombre: "S" },
        { id: 2, nombre: "M" },
        { id: 3, nombre: "L" },
        { id: 4, nombre: "Rin 26" },
        { id: 5, nombre: "Rin 27.5" },
        { id: 6, nombre: "Rin 29" },
        { id: 7, nombre: "XS" },
        { id: 8, nombre: "XL" },
        { id: 9, nombre: "XXL" },
        { id: 10, nombre: "Marco 15" },
        { id: 11, nombre: "Marco 17" },
        { id: 12, nombre: "Marco 19" },
        { id: 13, nombre: "Niño S" },
        { id: 14, nombre: "Niño M" },
        { id: 15, nombre: "Niño L" },
        { id: 16, nombre: "Rin 12" },
        { id: 17, nombre: "Rin 16" },
        { id: 18, nombre: "Rin 20" },
        { id: 19, nombre: "48 cm" },
        { id: 20, nombre: "51 cm" },
        { id: 21, nombre: "54 cm" },
        { id: 22, nombre: "56 cm" },
        { id: 23, nombre: "58 cm" },
        { id: 24, nombre: "60 cm" },
        { id: 25, nombre: "Estándar" },
        { id: 26, nombre: "Ajustable" },
        { id: 27, nombre: "Fija" },
        { id: 28, nombre: "Ancha" },
        { id: 29, nombre: "Delgada" },
        { id: 30, nombre: "Media" }
    ];

    // =========================================================
    // PROVEEDORES
    // =========================================================
    // Estos IDs corresponden a proveedores existentes en la BD.
    const proveedores = [
        { id: 1, nombre: "Shimano Distribuciones" },
        { id: 2, nombre: "GW Colombia" },
        { id: 3, nombre: "Trek Bikes Latam" },
        { id: 4, nombre: "Proveedor Bicicletas Colombia" },
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
        { id: 24, nombre: "Caramañolas Camelbak" },
        { id: 25, nombre: "CicloPartes Nacionales" },
        { id: 26, nombre: "Proveedor de prueba" },
        { id: 27, nombre: "Proveedor Bicicletas Colombia" },
        { id: 28, nombre: "1232322132" }
    ];

    // =========================================================
    // LOCALES
    // =========================================================
    // Estos IDs corresponden a locales existentes en la BD.
    const locales = [
        { id: 1, nombre: "MJBE Central" },
        { id: 2, nombre: "MJBE Norte" },
        { id: 3, nombre: "MJBE Sur" },
        { id: 4, nombre: "MJBE Este" },
        { id: 5, nombre: "MJBE Oeste" }
    ];

    // =========================================================
    // ESTADO DEL FORMULARIO
    // =========================================================
    // Cada propiedad corresponde directamente con una columna
    // de la tabla productos de MySQL.
    const [producto, setProducto] = useState({
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
        estado: "activo"
    });

    // =========================================================
    // CAMBIO DE LOS INPUTS
    // =========================================================
    // Cada vez que el usuario escribe o selecciona algo,
    // actualizamos únicamente el campo correspondiente.
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProducto({
            ...producto,
            [name]: value
        });
    };

    // =========================================================
    // GUARDAR PRODUCTO
    // =========================================================
    const guardarProducto = async (e) => {
        e.preventDefault();

        try {
            // =====================================================
            // OBTENER TOKEN JWT
            // =====================================================
            // El token se guardó en localStorage al iniciar sesión.
            const token = localStorage.getItem("mjbe_token");

            if (!token) {
                throw new Error(
                    "No se encontró el token de sesión. Inicie sesión nuevamente."
                );
            }

            // =====================================================
            // DATOS QUE SE ENVÍAN A LARAVEL
            // =====================================================
            // Convertimos los campos numéricos antes de enviarlos.
            // Esto evita mandar valores como "10" en lugar de 10.
            const productoEnviar = {
                img_producto: producto.img_producto,
                nombre_producto: producto.nombre_producto,
                descripcion: producto.descripcion,
                color_producto: producto.color_producto,
                marca_producto: producto.marca_producto,
                cant_producto: Number(producto.cant_producto),
                modelo: producto.modelo,
                id_talla: Number(producto.id_talla),
                id_proveedor: Number(producto.id_proveedor),
                id_local: Number(producto.id_local),
                valor_unitario: Number(producto.valor_unitario),
                estado: producto.estado
            };

            console.log("Datos enviados a Laravel:", productoEnviar);

            // =====================================================
            // PETICIÓN POST
            // =====================================================
            const response = await fetch(`${API_URL}/productos`, {
                method: "POST",

                headers: {
                    // Enviar el JWT para autenticar la creación
                    // del producto en Laravel.
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(productoEnviar)
            });

            // Intentamos convertir la respuesta de Laravel a JSON.
            const datos = await response.json();

            // =====================================================
            // MANEJO DE ERRORES
            // =====================================================
            if (!response.ok) {
                console.error("Error de Laravel:", datos);

                // Mostrar los errores de validación si existen.
                if (datos.errores) {
                    console.error(
                        "Errores de validación:",
                        datos.errores
                    );
                }

                if (datos.errors) {
                    console.error(
                        "Errores de validación:",
                        datos.errors
                    );
                }

                throw new Error(
                    datos.mensaje ||
                    datos.message ||
                    "No se pudo guardar el producto"
                );
            }

            // =====================================================
            // PRODUCTO CREADO
            // =====================================================
            console.log(
                "Producto creado correctamente:",
                datos
            );

            alert("✅ Producto creado correctamente.");

            // =====================================================
            // LIMPIAR FORMULARIO
            // =====================================================
            setProducto({
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
                estado: "activo"
            });

            // =====================================================
            // REGRESAR A LA LISTA DE PRODUCTOS
            // =====================================================
            navigate("/VerProductos");

        } catch (error) {
            console.error(
                "Error al crear producto:",
                error
            );

            alert(
                error.message ||
                "❌ No se pudo crear el producto. " +
                "Revisa la consola para más información."
            );
        }
    };

    // =========================================================
    // FORMULARIO
    // =========================================================
    return (
        <>
            <NavAdmi />

            <div className="container mt-4 mb-5">

                <h2 className="mb-4">
                    Crear Producto
                </h2>

                <form onSubmit={guardarProducto}>

                    {/* =================================================
                        IMAGEN
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            URL de imagen
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="img_producto"
                            value={producto.img_producto}
                            onChange={handleChange}
                            placeholder="Ej: img/producto.jpg"
                            required
                            maxLength={255}
                        />
                    </div>

                    {/* =================================================
                        NOMBRE
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Nombre del producto
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="nombre_producto"
                            value={producto.nombre_producto}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            required
                            maxLength={40}
                        />
                    </div>

                    {/* =================================================
                        DESCRIPCIÓN
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Descripción
                        </label>

                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={producto.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción del producto"
                            required
                            maxLength={100}
                            rows="3"
                        />
                    </div>

                    {/* =================================================
                        COLOR
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Color
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="color_producto"
                            value={producto.color_producto}
                            onChange={handleChange}
                            placeholder="Ej: Negro"
                            required
                            maxLength={20}
                        />
                    </div>

                    {/* =================================================
                        MARCA
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Marca
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="marca_producto"
                            value={producto.marca_producto}
                            onChange={handleChange}
                            placeholder="Ej: Shimano"
                            required
                            maxLength={20}
                        />
                    </div>

                    {/* =================================================
                        CANTIDAD
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Cantidad
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="cant_producto"
                            value={producto.cant_producto}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    {/* =================================================
                        MODELO
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Modelo
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="modelo"
                            value={producto.modelo}
                            onChange={handleChange}
                            placeholder="Modelo"
                            required
                            maxLength={20}
                        />
                    </div>

                    {/* =================================================
                        TALLA
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Talla / Medida
                        </label>

                        <select
                            className="form-select"
                            name="id_talla"
                            value={producto.id_talla}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccione una talla
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

                    {/* =================================================
                        PROVEEDOR
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Proveedor
                        </label>

                        <select
                            className="form-select"
                            name="id_proveedor"
                            value={producto.id_proveedor}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccione un proveedor
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

                    {/* =================================================
                        LOCAL
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Local
                        </label>

                        <select
                            className="form-select"
                            name="id_local"
                            value={producto.id_local}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccione un local
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

                    {/* =================================================
                        VALOR UNITARIO
                    ================================================= */}
                    <div className="mb-3">
                        <label className="form-label">
                            Valor unitario
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="valor_unitario"
                            value={producto.valor_unitario}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    {/* =================================================
                        ESTADO
                    ================================================= */}
                    <div className="mb-4">
                        <label className="form-label">
                            Estado
                        </label>

                        <select
                            className="form-select"
                            name="estado"
                            value={producto.estado}
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

                    {/* =================================================
                        BOTONES
                    ================================================= */}
                    <div className="d-flex gap-2">

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Crear producto
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/VerProductos")}
                        >
                            Cancelar
                        </button>

                    </div>

                </form>
            </div>

            <FooterAdmi />
        </>
    );
}

export default CrearProducto;