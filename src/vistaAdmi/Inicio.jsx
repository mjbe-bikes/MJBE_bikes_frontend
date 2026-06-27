import { Link } from "react-router-dom";

import NavAdmi from '../componentes/NavAdmi'
import FooterAdmi from '../componentes/FooterAdmi'

function Inicio() {
  return (

        <div className='app'> 

            <NavAdmi />
            <div className="container py-4 contenido">

            {/* Título */}
            <div className="card shadow mb-4">
                <div className="card-header bg-primary text-white">
                <h3 className="mb-0">📊 Reportes y Novedades</h3>
                </div>

                <div className="card-body">

                {/* Tarjetas de reportes */}
                <div className="row g-4">

                    <div className="col-md-4">
                    <div className="card border-success h-100 shadow-sm">
                        <div className="card-body text-center">
                        <h1>🚲</h1>
                        <h5>Productos Registrados</h5>
                        <h2 className="text-success">120</h2>
                        </div>
                    </div>
                    </div>

                    <div className="col-md-4">
                    <div className="card border-warning h-100 shadow-sm">
                        <div className="card-body text-center">
                        <h1>📦</h1>
                        <h5>Productos Bajos en Stock</h5>
                        <h2 className="text-warning">8</h2>
                        </div>
                    </div>
                    </div>

                    <div className="col-md-4">
                    <div className="card border-danger h-100 shadow-sm">
                        <div className="card-body text-center">
                        <h1>⚠️</h1>
                        <h5>Productos Inactivos</h5>
                        <h2 className="text-danger">5</h2>
                        </div>
                    </div>
                    </div>

                </div>

                </div>
            </div>

            {/* Sección de novedades */}
            <div className="card shadow">
                    <div className="card-header bg-success text-white">
                    <h4 className="mb-0">📰 Últimas Novedades</h4>
                    </div>

                    <div className="card-body">

                    <div className="alert alert-info">
                        <strong>Nuevo proveedor agregado:</strong> Bicicletas Pro SAS.
                    </div>

                    <div className="alert alert-warning">
                        <strong>Stock bajo:</strong> La bicicleta MTB X100 tiene menos de 5 unidades.
                    </div>

                    <div className="alert alert-success">
                        <strong>Actualización:</strong> Se registraron 15 nuevos productos esta semana.
                    </div>

                    <div className="alert alert-danger">
                        <strong>Atención:</strong> Hay productos pendientes por revisión.
                    </div>
                    <div className="col-12 mt-4 d-flex justify-content-center gap-2">
                        <Link type="submit" to="/VerProductos" className="btn btn-outline-success px-4" >
                            Ver Productos
                        </Link>
                    </div>
                </div>
                
            </div>
                    
            </div>
            <FooterAdmi/>
        </div>
  );
}

export default Inicio;