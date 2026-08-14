import Navar from "./navar";
import Footer from "./footer";

 {/* Productos */}
function Productos () {
    
    return(
         <>
      <Navar />

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            Productos
          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-8">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar producto"
                />

              </div>

              <div className="col-md-4 d-flex gap-2 mt-3 mt-md-0">

                <button className="btn btn-primary">
                  Buscar Producto
                </button>

                <button className="btn btn-success">
                  Agregar
                </button>

              </div>

            </div>

          </div>

        </div>
        
        </>
        

    );
}


export default Productos;