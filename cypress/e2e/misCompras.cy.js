describe('Pruebas de Caja Negra - Mis compras (UI)', () => {

  // 👇 Sesión del cliente: se guarda en el navegador antes de abrir la página
  //    (cambia el id y el usuario por los de tu base de datos)
  const sesionCliente = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '6');
      win.localStorage.setItem('mjbe_user_login', 'user_cli1');
      win.localStorage.setItem('mjbe_rol_id', '4');       // 4 = Cliente
    },
  };

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
    cy.visit('/mis-compras', sesionCliente);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-145: Debe cargar la página "Mis compras"', () => {
    cy.url().should('include', '/mis-compras');
  });

  it('CP-UI-146: Debe mostrar el título "Mis compras"', () => {
    cy.contains('h1', 'Mis compras').should('be.visible');
  });

  it('CP-UI-147: La lista debe cargar las compras desde el backend', () => {
    cy.intercept('GET', '**/api/ventas*').as('getCompras');
    cy.visit('/mis-compras', sesionCliente);

    cy.wait('@getCompras').its('response.statusCode').should('eq', 200);
    cy.contains('No se pudieron cargar tus compras.').should('not.exist');
  });

  it('CP-UI-148: Debe mostrar las compras o el aviso de que no hay compras', () => {
    // 👇 Si el cliente no tiene compras se muestra un aviso, si tiene se listan
    cy.get('body').then(($body) => {
      if ($body.text().includes('Aún no tienes compras registradas.')) {
        cy.contains('.alert-info', 'Aún no tienes compras registradas.').should('be.visible');
      } else {
        cy.contains('Compra #').should('be.visible');
      }
    });
  });

  // ============================================
  // CASOS DE CONTENIDO
  // ============================================
  it('CP-UI-149: Una compra nueva debe aparecer en "Mis compras"', () => {
    cy.intercept('POST', '**/api/ventas').as('crearVenta');

    // 1. Comprar un producto desde la tienda
    cy.visit('/productos', sesionCliente);
    cy.contains('button', 'Agregar al carrito').first().click();
    cy.contains('button', '🛒').click();
    cy.contains('a', 'Finalizar compra').click();
    cy.get('#nombre').type('Cliente Historial');
    cy.get('#correo').type('cliente@test.com');
    cy.get('#telefono').type('3001234567');
    cy.get('#direccion').type('Calle 10 # 20-30');
    cy.contains('button', 'Confirmar compra').click();

    // 2. Revisar el historial desde el menú
    cy.wait('@crearVenta').then(({ response }) => {
      cy.contains('a', 'Mis compras').click();
      cy.contains('Compra #' + response.body.id).should('be.visible');
    });
  });

  // 👇 Se ejecuta después de CP-UI-149, así el cliente tiene al menos una compra
  it('CP-UI-150: Cada compra debe mostrar su estado "Pagada" o "Pendiente"', () => {
    // Solo las etiquetas de las compras (no el contador del carrito)
    cy.get('main .badge').each(($estado) => {
      expect($estado.text().trim()).to.be.oneOf(['Pagada', 'Pendiente']);
    });
  });

  // ============================================
  // CASO SIN SESIÓN
  // ============================================
  it('CP-UI-151: Sin sesión, "Mis compras" debe llevar al login', () => {
    cy.clearLocalStorage();
    cy.visit('/mis-compras');
    cy.url().should('include', '/login');
  });

});
