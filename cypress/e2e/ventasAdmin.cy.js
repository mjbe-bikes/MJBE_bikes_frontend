describe('Pruebas de Caja Negra - Ventas del administrador (UI)', () => {

  // 👇 Sesión del administrador: se guarda en el navegador antes de abrir la página
  //    (cambia el id y el usuario por los de tu base de datos)
  const sesionAdmin = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '1');
      win.localStorage.setItem('mjbe_user_login', 'admin');
      win.localStorage.setItem('mjbe_rol_id', '1');       // 1 = Administrador
    },
  };

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
    cy.visit('/VentasAdmin', sesionAdmin);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-126: Debe cargar la página de ventas del administrador', () => {
    cy.url().should('include', '/VentasAdmin');
  });

  it('CP-UI-127: Debe mostrar el título "Ventas" y las columnas de la tabla', () => {
    cy.contains('h4', 'Ventas').should('be.visible');
    cy.contains('Todas las ventas registradas y su vendedor').should('be.visible');
    cy.contains('th', 'ID').should('be.visible');
    cy.contains('th', 'Vendedor').should('be.visible');
    cy.contains('th', 'Cliente').should('be.visible');
    cy.contains('th', 'Fecha').should('be.visible');
    cy.contains('th', 'Total').should('be.visible');
    cy.contains('th', 'Estado').should('be.visible');
    cy.contains('th', 'Detalle').should('be.visible');
  });

  it('CP-UI-128: La lista debe cargar todas las ventas desde el backend', () => {
    cy.intercept('GET', '**/api/ventas').as('getVentas');
    cy.visit('/VentasAdmin', sesionAdmin);

    cy.wait('@getVentas').its('response.statusCode').should('eq', 200);
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('CP-UI-129: El estado de cada venta debe ser "Pagada" o "Pendiente"', () => {
    // 👇 Esperar a que la tabla termine de cargar desde el backend
    cy.intercept('GET', '**/api/ventas').as('getVentas');
    cy.visit('/VentasAdmin', sesionAdmin);
    cy.wait('@getVentas');
    // 👇 Esperar a que aparezca una fila de datos real (7 columnas),
    //    no la fila de "Cargando ventas..." que tiene una sola celda.
    cy.get('table tbody tr').first().find('td').should('have.length', 7);

    // 👇 Leemos todas las filas de una sola vez para que React no las
    //    vuelva a dibujar a mitad del recorrido (evita el DOM desprendido).
    //    La columna 6 (índice 5) es "Estado".
    cy.get('table tbody tr').then(($filas) => {
      [...$filas].forEach((fila) => {
        const estado = fila.querySelectorAll('td')[5].innerText.trim();
        expect(estado).to.be.oneOf(['Pagada', 'Pendiente']);
      });
    });
  });

  // ============================================
  // CASOS DE BÚSQUEDA
  // ============================================
  it('CP-UI-130: Debe buscar una venta por su ID', () => {
    // 👇 Esperar a que la tabla termine de cargar desde el backend
    cy.intercept('GET', '**/api/ventas').as('getVentas');
    cy.visit('/VentasAdmin', sesionAdmin);
    cy.wait('@getVentas');
    // 👇 Esperar a que aparezca una fila de datos real (7 columnas),
    //    no la fila de "Cargando ventas..." que tiene una sola celda.
    cy.get('table tbody tr').first().find('td').should('have.length', 7);

    // 👇 Tomamos el ID de la primera fila y lo buscamos
    cy.get('table tbody tr').first().find('td').first().invoke('text').then((id) => {
      const idVenta = id.trim();
      cy.get('#buscar-venta').type(idVenta);
      cy.get('table tbody tr').first().find('td').first().should('have.text', idVenta);
    });
  });

  it('CP-UI-131: Una búsqueda sin coincidencias debe mostrar "No se encontraron ventas"', () => {
    cy.get('#buscar-venta').type('noexiste' + Date.now());
    cy.contains('td', 'No se encontraron ventas').should('be.visible');
  });

  // ============================================
  // CASO DE DETALLE
  // ============================================
  it('CP-UI-132: "Ver detalle" debe abrir el detalle de la venta', () => {
    // Hacemos clic en el primer "Ver detalle" de la tabla
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Ver detalle').click();
    });

    cy.url().should('include', '/DetallesVenta/');
    cy.contains('Detalle de venta #').should('be.visible');
    cy.contains('strong', 'Cliente').should('be.visible');
  });

});
