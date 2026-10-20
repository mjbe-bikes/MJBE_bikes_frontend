describe('Pruebas de Caja Negra - Administración de usuarios (UI)', () => {

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
    cy.visit('/VerUsuarios', sesionAdmin);
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-92: Debe cargar la página de usuarios', () => {
    cy.url().should('include', '/VerUsuarios');
  });

  it('CP-UI-93: Debe mostrar el título "Usuarios" y las columnas de la tabla', () => {
    cy.contains('h4, h3, h2', 'Usuarios').should('be.visible');
    cy.contains('th', 'ID').should('be.visible');
    cy.contains('th', 'Usuario').should('be.visible');
    cy.contains('th', 'Email').should('be.visible');
    cy.contains('th', 'Rol').should('be.visible');
    cy.contains('th', 'Estado').should('be.visible');
    cy.contains('th', 'Acciones').should('be.visible');
  });

  it('CP-UI-94: La lista debe cargar los datos desde el backend', () => {
    cy.intercept('GET', '**/api/usuarios').as('getUsuarios');
    cy.visit('/VerUsuarios', sesionAdmin);
    cy.wait('@getUsuarios').its('response.statusCode').should('eq', 200);
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  // ============================================
  // CASOS DE FILTRO
  // ============================================
  it('CP-UI-95: Debe filtrar los usuarios por nombre de usuario', () => {
    // 👇 Tomamos el usuario de la primera fila y filtramos por él
    cy.get('table tbody tr').first().find('td').eq(1).invoke('text').then((login) => {
      cy.contains('button', 'Filtrar').click();
      cy.get('.dropdown-menu select').select('login');
      cy.get('input[placeholder="Ingrese el valor"]').type(login.trim());
      cy.contains('button', 'Aplicar filtro').click();

      // Todas las filas que quedan deben tener ese usuario
      cy.get('table tbody tr').each(($fila) => {
        cy.wrap($fila).find('td').eq(1).should('contain', login.trim());
      });
    });
  });

  it('CP-UI-96: Un filtro sin coincidencias debe mostrar "No hay usuarios disponibles"', () => {
    cy.contains('button', 'Filtrar').click();
    cy.get('.dropdown-menu select').select('email');
    cy.get('input[placeholder="Ingrese el valor"]').type('noexiste' + Date.now());
    cy.contains('button', 'Aplicar filtro').click();

    cy.contains('td', 'No hay usuarios disponibles').should('be.visible');
  });

  // ============================================
  // CASOS DE CREACIÓN
  // ============================================
  it('CP-UI-97: El botón "Crear Empleado" debe abrir el formulario', () => {
    cy.contains('a', 'Crear Empleado').click();
    cy.url().should('include', '/CrearEmpleado');
    cy.contains('h3', 'Registrar Empleado').should('be.visible');
  });

  it('CP-UI-98: Debe crear un nuevo empleado correctamente', () => {
    const nombreUnico = 'empleado' + Date.now();

    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');

    // 1. Llenar el formulario
    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.get('select[name="rol_id"]').select('2');
    cy.contains('button', 'Guardar Empleado').click();

    // 2. Esperar a que el POST se complete
    cy.wait('@crearUsuario').its('response.statusCode').should('eq', 201);

    // 3. El nuevo empleado debe aparecer en la lista
    cy.visit('/VerUsuarios', sesionAdmin);
    cy.contains('td', nombreUnico).should('be.visible');
  });

  it('CP-UI-99: NO debe crear un empleado con los campos vacíos', () => {
    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');

    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.contains('button', 'Guardar Empleado').click();

    cy.get('@crearUsuario.all').should('have.length', 0);
    cy.url().should('include', '/CrearEmpleado');
  });

  it('CP-UI-100: NO debe crear un empleado sin seleccionar el rol', () => {
    const nombreUnico = 'sinrol' + Date.now();

    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');

    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.contains('button', 'Guardar Empleado').click();

    cy.get('@crearUsuario.all').should('have.length', 0);
  });

  it('CP-UI-101: NO debe crear un empleado con un usuario repetido', () => {
    const nombreUnico = 'repetido' + Date.now();

    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');

    // 1. Crear el empleado por primera vez
    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.get('select[name="rol_id"]').select('2');
    cy.contains('button', 'Guardar Empleado').click();
    cy.wait('@crearUsuario').its('response.statusCode').should('eq', 201);

    // 2. Intentar crearlo otra vez con los mismos datos
    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.get('select[name="rol_id"]').select('2');
    cy.contains('button', 'Guardar Empleado').click();

    // 3. El backend lo debe rechazar
    cy.wait('@crearUsuario').its('response.statusCode').should('eq', 400);
  });

  // ============================================
  // CASOS DE EDICIÓN
  // ============================================
  it('CP-UI-102: Debe abrir la edición de un usuario con sus datos cargados', () => {
    // Hacemos clic en el primer enlace "Actualizar" de la tabla
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });

    cy.url().should('include', '/ActualizarEmpleados/');
    cy.contains('h3', 'Actualizar Empleado').should('be.visible');
    cy.get('input[name="login"]').invoke('val').should('not.be.empty');
    cy.get('input[name="email"]').invoke('val').should('not.be.empty');
  });

  it('CP-UI-103: Debe actualizar el correo de un empleado', () => {
    const nombreUnico = 'editar' + Date.now();

    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');
    cy.intercept('PUT', '**/api/usuarios/**').as('actualizarUsuario');

    // 1. Crear el empleado
    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.get('select[name="rol_id"]').select('2');
    cy.contains('button', 'Guardar Empleado').click();
    cy.wait('@crearUsuario');

    // 2. Clic en Actualizar en la fila correspondiente
    cy.visit('/VerUsuarios', sesionAdmin);
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('a', 'Actualizar').click();
    });

    // 3. Cambiar el correo y guardar
    cy.get('input[name="email"]').clear().type(nombreUnico + '.nuevo@test.com');
    cy.contains('button', 'Actualizar Empleado').click();

    // 4. Esperar a que el PUT se complete y verificar el cambio
    cy.wait('@actualizarUsuario').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/VerUsuarios');
    cy.contains('tr', nombreUnico).should('contain', nombreUnico + '.nuevo@test.com');
  });

  it('CP-UI-104: Si la contraseña se deja vacía, NO debe enviarse', () => {
    cy.intercept('PUT', '**/api/usuarios/**').as('actualizarUsuario');

    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });
    cy.get('input[name="password_harsh"]').should('have.value', '');
    cy.contains('button', 'Actualizar Empleado').click();

    cy.wait('@actualizarUsuario').its('request.body').should('not.have.property', 'password_harsh');
  });

  it('CP-UI-105: "Cancelar" en la edición debe volver a la lista sin guardar', () => {
    cy.intercept('PUT', '**/api/usuarios/**').as('actualizarUsuario');

    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });
    cy.contains('button', 'Cancelar').click();

    cy.url().should('include', '/VerUsuarios');
    cy.get('@actualizarUsuario.all').should('have.length', 0);
  });

  // ============================================
  // CASOS DE DESACTIVACIÓN Y ELIMINACIÓN
  // ============================================
  it('CP-UI-106: El botón "Acción" debe abrir la gestión del usuario', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('button', 'Acción').click();
    });

    cy.contains('.modal-title', 'Gestión de usuario').should('be.visible');
    cy.contains('.modal button', 'Desactivar').should('be.visible');
    cy.contains('.modal button', 'Eliminar').should('be.visible');

    // 👇 "Cancelar" cierra la ventana
    cy.contains('.modal button', 'Cancelar').click();
    cy.get('.modal').should('not.exist');
  });

  it('CP-UI-107: Debe desactivar un usuario existente', () => {
    const nombreUnico = 'desactivar' + Date.now();

    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');
    cy.intercept('PUT', '**/api/usuarios/**').as('desactivarUsuario');

    // 1. Crear el empleado
    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.get('select[name="rol_id"]').select('2');
    cy.contains('button', 'Guardar Empleado').click();
    cy.wait('@crearUsuario');

    // 2. Clic en Acción → Desactivar en la fila correspondiente
    cy.visit('/VerUsuarios', sesionAdmin);
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Acción').click();
    });
    cy.contains('.modal button', 'Desactivar').click();

    // 3. Esperar a que se complete y verificar el estado
    cy.wait('@desactivarUsuario').its('response.statusCode').should('eq', 200);
    cy.contains('tr', nombreUnico).should('contain', 'inactivo');
  });

  it('CP-UI-108: Debe eliminar un usuario existente', () => {
    const nombreUnico = 'eliminar' + Date.now();

    cy.intercept('POST', '**/api/usuarios').as('crearUsuario');
    cy.intercept('DELETE', '**/api/usuarios/**').as('borrarUsuario');

    // 1. Crear el empleado
    cy.visit('/CrearEmpleado', sesionAdmin);
    cy.get('input[name="login"]').type(nombreUnico);
    cy.get('input[name="email"]').type(nombreUnico + '@test.com');
    cy.get('input[name="password_harsh"]').type('Clave123');
    cy.get('select[name="rol_id"]').select('2');
    cy.contains('button', 'Guardar Empleado').click();
    cy.wait('@crearUsuario');

    // 2. Clic en Acción → Eliminar en la fila correspondiente
    //    (el cy.on('window:confirm') ya está registrado en beforeEach)
    cy.visit('/VerUsuarios', sesionAdmin);
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Acción').click();
    });
    cy.contains('.modal button', 'Eliminar').click();

    // 3. Esperar a que el DELETE se complete
    cy.wait('@borrarUsuario').its('response.statusCode').should('be.oneOf', [200, 204]);

    // 4. Verificar que ya no esté
    cy.contains(nombreUnico).should('not.exist');
  });

});
