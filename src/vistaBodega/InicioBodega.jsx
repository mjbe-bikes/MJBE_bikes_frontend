import { useState, useEffect } from "react";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega";

function InicioBodega() {

    const dashboard = {
        resumen: {
            totalProductos: 320,
            productosActivos: 285,
            stockBajo: 18,
            sinStock: 7,
            entradasHoy: 42,
            salidasHoy: 31
        },

        movimientos: [
            {
                id: 1,
                producto: "Llanta MTB 29",
                tipo: "Entrada",
                cantidad: 15,
                fecha: "29/06/2026"
            },
            {
                id: 2,
                producto: "Cadena Shimano",
                tipo: "Salida",
                cantidad: 8,
                fecha: "29/06/2026"
            },
            {
                id: 3,
                producto: "Pastillas de Freno",
                tipo: "Entrada",
                cantidad: 25,
                fecha: "28/06/2026"
            },
            {
                id: 4,
                producto: "Casco GW",
                tipo: "Salida",
                cantidad: 4,
                fecha: "28/06/2026"
            }
        ],

        alertas: [
            {
                id: 1,
                producto: "Cámara Rin 26",
                stock: 2
            },
            {
                id: 2,
                producto: "Pedales Aluminio",
                stock: 1
            },
            {
                id: 3,
                producto: "Guantes Ciclismo",
                stock: 3
            }
        ]
    };

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
                                        <h6 className="mb-1">
                                            {movimiento.producto}
                                        </h6>

                                        <small>
                                            {movimiento.tipo} - Cantidad: {movimiento.cantidad}
                                        </small>
                                    </div>

                                    <span className="badge bg-primary">
                                        {movimiento.fecha}
                                    </span>

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

                                    <span className="badge bg-danger">
                                        Stock: {alerta.stock}
                                    </span>

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