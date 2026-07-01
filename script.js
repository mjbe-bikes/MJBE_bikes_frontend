const formulario = document.getElementById("formPedido");
const tabla = document.querySelector("#tablaPedidos tbody");

// Cargar pedidos guardados al abrir la página
document.addEventListener("DOMContentLoaded", cargarPedidos);

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const cliente = document.getElementById("cliente").value;
    const documento = document.getElementById("documento").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const categoria = document.getElementById("categoria").value;
    const producto = document.getElementById("producto").value;
    const cantidad = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;
    const observaciones = document.getElementById("observaciones").value;

    if(
        cliente.trim() === "" ||
        documento.trim() === "" ||
        telefono.trim() === "" ||
        direccion.trim() === "" ||
        categoria.trim() === "" ||
        producto.trim() === "" ||
        cantidad.trim() === "" ||
        precio.trim() === ""
        ){  
        alert("Debes completar todos los campos obligatorios.");
        return;
        }   


    const pedido = {
        cliente,
        documento,
        telefono,
        direccion,
        categoria,
        producto,
        cantidad,
        precio,
        observaciones
    };

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    mostrarPedidos();

    formulario.reset();

});

function mostrarPedidos(){

    tabla.innerHTML = "";

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.forEach((pedido, index)=>{

        const total = pedido.cantidad * pedido.precio;

        tabla.innerHTML += `
        <tr>

            <td>${pedido.cliente}</td>

            <td>${pedido.documento}</td>

            <td>${pedido.producto}</td>

            <td>${pedido.cantidad}</td>

            <td>$${Number(pedido.precio).toLocaleString()}</td>

            <td>$${Number(total).toLocaleString()}</td>

            <td>${pedido.direccion}</td>

            <td>${pedido.observaciones}</td>

            <td>
                <button class="btn btn-warning btn-sm"
                onclick="editarPedido(${index})">
                Editar
                </button>

                <button class="btn btn-danger btn-sm"
                onclick="eliminarPedido(${index})">
                Eliminar
                </button>
            </td>
            

        </tr>
        `;

    });

}
    function eliminarPedido(indice){

        let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

        pedidos.splice(indice,1);

        localStorage.setItem("pedidos",JSON.stringify(pedidos));

        mostrarPedidos();

    }   


function editarPedido(indice){

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    let pedido = pedidos[indice];

    document.getElementById("cliente").value = pedido.cliente;
    document.getElementById("documento").value = pedido.documento;
    document.getElementById("telefono").value = pedido.telefono;
    document.getElementById("direccion").value = pedido.direccion;
    document.getElementById("categoria").value = pedido.categoria;
    document.getElementById("producto").value = pedido.producto;
    document.getElementById("cantidad").value = pedido.cantidad;
    document.getElementById("precio").value = pedido.precio;
    document.getElementById("observaciones").value = pedido.observaciones;

    pedidos.splice(indice,1);

    localStorage.setItem("pedidos",JSON.stringify(pedidos));

    mostrarPedidos();

}

function cargarPedidos(){

    mostrarPedidos();

} 