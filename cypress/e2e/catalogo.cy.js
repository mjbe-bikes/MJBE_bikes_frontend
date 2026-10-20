describe('Pruebas de Caja Negra - Catálogo y carrito (UI)', () => {

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
    cy.visit('/');
  });

  // ============================================
  // CASOS BÁSICOS (página de inicio)
  // ============================================
  it('CP-UI-30: Debe cargar la página de inicio de la tienda', () => {
    cy.location('pathname').should('eq', '/');
    cy.contains('h1', 'Bienvenido a MJBE Bikes').should('be.visible');
    cy.contains('h2', 'Nuestros productos').should('be.visible');
  });

  it('CP-UI-31: La tienda debe cargar los productos desde el backend', () => {
    cy.intercept('GET', '**/api/productos').as('getProductos');
    cy.visit('/');
    cy.wait('@getProductos').its('response.statusCode').should('eq', 200);
    cy.contains('button', 'Agregar al carrito').should('be.visible');
  });

  // ============================================
  // CASOS DE BÚSQUEDA Y ORDEN (catálogo)
  // ============================================
  it('CP-UI-32: Una búsqueda sin coincidencias debe avisar que no hay productos', () => {
    cy.visit('/productos');
    cy.get('#buscar-productos').type('noexiste' + Date.now());
    cy.contains('No encontramos productos con esos filtros.').should('be.visible');
  });

  it('CP-UI-33: Debe ordenar los productos por precio de menor a mayor', () => {
    cy.visit('/productos');
    cy.get('#ordenar-precio').select('menor');

    // 👇 Cada precio debe ser mayor o igual al anterior
    let anterior = 0;
    cy.get('main h5').filter(':contains("$")').each(($precio) => {
      const precio = Number($precio.text().replace(/\D/g, ''));
      expect(precio).to.be.at.least(anterior);
      anterior = precio;
    });
  });

  it('CP-UI-34: "Limpiar filtros" debe borrar la búsqueda', () => {
    cy.visit('/productos');
    cy.get('#buscar-productos').type('noexiste' + Date.now());
    cy.contains('No encontramos productos con esos filtros.').should('be.visible');

    cy.contains('button', 'Limpiar filtros').click();

    cy.get('#buscar-productos').should('have.value', '');
    cy.contains('No encontramos productos con esos filtros.').should('not.exist');
  });

  // ============================================
  // CASO DE DETALLE DEL PRODUCTO
  // ============================================
  it('CP-UI-35: Al hacer clic en un producto debe abrir su detalle', () => {
    cy.visit('/productos');
    cy.get('main a[href^="/producto/"]').first().click();

    cy.url().should('include', '/producto/');
    cy.contains('h5', 'Descripción').should('be.visible');
    cy.contains('h5', 'Características').should('be.visible');
    cy.contains('li', 'Stock:').should('be.visible');
  });

  // ============================================
  // CASOS DEL CARRITO
  // ============================================
  it('CP-UI-36: Agregar un producto debe aumentar el contador del carrito', () => {
    cy.contains('button', '🛒').find('span').should('have.text', '0');
    cy.contains('button', 'Agregar al carrito').first().click();
    cy.contains('button', '🛒').find('span').should('have.text', '1');
  });

  it('CP-UI-37: Los botones "+" y "-" deben cambiar la cantidad', () => {
    cy.contains('button', 'Agregar al carrito').first().click();
    cy.contains('button', '🛒').click();
    cy.contains('h6', 'Tu carrito').should('be.visible');

    // 1. Sumar una unidad
    cy.contains('button', '+').click();
    cy.contains('button', '🛒').find('span').should('have.text', '2');

    // 2. Restar una unidad
    cy.contains('button', '-').click();
    cy.contains('button', '🛒').find('span').should('have.text', '1');
  });

  it('CP-UI-38: Quitar el único producto debe dejar el carrito vacío', () => {
    cy.contains('button', 'Agregar al carrito').first().click();
    cy.contains('button', '🛒').click();

    cy.get('button[aria-label^="Quitar"]').click();

    cy.contains('No tienes productos agregados.').should('be.visible');
    cy.contains('button', '🛒').find('span').should('have.text', '0');
  });

  it('CP-UI-39: El total del carrito debe ser precio por cantidad', () => {
    // 1. Agregar el mismo producto dos veces
    cy.contains('button', 'Agregar al carrito').first().click();
    cy.contains('button', 'Agregar al carrito').first().click();
    cy.contains('button', '🛒').click();

    // 2. El total debe ser el doble del precio del producto
    cy.contains('h6', 'Tu carrito').parent().find('small').first().invoke('text').then((textoPrecio) => {
      const precio = Number(textoPrecio.replace(/\D/g, ''));

      cy.contains('span', 'Total').next().invoke('text').then((textoTotal) => {
        expect(Number(textoTotal.replace(/\D/g, ''))).to.eq(precio * 2);
      });
    });
  });

});
