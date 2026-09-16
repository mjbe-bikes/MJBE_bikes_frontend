// Alta de producto (admin)

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

// URL de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function CrearProducto() {
    const navigate = useNavigate();

    const medidas = [
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
        { id: 30, nombre: "Media (Ancho de Neumático)" }
    ];

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
        { id: 25, nombre: "CicloPartes Nacionales" }
    ];

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
        { id: 25, nombre: "MJBE Tintal" }
    ];

    const [producto, setProducto] = useState({
        img_producto: "",
        nombre_producto: "",
        descripcion: "",
        color_producto: "",
        marca_producto: "",
        cant_producto: "",
        modelo: "",
        id_medida: "",
        id_proveedor: "",
        id_local: "",
        valor_unitario: "",
        estado: "activo"
    });

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const guardarProducto = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    ...producto,

                    // Convertimos los campos numéricos antes de enviarlos
                    cant_producto: Number(producto.cant_producto),
                    id_medida: Number(producto.id_medida),
                    id_proveedor: Number(producto.id_proveedor),
                    id_local: Number(producto.id_local),
                    valor_unitario: Number(producto.valor_unitario)
                })
            });

            // Intentamos leer la respuesta de Laravel
            const datos = await response.json();

            // Si Laravel devuelve un error
            if (!response.ok) {
                console.error("Error de Laravel:", datos);

                // Laravel normalmente usa "errors" para validaciones
                if (datos.errors) {
                    console.error("Errores de validación:", datos.errors);
                }

                // Por si nuestro controlador usa "errores"
                if (datos.errores) {
                    console.error("Errores de validación:", datos.errores);
                }

                throw new Error(
                    datos.mensaje ||
                    datos.message ||
                    "No se pudo guardar el producto"
                );
            }

            console.log("Producto creado correctamente:", datos);

            // Limpiar formulario
            setProducto({
                img_producto: "",
                nombre_producto: "",
                descripcion: "",
                color_producto: "",
                marca_producto: "",
                cant_producto: "",
                modelo: "",
                id_medida: "",
                id_proveedor: "",
                id_local: "",
                valor_unitario: "",
                estado: "activo"
            });

            // Regresar a la lista de productos
            navigate("/VerProductos");

        } catch (error) {
            console.error("Error al crear producto:", error);
            alert("❌ No se pudo crear el producto.");
        }
    };

    // El JSX de tu formulario original continúa aquí.
    // No es necesario cambiarlo para adaptar la API.

    return (
        <>
            <NavAdmi />

            <div className="container mt-4">
                <h2>Crear Producto</h2>

                <form onSubmit={guardarProducto}>
                    {/* Aquí va el formulario que ya tenías */}
                </form>
            </div>

            <FooterAdmi />
        </>
    );
}

export default CrearProducto;