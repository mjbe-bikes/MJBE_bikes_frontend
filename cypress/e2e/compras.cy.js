describe('Pruebas de Caja Negra - Compras a proveedores (UI)', () => {

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
    cy.visit('/compras', sesionAdmin);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-40: Debe cargar la página de compras', () => {
    cy.url().should('include', '/compras');
  });

  it('CP-UI-41: Debe mostrar el título "Compras" y las columnas de la tabla', () => {
    cy.contains('h4', 'Compras').should('be.visible');
    cy.contains('th', 'ID de la compra').should('be.visible');
    cy.contains('th', 'Proveedor').should('be.visible');
    cy.contains('th', 'Fecha').should('be.visible');
    cy.contains('th', 'Total').should('be.visible');
    cy.contains('th', 'Estado').should('be.visible');
    cy.contains('th', 'Detalle').should('be.visible');
  });

  it('CP-UI-42: La lista debe cargar las compras desde el backend', () => {
    cy.intercept('GET', '**/api/compras').as('getCompras');
    cy.visit('/compras', sesionAdmin);
    cy.wait('@getCompras').its('response.statusCode').should('eq', 200);
    cy.contains('No fue posible cargar el historial de compras.').should('not.exist');
  });

  it('CP-UI-43: Una búsqueda sin coincidencias debe mostrar "No se encontraron compras"', () => {
    cy.get('#buscar-compra').type('noexiste' + Date.now());
    cy.contains('td', 'No se encontraron compras').should('be.visible');
  });

  // ============================================
  // CASOS DEL FORMULARIO
  // ============================================
  it('CP-UI-44: El botón "Crear compra" debe abrir el formulario', () => {
    cy.contains('a', 'Crear compra').click();
    cy.url().should('include', '/CrearCompra');
    cy.contains('h3', 'Crear compra').should('be.visible');
    cy.contains('label', 'Proveedor').should('be.visible');
    cy.contains('label', 'Fecha').should('be.visible');
    cy.contains('label', 'Productos').should('be.visible');
  });

  it('CP-UI-45: Debe agregar y quitar filas de productos', () => {
    cy.visit('/CrearCompra', sesionAdmin);

    cy.get('select[name="id_producto"]').should('have.length', 1);
    // 👇 Con una sola fila no se puede quitar
    cy.contains('button', 'Quitar').should('be.disabled');

    cy.contains('button', 'Agregar producto').click();
    cy.get('select[name="id_producto"]').should('have.length', 2);

    cy.contains('button', 'Quitar').click();
    cy.get('select[name="id_producto"]').should('have.length', 1);
  });

  it('CP-UI-46: Debe calcular el total según la cantidad y el costo', () => {
    cy.visit('/CrearCompra', sesionAdmin);

    cy.get('select[name="id_producto"]').first().select(1);
    cy.get('input[name="cantidad"]').first().clear().type('3');
    cy.get('input[name="precio"]').first().clear().type('20000');

    // 👇 3 x 20.000 = 60.000
    cy.contains('h4', 'Total:').invoke('text').then((total) => {
      expect(Number(total.replace(/\D/g, ''))).to.eq(60000);
    });
  });

  // ============================================
  // CASOS DE VALIDACIÓN (valores límite)
  // ============================================
  it('CP-UI-47: NO debe permitir guardar sin elegir un producto', () => {
    cy.visit('/CrearCompra', sesionAdmin);
    cy.contains('button', 'Guardar compra').should('be.disabled');
  });

  it('CP-UI-48: NO debe permitir guardar con cantidad 0', () => {
    cy.visit('/CrearCompra', sesionAdmin);

    cy.get('#id_proveedor').select(1);
    cy.get('select[name="id_producto"]').first().select(1);
    cy.get('input[name="cantidad"]').first().clear().type('0');
    cy.get('input[name="precio"]').first().clear().type('20000');

    cy.contains('button', 'Guardar compra').should('be.disabled');
  });

  // ============================================
  // CASOS DE CREACIÓN Y DETALLE
  // ============================================
  it('CP-UI-49: Debe registrar una compra correctamente', () => {
    cy.intercept('POST', '**/api/compras').as('crearCompra');
    cy.intercept('POST', '**/api/detalles_compra').as('crearDetalle');

    // 1. Llenar el formulario
    cy.visit('/CrearCompra', sesionAdmin);
    cy.get('#id_proveedor').select(1);
    cy.get('#pago').check();
    cy.get('select[name="id_producto"]').first().select(1);
    cy.get('input[name="cantidad"]').first().clear().type('2');
    cy.get('input[name="precio"]').first().clear().type('50000');
    cy.contains('button', 'Guardar compra').click();

    // 2. Esperar a que se guarden la compra y su detalle
    cy.wait('@crearCompra').its('response.statusCode').should('eq', 201);
    cy.wait('@crearDetalle').its('response.statusCode').should('eq', 201);

    // 3. Debe volver a la lista de compras
    cy.url().should('include', '/compras');
  });

  it('CP-UI-50: "Ver detalle" debe mostrar la información de la compra', () => {
    // Hacemos clic en el primer "Ver detalle" de la tabla
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Ver detalle').click();
    });

    cy.url().should('include', '/DetallesCompra/');
    cy.contains('h3', 'Detalle de compra #').should('be.visible');
    cy.contains('strong', 'Proveedor').should('be.visible');
    cy.contains('strong', 'Fecha').should('be.visible');
    cy.contains('strong', 'Total').should('be.visible');
    cy.contains('strong', 'Estado').should('be.visible');
    cy.contains('h5', 'Productos de la compra').should('be.visible');
  });

});
