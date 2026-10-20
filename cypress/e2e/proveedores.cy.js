describe('Pruebas de Caja Negra - Proveedores (UI)', () => {

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
    cy.visit('/VerProveedores', sesionAdmin);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-11: Debe cargar la página de proveedores', () => {
    cy.url().should('include', '/VerProveedores');
  });

  it('CP-UI-12: Debe mostrar el título "Proveedores" y las columnas de la tabla', () => {
    cy.contains('h4', 'Proveedores').should('be.visible');
    cy.contains('th', 'ID').should('be.visible');
    cy.contains('th', 'Proveedor').should('be.visible');
    cy.contains('th', 'Tipo Doc').should('be.visible');
    cy.contains('th', 'N° Identidad').should('be.visible');
    cy.contains('th', 'Dirección').should('be.visible');
    cy.contains('th', 'Teléfono').should('be.visible');
    cy.contains('th', 'Estado').should('be.visible');
    cy.contains('th', 'Acciones').should('be.visible');
  });

  it('CP-UI-13: La lista debe cargar los datos desde el backend', () => {
    cy.intercept('GET', '**/api/proveedores').as('getProveedores');
    cy.visit('/VerProveedores', sesionAdmin);
    cy.wait('@getProveedores').its('response.statusCode').should('eq', 200);
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  // ============================================
  // CASO DE FILTRO
  // ============================================
  it('CP-UI-14: Un filtro sin coincidencias debe mostrar "No hay proveedores disponibles"', () => {
    cy.contains('button', 'Filtrar').click();
    cy.get('.dropdown-menu select').select('nombre_proveedor');
    cy.get('input[placeholder="Ingrese el valor"]').type('noexiste' + Date.now());
    cy.contains('button', 'Aplicar filtro').click();

    cy.contains('td', 'No hay proveedores disponibles').should('be.visible');
  });

  // ============================================
  // CASOS DE CREACIÓN
  // ============================================
  it('CP-UI-15: Debe crear un nuevo proveedor correctamente', () => {
    const nombreUnico = 'Proveedor ' + Date.now();

    cy.intercept('POST', '**/api/proveedores').as('crearProveedor');

    // 1. Llenar el formulario
    cy.contains('a', 'Crear Proveedor').click();
    cy.contains('h3', 'Registrar Proveedor').should('be.visible');
    cy.get('input[name="nombre_proveedor"]').type(nombreUnico);
    cy.get('select[name="tipo_documento_id"]').select('4');
    cy.get('input[name="numero_identidad"]').type(String(Date.now()).slice(-10));
    cy.get('input[name="telefono_prv"]').type('3001234567');
    cy.get('input[name="direccion"]').type('Calle 10 # 20-30');
    cy.contains('button', 'Guardar Proveedor').click();

    // 2. Esperar a que el POST se complete
    cy.wait('@crearProveedor').its('response.statusCode').should('eq', 201);

    // 3. El nuevo proveedor debe aparecer en la lista
    cy.visit('/VerProveedores', sesionAdmin);
    cy.contains('td', nombreUnico).should('be.visible');
  });

  it('CP-UI-16: NO debe crear un proveedor con los campos vacíos', () => {
    cy.intercept('POST', '**/api/proveedores').as('crearProveedor');

    cy.visit('/CrearProveedores', sesionAdmin);
    cy.contains('button', 'Guardar Proveedor').click();

    // 👇 No se debe llamar al backend
    cy.get('@crearProveedor.all').should('have.length', 0);
    cy.url().should('include', '/CrearProveedores');
  });

  // ============================================
  // CASO DE EDICIÓN
  // ============================================
  it('CP-UI-17: Debe actualizar el teléfono de un proveedor', () => {
    const telefonoNuevo = '31' + String(Date.now()).slice(-8);

    cy.intercept('PUT', '**/api/proveedores/**').as('actualizarProveedor');

    // 1. Clic en Actualizar en la primera fila
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });
    cy.contains('h3', 'Actualizar Proveedor').should('be.visible');

    // 2. Cambiar el teléfono y guardar
    cy.get('input[name="telefono_prv"]').clear().type(telefonoNuevo);
    cy.contains('button', 'Actualizar Proveedor').click();

    // 3. Esperar a que el PUT se complete y verificar el cambio
    cy.wait('@actualizarProveedor').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/VerProveedores');
    cy.contains('td', telefonoNuevo).should('be.visible');
  });

  // ============================================
  // CASOS DE DESACTIVACIÓN Y ELIMINACIÓN
  // ============================================
  it('CP-UI-18: Debe desactivar un proveedor existente', () => {
    const nombreUnico = 'Desactivar ' + Date.now();

    cy.intercept('POST', '**/api/proveedores').as('crearProveedor');
    cy.intercept('PUT', '**/api/proveedores/**').as('desactivarProveedor');

    // 1. Crear el proveedor
    cy.visit('/CrearProveedores', sesionAdmin);
    cy.get('input[name="nombre_proveedor"]').type(nombreUnico);
    cy.get('select[name="tipo_documento_id"]').select('4');
    cy.get('input[name="numero_identidad"]').type(String(Date.now()).slice(-10));
    cy.get('input[name="telefono_prv"]').type('3001234567');
    cy.get('input[name="direccion"]').type('Calle 10 # 20-30');
    cy.contains('button', 'Guardar Proveedor').click();
    cy.wait('@crearProveedor');

    // 2. Clic en Acción → Desactivar en la fila correspondiente
    cy.visit('/VerProveedores', sesionAdmin);
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Acción').click();
    });
    cy.contains('h5', 'Gestión de proveedor').should('be.visible');
    cy.contains('button', 'Desactivar').click();

    // 3. Esperar a que se complete y verificar el estado
    cy.wait('@desactivarProveedor').its('response.statusCode').should('eq', 200);
    cy.contains('tr', nombreUnico).should('contain', 'inactivo');
  });

  it('CP-UI-19: Debe eliminar un proveedor existente', () => {
    const nombreUnico = 'ParaBorrar ' + Date.now();

    cy.intercept('POST', '**/api/proveedores').as('crearProveedor');
    cy.intercept('DELETE', '**/api/proveedores/**').as('borrarProveedor');

    // 1. Crear el proveedor
    cy.visit('/CrearProveedores', sesionAdmin);
    cy.get('input[name="nombre_proveedor"]').type(nombreUnico);
    cy.get('select[name="tipo_documento_id"]').select('4');
    cy.get('input[name="numero_identidad"]').type(String(Date.now()).slice(-10));
    cy.get('input[name="telefono_prv"]').type('3001234567');
    cy.get('input[name="direccion"]').type('Calle 10 # 20-30');
    cy.contains('button', 'Guardar Proveedor').click();
    cy.wait('@crearProveedor');

    // 2. Clic en Acción → Eliminar en la fila correspondiente
    //    (el cy.on('window:confirm') ya está registrado en beforeEach)
    cy.visit('/VerProveedores', sesionAdmin);
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Acción').click();
    });
    cy.contains('button', 'Eliminar').click();

    // 3. Esperar a que el DELETE se complete
    cy.wait('@borrarProveedor').its('response.statusCode').should('be.oneOf', [200, 204]);

    // 4. Verificar que ya no esté
    cy.contains(nombreUnico).should('not.exist');
  });

});
