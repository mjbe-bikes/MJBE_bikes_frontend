// Alta de producto (bodega)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

const API_URL = "http://localhost:8000/api/productos";
const TALLAS_URL = "http://localhost:8000/api/tallas";
const PROVEEDORES_URL = "http://localhost:8000/api/proveedores";
const LOCALES_URL = "http://localhost:8000/api/locales";

function CrearProducto() {
    const navigate = useNavigate();

    const [tallas, setTallas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [locales, setLocales] = useState([]);

    // Catálogos reales: talla (con su medida), proveedor y local.
    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [tallasRes, proveedoresRes, localesRes] = await Promise.all([
                    fetch(TALLAS_URL, { credentials: "include" }),
                    fetch(PROVEEDORES_URL, { credentials: "include" }),
                    fetch(LOCALES_URL, { credentials: "include" })
                ]);

                setTallas(await tallasRes.json());
                setProveedores(await proveedoresRes.json());
                setLocales(await localesRes.json());
            } catch (error) {
                console.error("Error cargando catálogos:", error);
            }
        };

        cargarCatalogos();
    }, []);

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
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...producto,
                    cant_producto: Number(producto.cant_producto),
                    id_talla: Number(producto.id_talla),
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
                id_talla: "",
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
            <NavBodega />
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
                                        <label>Talla</label>
                                        <select
                                            className="form-select"
                                            name="id_talla"
                                            value={producto.id_talla}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione</option>
                                            {tallas.map((t) => (
                                                <option key={t.id} value={t.id}>{t.talla} ({t.medida?.tipo_medida})</option>
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
                                                <option key={p.id} value={p.id}>{p.nombre_proveedor}</option>
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
                                                <option key={l.id} value={l.id}>{l.nombre_local}</option>
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
            <FooterBodega />
        </div>
    );
}

export default CrearProducto;