import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);

      if (existente) {
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) {
      setCarrito((actual) => actual.filter((item) => item.id !== id));
      return;
    }

    setCarrito((actual) =>
      actual.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const quitarDelCarrito = (id) => {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  const precioTotal = carrito.reduce(
    (total, item) => total + Number(item.valor_unitario) * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        quitarDelCarrito,
        limpiarCarrito,
        cantidadTotal,
        precioTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function Carrito() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("El carrito debe usarse dentro de CartProvider");
  }

  return context;
}

export function useCart() {
  return Carrito();
}
