import Navar from "./navar";
import Footer from "./footer";

function Historialventas() {
    return(

        <>
      <Navar />
          
        {/* Contenedor principal */}
        <div className="container-fluid px-4 py-4">
           {/* Historial de ventas */}
           <div className="card shadow-sm mb-4"> 
             {/* Encabezado */}
             <div className="card-header">
                Historial de ventas

            </div>

            {/* Contenido */}
            <div className="card-body">
                {/* Buscador */}
                <div className="row mb-4 g-2">
                    <div className="col-md-8">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="buscar venta..."
                        />
                        </div>

                        <div className="col-md-4">
                            <button className="btn btn-primary">
                                buscar
                            </button> 
                        </div>
                    </div>

                {/* Tabla */}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                              <th>ID Venta</th> 
                              <th>Cliente</th>   
                              <th>Fecha</th>      
                              <th>Total</th>   
                              <th>Estado</th>   
                              
                            </tr>  
                        </thead>

                        <tbody>
                            <tr>
                                <td>001</td>
                                <td>Juan Pérez</td>
                                <td>01/08/2026</td>
                                <td>$500.000</td>
                                <td>Completada</td>

                                
                            </tr>

                            <tr>
                             <td>002</td>
                             <td>Pedro Gómez</td>
                             <td>02/08/2026</td>
                             <td>$750.000</td>
                             <td>Completada</td>

                             
                            </tr>
                    </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>




    
    </>
    );
    
}
export default Historialventas;