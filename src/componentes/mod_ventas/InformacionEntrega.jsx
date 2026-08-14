import Navar from "./navar";
import Footer from "./footer";

function InfoEntrega () {
    return(
        <>
        <Navar />
    

{/* Información de Entrega */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            Información de Entrega
          </div>

          <div className="card-body">

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Dirección"
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Ciudad"
            />

            <textarea
              className="form-control"
              rows="3"
              placeholder="Observaciones"
            ></textarea>

          </div>

          </div>
        </>
    );
}

export default InfoEntrega;
