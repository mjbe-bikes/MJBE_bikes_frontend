import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

const API_URL = "http://localhost:3001/productos";

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
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...producto,
                    cant_producto: Number(producto.cant_producto),
                    id_medida: Number(producto.id_medida),
                    id_proveedor: Number(producto.id_proveedor),
                    id_local: Number(producto.id_local),
                    valor_unitario: Number(producto.valor_unitario)
                })
            });

            if (!response.ok) throw new Error("No se pudo guardar el producto");

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

            navigate("/VerProductos");
        } catch (error) {
            console.error(error);
            alert("❌ No se pudo crear el producto.");
        }
    };

    return (
        <div className="app">
            <NavAdmi />
            <div className="contenido">
                <div className="container mt-4 py-3">
                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h4>➕ Crear Producto</h4>
                        </div>

                        <div className="card-body">
                            <form onSubmit={guardarProducto}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Imagen (URL)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="img_producto"
                                            value={producto.img_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Nombre Producto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre_producto"
                                            value={producto.nombre_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Descripción</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="descripcion"
                                            value={producto.descripcion}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Color</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="color_producto"
                                            value={producto.color_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Marca</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="marca_producto"
                                            value={producto.marca_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Modelo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="modelo"
                                            value={producto.modelo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Cantidad</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="cant_producto"
                                            value={producto.cant_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Valor Unitario</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="valor_unitario"
                                            value={producto.valor_unitario}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Medida</label>
                                        <select
                                            className="form-select"
                                            name="id_medida"
                                            value={producto.id_medida}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione</option>
                                            {medidas.map((m) => (
                                                <option key={m.id} value={m.id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Proveedor</label>
                                        <select
                                            className="form-select"
                                            name="id_proveedor"
                                            value={producto.id_proveedor}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione</option>
                                            {proveedores.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Local</label>
                                        <select
                                            className="form-select"
                                            name="id_local"
                                            value={producto.id_local}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione</option>
                                            {locales.map((l) => (
                                                <option key={l.id} value={l.id}>{l.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Estado</label>
                                        <select
                                            className="form-select"
                                            name="estado"
                                            value={producto.estado}
                                            onChange={handleChange}
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="btn btn-success w-100">💾 Guardar Producto</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <FooterAdmi />
        </div>
    );
}

export default CrearProducto;