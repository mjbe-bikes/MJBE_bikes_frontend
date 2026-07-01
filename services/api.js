import axios from "axios";

const BASE_URL = "http://localhost:3001";

// PRODUCTOS
export const getProductos = () =>
  axios.get(`${BASE_URL}/productos`).then(res => res.data);

// CLIENTES
export const getClientes = () =>
  axios.get(`${BASE_URL}/clientes`).then(res => res.data);

// PEDIDOS
export const getPedidos = () =>
  axios.get(`${BASE_URL}/pedidos`).then(res => res.data);

// DETALLE
export const getDetallePedidos = () =>
  axios.get(`${BASE_URL}/detallePedidos`).then(res => res.data);