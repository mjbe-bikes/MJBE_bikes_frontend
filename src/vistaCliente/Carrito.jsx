// Estado global del carrito (React Context)

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

// Provider: mantiene el estado y expone las acciones a los hijos
export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  // Agregar producto al carrito
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

  // Totales derivados (se recalculan en cada render)
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

// Hook para leer el contexto. Lanza error si se usa fuera del <CartProvider>.
export function Carrito() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("El carrito debe usarse dentro de CartProvider");
  }

  return context;
}

// Alias con nombre más idiomático (misma función)
export function useCart() {
  return Carrito();
}
