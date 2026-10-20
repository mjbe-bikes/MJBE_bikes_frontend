describe('Pruebas de Caja Negra - Ventas del vendedor (UI)', () => {

  // 👇 Sesión del vendedor: se guarda en el navegador antes de abrir la página
  //    (cambia el id y el usuario por los de tu base de datos)
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
    cy.visit('/CrearVenta', sesionVendedor);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-109: Debe cargar la página para crear una venta', () => {
    cy.url().should('include', '/CrearVenta');
  });

  it('CP-UI-110: Debe mostrar el título "Crear venta" y sus campos', () => {
    cy.contains('h3, h2', 'Crear venta').should('be.visible');
    cy.contains('label', 'Cliente').should('be.visible');
    cy.contains('label', 'Fecha').should('be.visible');
    cy.contains('label', 'Productos').should('be.visible');
  });

  it('CP-UI-111: Debe cargar los clientes y productos desde el backend', () => {
    cy.intercept('GET', '**/api/clientes').as('getClientes');
    cy.intercept('GET', '**/api/productos').as('getProductos');
    cy.visit('/CrearVenta', sesionVendedor);

    cy.wait('@getClientes').its('response.statusCode').should('eq', 200);
    cy.wait('@getProductos').its('response.statusCode').should('eq', 200);
    cy.get('#id_cliente option').should('have.length.greaterThan', 1);
    cy.get('select[name="id_producto"] option').should('have.length.greaterThan', 1);
  });

  it('CP-UI-112: La fecha debe venir con el día de hoy', () => {
    const hoy = new Date().toISOString().slice(0, 10);
    cy.get('#fecha').should('have.value', hoy);
  });

  // ============================================
  // CASOS DE PRODUCTOS (agregar / quitar)
  // ============================================
  it('CP-UI-113: Debe agregar y quitar filas de productos', () => {
    cy.get('select[name="id_producto"]').should('have.length', 1);
    // 👇 Con una sola fila no se puede quitar
    cy.contains('button', 'Quitar').should('be.disabled');

    cy.contains('button', 'Agregar producto').click();
    cy.get('select[name="id_producto"]').should('have.length', 2);

    cy.contains('button', 'Quitar').click();
    cy.get('select[name="id_producto"]').should('have.length', 1);
  });

  it('CP-UI-114: Debe calcular el total según la cantidad', () => {
    // 1. Elegir el primer cliente y el primer producto
    cy.get('#id_cliente').select(1);
    cy.get('select[name="id_producto"]').first().select(1);

    // 2. Tomamos el precio del texto de la opción: "Nombre - $1.234"
    cy.get('select[name="id_producto"]').first().find('option:selected').invoke('text').then((texto) => {
      const precio = Number(texto.split('$').pop().replace(/\D/g, ''));

      // 3. Con cantidad 2 el total debe ser el doble del precio
      cy.get('input[name="cantidad"]').first().clear().type('2');
      cy.contains('h4', 'Total:').invoke('text').then((total) => {
        expect(Number(total.replace(/\D/g, ''))).to.eq(precio * 2);
      });
    });
  });

  // ============================================
  // CASOS DE VALIDACIÓN (valores límite)
  // ============================================
  it('CP-UI-115: NO debe permitir guardar sin elegir un producto', () => {
    cy.contains('button', 'Guardar venta').should('be.disabled');
  });

  it('CP-UI-116: NO debe permitir guardar con cantidad 0', () => {
    cy.get('#id_cliente').select(1);
    cy.get('select[name="id_producto"]').first().select(1);
    cy.get('input[name="cantidad"]').first().clear().type('0');

    cy.contains('button', 'Guardar venta').should('be.disabled');
  });

  it('CP-UI-117: La cantidad debe tener un mínimo de 1 y un máximo (stock)', () => {
    cy.get('#id_cliente').select(1);
    cy.get('select[name="id_producto"]').first().select(1);

    cy.get('input[name="cantidad"]').first().should('have.attr', 'min', '1');
    cy.get('input[name="cantidad"]').first().should('have.attr', 'max');
  });

  it('CP-UI-118: NO debe registrar la venta sin seleccionar el cliente', () => {
    cy.intercept('POST', '**/api/ventas').as('crearVenta');

    cy.get('select[name="id_producto"]').first().select(1);
    cy.contains('button', 'Guardar venta').click();

    cy.get('@crearVenta.all').should('have.length', 0);
    cy.url().should('include', '/CrearVenta');
  });

  // ============================================
  // CASOS DE CREACIÓN
  // ============================================
  it('CP-UI-119: Debe registrar una venta correctamente', () => {
    cy.intercept('POST', '**/api/ventas').as('crearVenta');

    cy.get('#id_cliente').select(1);
    cy.get('select[name="id_producto"]').first().select(1);
    cy.get('input[name="cantidad"]').first().clear().type('1');
    cy.contains('button', 'Guardar venta').click();

    cy.wait('@crearVenta').its('response.statusCode').should('eq', 201);
    cy.url().should('not.include', '/CrearVenta');
  });

  it('CP-UI-120: La venta nueva debe aparecer en el listado de ventas', () => {
    cy.intercept('POST', '**/api/ventas').as('crearVenta');

    // 1. Registrar la venta
    cy.get('#id_cliente').select(1);
    cy.get('select[name="id_producto"]').first().select(1);
    cy.get('input[name="cantidad"]').first().clear().type('1');
    cy.contains('button', 'Guardar venta').click();

    // 2. Con el id de la venta creada, buscarla en el listado
    cy.wait('@crearVenta').then(({ response }) => {
      cy.visit('/Ventas', sesionVendedor);
      cy.get('#buscar-venta').type(String(response.body.id));
      cy.contains('td', response.body.id).should('be.visible');
    });
  });

  it('CP-UI-121: La venta en el local debe registrarse como pagada', () => {
    cy.intercept('POST', '**/api/ventas').as('crearVenta');

    cy.get('#id_cliente').select(1);
    cy.get('select[name="id_producto"]').first().select(1);
    cy.contains('button', 'Guardar venta').click();

    // 👇 La venta en tienda se registra como pagada (pago: true)
    cy.wait('@crearVenta').its('request.body.pago').should('eq', true);
  });

  // ============================================
  // CASOS DE CONSULTA DE VENTAS
  // ============================================
  it('CP-UI-122: Debe mostrar el listado de ventas del vendedor', () => {
    cy.intercept('GET', '**/api/ventas*').as('getVentas');
    cy.visit('/Ventas', sesionVendedor);

    cy.wait('@getVentas').its('response.statusCode').should('eq', 200);
    cy.contains('h4', 'Ventas').should('be.visible');
    cy.contains('th', 'ID de la venta').should('be.visible');
    cy.contains('th', 'Cliente').should('be.visible');
    cy.contains('th', 'Fecha').should('be.visible');
    cy.contains('th', 'Total').should('be.visible');
    cy.contains('th', 'Detalle').should('be.visible');
  });

  it('CP-UI-123: Una búsqueda sin coincidencias debe mostrar "No se encontraron ventas"', () => {
    cy.visit('/Ventas', sesionVendedor);
    cy.get('#buscar-venta').type('noexiste' + Date.now());
    cy.contains('td', 'No se encontraron ventas').should('be.visible');
  });

  it('CP-UI-124: "Ver detalle" debe abrir el detalle de la venta', () => {
    cy.visit('/Ventas', sesionVendedor);

    // Hacemos clic en el primer "Ver detalle" de la tabla
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Ver detalle').click();
    });

    cy.url().should('include', '/DetallesVenta/');
    cy.contains('Detalle de venta #').should('be.visible');
    cy.contains('strong', 'Cliente').should('be.visible');
    cy.contains('strong', 'Total').should('be.visible');
  });

  it('CP-UI-125: El botón "Crear venta" debe abrir el formulario', () => {
    cy.visit('/Ventas', sesionVendedor);
    cy.contains('a', 'Crear venta').click();
    cy.url().should('include', '/CrearVenta');
  });

});
