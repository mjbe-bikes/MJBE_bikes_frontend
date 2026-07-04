import { useEffect, useState } from "react";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

function InicioBodega() {
    const [dashboard, setDashboard] = useState({
        resumen: {
            totalProductos: 0,
            productosActivos: 0,
            stockBajo: 0,
            sinStock: 0,
            entradasHoy: 0,
            salidasHoy: 0
        },
        movimientos: [],
        alertas: []
    });

    useEffect(() => {
        const cargarDashboard = async () => {
            try {
                const response = await fetch("http://localhost:3001/productos");
                const productos = await response.json();

                const activos = productos.filter((p) => p.estado === "activo");
                const stockBajo = productos.filter((p) => Number(p.cant_producto) > 0 && Number(p.cant_producto) <= 5);
                const sinStock = productos.filter((p) => Number(p.cant_producto) === 0);
                const alertas = stockBajo.slice(0, 3).map((p) => ({
                    id: p.id,
                    producto: p.nombre_producto,
                    stock: Number(p.cant_producto)
                }));
                const movimientos = productos.slice(0, 4).map((p, index) => ({
                    id: p.id,
                    producto: p.nombre_producto,
                    tipo: index % 2 === 0 ? "Entrada" : "Salida",
                    cantidad: Number(p.cant_producto),
                    fecha: new Date().toLocaleDateString("es-ES")
                }));

                setDashboard({
                    resumen: {
                        totalProductos: productos.length,
                        productosActivos: activos.length,
                        stockBajo: stockBajo.length,
                        sinStock: sinStock.length,
                        entradasHoy: movimientos.filter((m) => m.tipo === "Entrada").length,
                        salidasHoy: movimientos.filter((m) => m.tipo === "Salida").length
                    },
                    movimientos,
                    alertas
                });
            } catch (error) {
                console.error(error);
            }
        };

        cargarDashboard();
    }, []);

    return (
        <div className="app">
            <NavBodega />

            <div className="container py-4 contenido">
                <div className="card shadow mb-4">
                    <div className="card-header bg-primary text-white">
                        <h3 className="mb-0">📦 Resumen de Bodega</h3>
                    </div>

                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-primary shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>📦</h1>
                                        <h6>Total Productos</h6>
                                        <h2>{dashboard?.resumen?.totalProductos}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-success shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>✅</h1>
                                        <h6>Productos Activos</h6>
                                        <h2>{dashboard.resumen.productosActivos}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-warning shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>⚠️</h1>
                                        <h6>Stock Bajo</h6>
                                        <h2>{dashboard.resumen.stockBajo}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-danger shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>❌</h1>
                                        <h6>Sin Stock</h6>
                                        <h2>{dashboard.resumen.sinStock}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-info shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>⬆️</h1>
                                        <h6>Entradas Hoy</h6>
                                        <h2>{dashboard.resumen.entradasHoy}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-dark shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>⬇️</h1>
                                        <h6>Salidas Hoy</h6>
                                        <h2>{dashboard.resumen.salidasHoy}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header bg-success text-white">
                        <h4 className="mb-0">📋 Movimientos Recientes</h4>
                    </div>

                    <div className="card-body">
                        <div className="list-group">
                            {dashboard.movimientos.map((movimiento) => (
                                <div
                                    key={movimiento.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <h6 className="mb-1">{movimiento.producto}</h6>
                                        <small>{movimiento.tipo} - Cantidad: {movimiento.cantidad}</small>
                                    </div>

                                    <span className="badge bg-primary">{movimiento.fecha}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card shadow">
                    <div className="card-header bg-warning">
                        <h4 className="mb-0">⚠️ Alertas de Inventario</h4>
                    </div>

                    <div className="card-body">
                        <div className="list-group">
                            {dashboard.alertas.map((alerta) => (
                                <div
                                    key={alerta.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <h6>{alerta.producto}</h6>
                                    </div>

                                    <span className="badge bg-danger">Stock: {alerta.stock}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <FooterBodega />
        </div>
    );
}

export default InicioBodega;