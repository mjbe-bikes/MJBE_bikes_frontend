describe('Pruebas de Caja Negra - Clientes (UI)', () => {

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
    cy.visit('/VerClientes', sesionVendedor);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-01: Debe cargar la página de clientes', () => {
    cy.url().should('include', '/VerClientes');
  });

  it('CP-UI-02: Debe mostrar el título "Clientes" y las columnas de la tabla', () => {
    cy.contains('h4', 'Clientes').should('be.visible');
    cy.contains('th', 'ID').should('be.visible');
    cy.contains('th', 'Documento').should('be.visible');
    cy.contains('th', 'Nombre completo').should('be.visible');
    cy.contains('th', 'Dirección').should('be.visible');
    cy.contains('th', 'Teléfono').should('be.visible');
    cy.contains('th', 'Acciones').should('be.visible');
  });

  it('CP-UI-03: La lista debe cargar los datos desde el backend', () => {
    cy.intercept('GET', '**/api/clientes').as('getClientes');
    cy.visit('/VerClientes', sesionVendedor);
    cy.wait('@getClientes').its('response.statusCode').should('eq', 200);
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  // ============================================
  // CASOS DE CREACIÓN
  // ============================================
  it('CP-UI-04: El botón "Crear cliente" debe abrir el formulario', () => {
    cy.contains('a', 'Crear cliente').click();
    cy.url().should('include', '/CrearClientes');
    cy.contains('h3', 'Registrar cliente').should('be.visible');
  });

  it('CP-UI-05: Debe crear un nuevo cliente correctamente', () => {
    const documentoUnico = String(Date.now()).slice(-10);
    const nombreUnico = 'Cypress' + Date.now();

    cy.intercept('POST', '**/api/clientes').as('crearCliente');

    // 1. Llenar el formulario
    cy.visit('/CrearClientes', sesionVendedor);
    cy.get('#usuario_id').select(1);
    cy.get('#tipo_documento_id').select('1');
    cy.get('#numero_documento').type(documentoUnico);
    cy.get('#nombres').type(nombreUnico);
    cy.get('#apellidos').type('Prueba');
    cy.get('#direccion').type('Calle 10 # 20-30');
    cy.get('#telefono_clnt').type('3001234567');
    cy.contains('button', 'Guardar cliente').click();

    // 2. Esperar a que el POST se complete
    cy.wait('@crearCliente').its('response.statusCode').should('eq', 201);

    // 3. Debe volver a la lista y mostrar el nuevo cliente
    cy.url().should('include', '/VerClientes');
    cy.contains('td', nombreUnico).should('be.visible');
  });

  it('CP-UI-06: NO debe crear un cliente con los campos vacíos', () => {
    cy.intercept('POST', '**/api/clientes').as('crearCliente');

    cy.visit('/CrearClientes', sesionVendedor);
    cy.contains('button', 'Guardar cliente').click();

    // 👇 No se debe llamar al backend
    cy.get('@crearCliente.all').should('have.length', 0);
    cy.url().should('include', '/CrearClientes');
  });

  it('CP-UI-07: Debe ofrecer los tipos de documento', () => {
    cy.visit('/CrearClientes', sesionVendedor);

    cy.get('#tipo_documento_id option').should('have.length', 4);
    cy.get('#tipo_documento_id').should('contain', 'Cédula de ciudadanía');
    cy.get('#tipo_documento_id').should('contain', 'Cédula de extranjería');
    cy.get('#tipo_documento_id').should('contain', 'Pasaporte');
    cy.get('#tipo_documento_id').should('contain', 'NIT');
  });

  // ============================================
  // CASOS DE EDICIÓN
  // ============================================
  it('CP-UI-08: Debe abrir la edición de un cliente con sus datos cargados', () => {
    // Hacemos clic en el primer enlace "Actualizar" de la tabla
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });

    cy.url().should('include', '/ActualizarClientes/');
    cy.contains('h3', 'Actualizar cliente').should('be.visible');
    cy.get('#numero_documento').invoke('val').should('not.be.empty');
    cy.get('#nombres').invoke('val').should('not.be.empty');
  });

  it('CP-UI-09: Debe actualizar la dirección de un cliente', () => {
    const direccionNueva = 'Carrera ' + Date.now();

    cy.intercept('PUT', '**/api/clientes/**').as('actualizarCliente');

    // 1. Clic en Actualizar en la primera fila
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });

    // 2. Cambiar la dirección y guardar
    cy.get('#direccion').clear().type(direccionNueva);
    cy.contains('button', 'Actualizar cliente').click();

    // 3. Esperar a que el PUT se complete y verificar el cambio
    cy.wait('@actualizarCliente').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/VerClientes');
    cy.contains('td', direccionNueva).should('be.visible');
  });

  // ============================================
  // CASO DE ELIMINACIÓN
  // ============================================
  it('CP-UI-10: Debe eliminar un cliente existente', () => {
    const documentoUnico = String(Date.now()).slice(-10);
    const nombreUnico = 'ParaBorrar' + Date.now();

    // Interceptamos las peticiones que vamos a usar
    cy.intercept('POST', '**/api/clientes').as('crearCliente');
    cy.intercept('DELETE', '**/api/clientes/**').as('borrarCliente');

    // 1. Crear el cliente
    cy.visit('/CrearClientes', sesionVendedor);
    cy.get('#usuario_id').select(1);
    cy.get('#numero_documento').type(documentoUnico);
    cy.get('#nombres').type(nombreUnico);
    cy.get('#apellidos').type('Prueba');
    cy.get('#direccion').type('Calle 10 # 20-30');
    cy.get('#telefono_clnt').type('3001234567');
    cy.contains('button', 'Guardar cliente').click();
    cy.wait('@crearCliente');
    cy.contains('td', nombreUnico).should('be.visible');

    // 2. Clic en Eliminar en la fila correspondiente
    //    (el cy.on('window:confirm') ya está registrado en beforeEach)
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Eliminar').click();
    });

    // 3. Esperar a que el DELETE se complete
    cy.wait('@borrarCliente').its('response.statusCode').should('be.oneOf', [200, 204]);

    // 4. Verificar que ya no esté
    cy.contains(nombreUnico).should('not.exist');
  });

});
