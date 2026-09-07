import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import NavAdmi from "../componentes/NavAdmi";
import FooterAdmi from "../componentes/FooterAdmi";

function Inicio() {
  

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/reportes/dashboard")
            .then(res => res.json())
            .then(data => {
                setDashboard(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <h3>Cargando dashboard...</h3>
            </div>
        );
    }

    const resumen = dashboard?.resumen || {};


    return (
        <div className="app">

            <NavAdmi />

            <div className="container py-4 contenido">

                {/* ================= RESUMEN GENERAL ================= */}

                <div className="card shadow mb-4">
                    <div className="card-header bg-primary text-white">
                        <h3 className="mb-0">📊 Resumen General</h3>
                    </div>

                    <div className="card-body">

                        <div className="row g-4">

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-primary shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>🚲</h1>
                                        <h6>Total Productos</h6>
                                        <h2>{dashboard?.resumen?.totalProductos}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-success shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>💰</h1>
                                        <h6>Total Clientes</h6>
                                        <h2>{dashboard?.resumen?.totalClientes}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-info shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>📅</h1>
                                        <h6>Total Ventas</h6>
                                        <h2>{dashboard?.resumen?.totalVentas}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-warning shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>📦</h1>
                                        <h6>Ventas Hoy</h6>
                                        <h2>{dashboard?.resumen?.ventasHoy}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-danger shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>⚠️</h1>
                                        <h6>Ventas del Mes</h6>
                                        <h2>{dashboard?.resumen?.ventasMes}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card border-dark shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <h1>👥</h1>
                                        <h6>Stock Bajo</h6>
                                        <h2>{dashboard.resumen.stockBajo}</h2>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                {/* ================= REPORTES ================= */}

                <div className="card shadow mb-4">

                    <div className="card-header bg-success text-white">
                        <h4 className="mb-0">📑 Reportes</h4>
                    </div>

                    <div className="card-body">

                        {dashboard.reportes.length > 0 ? (

                            <div className="list-group">

                                {dashboard.reportes.map((reporte) => (

                                    <div
                                        key={reporte.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <h6 className="mb-1">{reporte.titulo}</h6>
                                            <small>{reporte.descripcion}</small>
                                        </div>

                                        <span className="badge bg-primary">
                                            {reporte.fecha}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="text-center text-muted py-3">
                                No hay reportes disponibles.
                            </div>

                        )}


                    </div>

                </div>

                {/* ================= NOVEDADES ================= */}

                <div className="card shadow">

                    <div className="card-header bg-warning">
                        <h4 className="mb-0">📰 Novedades</h4>
                    </div>

                    <div className="card-body">

                        {dashboard.novedades.length > 0 ? (

                            <div className="list-group">

                                {dashboard.novedades.map((novedad) => (

                                    <div
                                        key={novedad.id}
                                        className="list-group-item"
                                    >
                                        <h6>{novedad.titulo}</h6>

                                        <p className="mb-1">
                                            {novedad.descripcion}
                                        </p>

                                        <small className="text-muted">
                                            {novedad.fecha}
                                        </small>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="text-center text-muted py-3">
                                No hay novedades registradas.
                            </div>

                        )}

                       

                    </div>

                </div>

            </div>

            <FooterAdmi />

        </div>
    );
}

export default Inicio;