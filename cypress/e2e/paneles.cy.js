describe('Pruebas de Caja Negra - Paneles de inicio (UI)', () => {

  // 👇 Sesiones de cada rol: se guardan en el navegador antes de abrir la página
  //    (cambia el id y el usuario por los de tu base de datos)
  const sesionAdmin = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '1');
      win.localStorage.setItem('mjbe_user_login', 'admin');
      win.localStorage.setItem('mjbe_rol_id', '1');       // 1 = Administrador
    },
  };

  const sesionBodeguero = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '3');
      win.localStorage.setItem('mjbe_user_login', 'bodeguero');
      win.localStorage.setItem('mjbe_rol_id', '3');       // 3 = Bodeguero
    },
  };

  const sesionVendedor = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '2');
      win.localStorage.setItem('mjbe_user_login', 'vendedor');
      win.localStorage.setItem('mjbe_rol_id', '2');       // 2 = Vendedor
    },
  };

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
  });

  // ============================================
  // PANEL DEL ADMINISTRADOR
  // ============================================
  it('CP-UI-152: El panel del administrador debe cargar el resumen desde el backend', () => {
    cy.intercept('GET', '**/api/reportes/dashboard').as('getDashboard');
    cy.visit('/InicioAdmin', sesionAdmin);

    cy.wait('@getDashboard').its('response.statusCode').should('eq', 200);
    cy.contains('h3', 'Resumen General').should('be.visible');
  });

  it('CP-UI-153: El panel del administrador debe mostrar sus indicadores', () => {
    cy.visit('/InicioAdmin', sesionAdmin);

    cy.contains('h6', 'Total Productos').should('be.visible');
    cy.contains('h6', 'Total Clientes').should('be.visible');
    cy.contains('h6', 'Total Ventas').should('be.visible');
    cy.contains('h6', 'Ventas Hoy').should('be.visible');
    cy.contains('h6', 'Ventas del Mes').should('be.visible');
    cy.contains('h6', 'Stock Bajo').should('be.visible');
    cy.contains('h4', 'Reportes').should('be.visible');
  });

  it('CP-UI-154: "Total Productos" debe mostrar el valor que envía el backend', () => {
    cy.intercept('GET', '**/api/reportes/dashboard').as('getDashboard');
    cy.visit('/InicioAdmin', sesionAdmin);

    // 👇 El número debajo del título debe ser el mismo de la respuesta
    cy.wait('@getDashboard').then(({ response }) => {
      cy.contains('h6', 'Total Productos').siblings('h2')
        .should('have.text', String(response.body.resumen.totalProductos));
    });
  });

  it('CP-UI-155: "Stock Bajo" debe mostrar el valor que envía el backend', () => {
    cy.intercept('GET', '**/api/reportes/dashboard').as('getDashboard');
    cy.visit('/InicioAdmin', sesionAdmin);

    cy.wait('@getDashboard').then(({ response }) => {
      cy.contains('h6', 'Stock Bajo').siblings('h2')
        .should('have.text', String(response.body.resumen.stockBajo));
    });
  });

  it('CP-UI-156: El menú del administrador debe llevar a sus módulos', () => {
    cy.visit('/InicioAdmin', sesionAdmin);

    cy.get('nav').contains('a', 'Usuarios').click();
    cy.url().should('include', '/VerUsuarios');
  });

  // ============================================
  // PANEL DEL BODEGUERO (alertas de stock)
  // ============================================
  it('CP-UI-157: El panel de bodega debe mostrar sus indicadores', () => {
    cy.visit('/InicioBodega', sesionBodeguero);

    cy.contains('h3', 'Resumen de Bodega').should('be.visible');
    cy.contains('h6', 'Total Productos').should('be.visible');
    cy.contains('h6', 'Productos Activos').should('be.visible');
    cy.contains('h6', 'Stock Bajo').should('be.visible');
    cy.contains('h6', 'Sin Stock').should('be.visible');
  });

  it('CP-UI-158: "Sin Stock" debe contar los productos agotados', () => {
    cy.intercept('GET', '**/api/productos').as('getProductos');
    cy.visit('/InicioBodega', sesionBodeguero);

    // 👇 Contamos en la respuesta los productos con 0 unidades
    cy.wait('@getProductos').then(({ response }) => {
      const sinStock = response.body.filter((p) => Number(p.cant_producto) === 0).length;

      cy.contains('h6', 'Sin Stock').siblings('h2').should('have.text', String(sinStock));
    });
  });

  it('CP-UI-159: "Stock Bajo" en bodega debe contar los productos entre 1 y 5 unidades', () => {
    cy.intercept('GET', '**/api/productos').as('getProductos');
    cy.visit('/InicioBodega', sesionBodeguero);

    cy.wait('@getProductos').then(({ response }) => {
      const stockBajo = response.body.filter((p) => Number(p.cant_producto) > 0 && Number(p.cant_producto) <= 5).length;

      cy.contains('h6', 'Stock Bajo').siblings('h2').should('have.text', String(stockBajo));
    });
  });

  // ============================================
  // PANEL DEL VENDEDOR
  // ============================================
  it('CP-UI-160: El panel del vendedor debe mostrar el resumen de sus ventas', () => {
    cy.intercept('GET', '**/api/ventas*').as('getVentas');
    cy.visit('/InicioVentas', sesionVendedor);

    cy.wait('@getVentas').its('response.statusCode').should('eq', 200);
    cy.contains('h2', 'Inicio de ventas').should('be.visible');
    cy.contains('h6', 'Ventas realizadas').should('be.visible');
    cy.contains('h6', 'Ventas completadas').should('be.visible');
    cy.contains('h6', 'Ingresos generados').should('be.visible');
    cy.contains('h6', 'Ventas de hoy').should('be.visible');
  });

  it('CP-UI-161: "Ventas recientes" debe mostrar como máximo 5 ventas', () => {
    cy.visit('/InicioVentas', sesionVendedor);

    cy.contains('h4', 'Ventas recientes').should('be.visible');
    cy.get('table tbody tr').should('have.length.at.most', 5);
  });

  it('CP-UI-162: "Ver historial" debe abrir el historial de ventas', () => {
    cy.visit('/InicioVentas', sesionVendedor);

    cy.contains('a', 'Ver historial').click();
    cy.url().should('include', '/DetallesVenta');
  });

});
