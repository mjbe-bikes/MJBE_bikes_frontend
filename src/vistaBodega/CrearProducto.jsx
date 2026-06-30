import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBodega from "../componentes/NavBodega";
import FooterBodega from "../componentes/FooterBodega"

function CrearProducto() {

  const navigate = useNavigate();

  const medidas = [
    { id: 1, nombre: "Unidad" },
    { id: 2, nombre: "Caja" },
    { id: 3, nombre: "Kilogramo" }
  ];

  const proveedores = [
    { id: 1, nombre: "Shimano Import" },
    { id: 2, nombre: "GW Distribuciones" }
  ];

  const locales = [
    { id: 1, nombre: "Local Centro" },
    { id: 2, nombre: "Local Norte" }
  ];

  const [producto, setProducto] = useState({
    img_producto: "",
    nombre_producto: "",
    descripcion: "",
    color_producto: "",
    marca_producto: "",
    cant_producto: "",
    modelo: "",
    id_medida: "",
    id_proveedor: "",
    id_local: "",
    valor_unitario: "",
    estado: "activo"
  });

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const guardarProducto = (e) => {
    e.preventDefault();

    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || [];

    const nuevoProducto = {
      id: Date.now(),
      ...producto
    };

    const nuevos = [...productosGuardados, nuevoProducto];

    localStorage.setItem("productos", JSON.stringify(nuevos));

    alert("✅ Producto creado correctamente");

    setProducto({
      img_producto: "",
      nombre_producto: "",
      descripcion: "",
      color_producto: "",
      marca_producto: "",
      cant_producto: "",
      modelo: "",
      id_medida: "",
      id_proveedor: "",
      id_local: "",
      valor_unitario: "",
      estado: "activo"
    });

    navigate("/VerProductos");
  };

  return (
    <div className="app">

        <NavBodega />
        <div className="contenido">
            <div className="container mt-4 py-3">
                <div className="card shadow">

                <div className="card-header bg-success text-white">
                    <h4>➕ Crear Producto</h4>
                </div>

                <div className="card-body">

                    <form onSubmit={guardarProducto}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                        <label>Imagen (URL)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="img_producto"
                            value={producto.img_producto}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-6 mb-3">
                        <label>Nombre Producto</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre_producto"
                            value={producto.nombre_producto}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-12 mb-3">
                        <label>Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            name="descripcion"
                            value={producto.descripcion}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-4 mb-3">
                        <label>Color</label>
                        <input
                            type="text"
                            className="form-control"
                            name="color_producto"
                            value={producto.color_producto}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-4 mb-3">
                        <label>Marca</label>
                        <input
                            type="text"
                            className="form-control"
                            name="marca_producto"
                            value={producto.marca_producto}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-4 mb-3">
                        <label>Modelo</label>
                        <input
                            type="text"
                            className="form-control"
                            name="modelo"
                            value={producto.modelo}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-4 mb-3">
                        <label>Cantidad</label>
                        <input
                            type="number"
                            className="form-control"
                            name="cant_producto"
                            value={producto.cant_producto}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-4 mb-3">
                        <label>Valor Unitario</label>
                        <input
                            type="number"
                            className="form-control"
                            name="valor_unitario"
                            value={producto.valor_unitario}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="col-md-4 mb-3">
                        <label>Medida</label>
                        <select
                            className="form-select"
                            name="id_medida"
                            value={producto.id_medida}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {medidas.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                        </div>

                        <div className="col-md-6 mb-3">
                        <label>Proveedor</label>
                        <select
                            className="form-select"
                            name="id_proveedor"
                            value={producto.id_proveedor}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {proveedores.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                        </div>

                        <div className="col-md-6 mb-3">
                        <label>Local</label>
                        <select
                            className="form-select"
                            name="id_local"
                            value={producto.id_local}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {locales.map(l => (
                            <option key={l.id} value={l.id}>{l.nombre}</option>
                            ))}
                        </select>
                        </div>

                        <div className="col-md-6 mb-3">
                        <label>Estado</label>
                        <select
                            className="form-select"
                            name="estado"
                            value={producto.estado}
                            onChange={handleChange}
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                        </div>

                    </div>

                    <button className="btn btn-success w-100">
                        💾 Guardar Producto
                    </button>

                    </form>

                </div>

                </div>
            </div>
        </div>
        <FooterBodega/>

    </div>
  );
}

export default CrearProducto;