import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavAdmi from "../../componentes/NavAdmi";
import FooterAdmi from "../../componentes/FooterAdmi";

function VerProductos() {

  const [productos, setProductos] = useState([]);

  const [filtroPor, setFiltroPor] = useState("nombre_producto");
  const [valorFiltro, setValorFiltro] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  
    useEffect(() => {
        fetch("http://localhost:3001/productos")
            .then(res => res.json())
            .then(data => {
                setProductos(data);
                setProductosFiltrados(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const aplicarFiltro = () => {
        const filtrados = productos.filter((p) => {
            const valor = p[filtroPor];

            if (!valor) return false;

            return valor
                .toString()
                .toLowerCase()
                .includes(valorFiltro.toLowerCase());
        });

        setProductosFiltrados(filtrados);
    };

  return (
    <>
      <div className="app print-area">

        <NavAdmi />

        <div className="contenido">
          <div className="maincontainer-fluid py-4">
            <div className="container mt-12">
              <div className="card shadow">

                {/* ENCABEZADO */}
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                  <div>
                    <h4 className="mb-0">📦 Productos</h4>
                    <small>Listado de productos registrados</small>
                  </div>

                  <Dropdown className="no-print">
                    <Dropdown.Toggle variant="light">
                      Filtrar
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>

                      <label className="form-label">Filtrar por</label>

                      <select
                        className="form-select mb-3"
                        value={filtroPor}
                        onChange={(e) => setFiltroPor(e.target.value)}
                      >
                        <option value="nombre_producto">Producto</option>
                        <option value="modelo">Modelo</option>
                        <option value="marca_producto">Marca</option>
                        <option value="color_producto">Color</option>
                        <option value="cant_producto">Cantidad</option>
                        <option value="valor_unitario">Precio</option>
                        <option value="tipo_medida">Medida</option>
                        <option value="estado">Estado</option>
                        <option value="nombre_proveedor">Proveedor</option>
                      </select>

                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Ingrese el valor"
                        value={valorFiltro}
                        onChange={(e) => setValorFiltro(e.target.value)}
                      />

                      <button
                        className="btn btn-success w-100"
                        onClick={aplicarFiltro}
                      >
                        Aplicar filtro
                      </button>

                    </Dropdown.Menu>
                  </Dropdown>

                </div>

                {/* TABLA */}
                <div className="card-body">

                  <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                      <thead className="table-success text-center">
                        <tr>
                          <th>#ID</th>
                          <th>Producto</th>
                          <th>Modelo</th>
                          <th>Marca</th>
                          <th>Color</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Medida</th>
                          <th>Estado</th>
                          <th>Proveedor</th>
                        </tr>
                      </thead>

                      <tbody>
                        {productosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No hay productos disponibles
                            </td>
                          </tr>
                        ) : (
                          productosFiltrados.map((p) => (
                            <tr key={p.id} className="text-center">
                              <td>{p.id}</td>
                              <td>{p.nombre_producto}</td>
                              <td>{p.modelo}</td>
                              <td>{p.marca_producto}</td>
                              <td>{p.color_producto}</td>
                              <td>{p.cant_producto}</td>
                              <td>${p.valor_unitario}</td>
                              <td>{p.tipo_medida}</td>
                              <td>{p.estado}</td>
                              <td>{p.nombre_proveedor}</td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>

                  </div>

                  {/* BOTÓN IMPRIMIR */}
                  <div className="btn no-print mx-auto d-block">
                    <button
                      className="btn bg-success text-white ms-2 col-2"
                      onClick={() => window.print()}
                    >
                      <i className="bi bi-printer-fill me-2"></i>
                      Imprimir
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <FooterAdmi />

      </div>

    </>
  );
}

export default VerProductos;