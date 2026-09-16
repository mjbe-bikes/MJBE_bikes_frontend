// Panel de inicio del administrador

import { useState, useEffect } from "react";

import NavAdmi from "../componentes/NavAdmi";
import FooterAdmi from "../componentes/FooterAdmi";

// URL base de la API Laravel
const API_URL = "http://127.0.0.1:8000/api";

function InicioAdmin() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDashboard = async () => {
            try {
                // Consultamos los datos directamente desde Laravel
                const [productosRes, clientesRes, ventasRes] = await Promise.all([
                    fetch(`${API_URL}/productos`),
                    fetch(`${API_URL}/clientes`),
                    fetch(`${API_URL}/ventas`),
                ]);

                // Verificamos que las respuestas sean correctas
                if (!productosRes.ok || !clientesRes.ok || !ventasRes.ok) {
                    throw new Error("No se pudieron cargar los datos del dashboard.");
                }

                // Convertimos las respuestas a JSON
                const productosData = await productosRes.json();
                const clientesData = await clientesRes.json();
                const ventasData = await ventasRes.json();

                // Algunos endpoints pueden devolver directamente un arreglo
                // y otros pueden devolverlo dentro de una propiedad.
                const productos = Array.isArray(productosData)
                    ? productosData
                    : productosData.productos || [];

                const clientes = Array.isArray(clientesData)
                    ? clientesData
                    : clientesData.clientes || [];

                const ventas = Array.isArray(ventasData)
                    ? ventasData
                    : ventasData.ventas || [];

                // Fecha actual para calcular las ventas del día y del mes
                const ahora = new Date();

                // Ventas realizadas hoy
                const ventasHoy = ventas.filter((venta) => {
                    if (!venta.fecha) return false;

                    const fechaVenta = new Date(venta.fecha);

                    return (
                        fechaVenta.getDate() === ahora.getDate() &&
                        fechaVenta.getMonth() === ahora.getMonth() &&
                        fechaVenta.getFullYear() === ahora.getFullYear()
                    );
                }).length;

                // Ventas realizadas durante el mes actual
                const ventasMes = ventas.filter((venta) => {
                    if (!venta.fecha) return false;

                    const fechaVenta = new Date(venta.fecha);

                    return (
                        fechaVenta.getMonth() === ahora.getMonth() &&
                        fechaVenta.getFullYear() === ahora.getFullYear()
                    );
                }).length;

                // Productos con stock bajo.
                // Se considera stock bajo cuando hay 5 unidades o menos.
                const stockBajo = productos.filter((producto) => {
                    return Number(producto.cant_producto) <= 5;
                }).length;

                // Construimos el objeto que utilizará el dashboard
                setDashboard({
                    resumen: {
                        totalProductos: productos.length,
                        totalClientes: clientes.length,
                        totalVentas: ventas.length,
                        ventasHoy,
                        ventasMes,
                        stockBajo,
                    },

                    // Actualmente no existen tablas de reportes en la BD.
                    reportes: [],

                    // Actualmente no existen tablas de novedades en la BD.
                    novedades: [],
                });
            } catch (error) {
                console.error("Error cargando dashboard:", error);

                // Aunque falle la API, dejamos una estructura válida
                // para evitar errores al renderizar el componente.
                setDashboard({
                    resumen: {
                        totalProductos: 0,
                        totalClientes: 0,
                        totalVentas: 0,
                        ventasHoy: 0,
                        ventasMes: 0,
                        stockBajo: 0,
                    },
                    reportes: [],
                    novedades: [],
                });
            } finally {
                setLoading(false);
            }
        };

        cargarDashboard();
    }, []);

    // Mientras se cargan los datos
    if (loading) {
        return (
            <div className="text-center py-5">
                <h3>Cargando dashboard...</h3>
            </div>
        );
    }

    const resumen = dashboard?.resumen || {};
    const reportes = dashboard?.reportes || [];
    const novedades = dashboard?.novedades || [];

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

                            {/* Total de productos */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-primary shadow-sm h-100">
                                    <div className="card-body text-center">

                                        <h1>🚲</h1>

                                        <h6>Total Productos</h6>

                                        <h2>{resumen.totalProductos}</h2>

                                    </div>
                                </div>
                            </div>

                            {/* Total de clientes */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-success shadow-sm h-100">
                                    <div className="card-body text-center">

                                        <h1>💰</h1>

                                        <h6>Total Clientes</h6>

                                        <h2>{resumen.totalClientes}</h2>

                                    </div>
                                </div>
                            </div>

                            {/* Total de ventas */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-info shadow-sm h-100">
                                    <div className="card-body text-center">

                                        <h1>📅</h1>

                                        <h6>Total Ventas</h6>

                                        <h2>{resumen.totalVentas}</h2>

                                    </div>
                                </div>
                            </div>

                            {/* Ventas del día */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-warning shadow-sm h-100">
                                    <div className="card-body text-center">

                                        <h1>📦</h1>

                                        <h6>Ventas Hoy</h6>

                                        <h2>{resumen.ventasHoy}</h2>

                                    </div>
                                </div>
                            </div>

                            {/* Ventas del mes */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-danger shadow-sm h-100">
                                    <div className="card-body text-center">

                                        <h1>⚠️</h1>

                                        <h6>Ventas del Mes</h6>

                                        <h2>{resumen.ventasMes}</h2>

                                    </div>
                                </div>
                            </div>

                            {/* Productos con stock bajo */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-dark shadow-sm h-100">
                                    <div className="card-body text-center">

                                        <h1>👥</h1>

                                        <h6>Stock Bajo</h6>

                                        <h2>{resumen.stockBajo}</h2>

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

                        {reportes.length > 0 ? (

                            <div className="list-group">

                                {reportes.map((reporte) => (

                                    <div
                                        key={reporte.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >

                                        <div>
                                            <h6 className="mb-1">
                                                {reporte.titulo}
                                            </h6>

                                            <small>
                                                {reporte.descripcion}
                                            </small>
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

                        {novedades.length > 0 ? (

                            <div className="list-group">

                                {novedades.map((novedad) => (

                                    <div
                                        key={novedad.id}
                                        className="list-group-item"
                                    >

                                        <h6>
                                            {novedad.titulo}
                                        </h6>

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

export default InicioAdmin;

