import Navar from "./navar";
import Footer from "./footer";

function Cliente () {
  
return (
  <>

  <Navar />

 {/* Cliente */}

          <div className="col-md-6">

            <div className="card shadow-sm mb-4">

              <div className="card-header">
                Cliente
              </div>

              <div className="card-body">

                <label className="form-label">
                  Documento
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                />

                <div className="d-flex gap-2">

                  <button className="btn btn-primary">
                    Buscar Cliente
                  </button>

                  <button className="btn btn-success">
                    Registrar Cliente
                  </button>

                </div>

              </div>

            </div>

          </div>

        
    </>

);
}

export default Cliente;
