describe('Pruebas de Caja Negra - Inicio de sesión (UI)', () => {

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
    cy.visit('/login');
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-51: Debe cargar la página de inicio de sesión', () => {
    cy.url().should('include', '/login');
  });

  it('CP-UI-52: Debe mostrar el título "Inicio de sesión"', () => {
    cy.contains('h2, h1', 'Inicio de sesión').should('be.visible');
  });

  // ============================================
  // CASOS DE VALIDACIÓN (campos vacíos)
  // ============================================
  it('CP-UI-53: NO debe enviar el formulario con los campos vacíos', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.contains('button', 'Iniciar sesión').click();

    cy.contains('.alert-danger', 'Por favor ingresa el correo y la contraseña.').should('be.visible');
    // 👇 No se debe llamar al backend
    cy.get('@login.all').should('have.length', 0);
  });

  it('CP-UI-54: NO debe enviar el formulario si falta la contraseña', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('admin1@mjbe.com');
    cy.contains('button', 'Iniciar sesión').click();

    cy.contains('.alert-danger', 'Por favor ingresa el correo y la contraseña.').should('be.visible');
    cy.get('@login.all').should('have.length', 0);
  });

  // ============================================
  // CASOS DE CREDENCIALES
  // ============================================
  it('CP-UI-55: NO debe iniciar sesión con credenciales incorrectas', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('noexiste@mjbe.com');
    cy.get('#loginPassword').type('claveIncorrecta');
    cy.contains('button', 'Iniciar sesión').click();

    // 👇 El backend no encuentra el correo y la pantalla lo avisa
    cy.wait('@login');
    cy.contains('.alert-danger', 'Usuario no encontrado.').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('CP-UI-56: La contraseña NO debe viajar en texto plano', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('admin1@mjbe.com');
    cy.get('#loginPassword').type('123');
    cy.contains('button', 'Iniciar sesión').click();

    // 👇 La petición solo debe llevar el correo, nunca la contraseña
    cy.wait('@login').its('request.url').should('not.include', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
  });

  it('CP-UI-57: Debe enviar el correo en minúsculas y sin espacios', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('  ADMIN1@MJBE.COM  ');
    cy.get('#loginPassword').type('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
    cy.contains('button', 'Iniciar sesión').click();

    // 👇 El correo viaja en la URL (la @ se codifica como %40)
    cy.wait('@login').its('request.url').should('include', 'email=admin1%40mjbe.com');
  });

  // ============================================
  // CASOS DE REDIRECCIÓN POR ROL
  // ============================================
  // 👇 Correos tomados de la tabla `usuarios`. Cambia las contraseñas (MI_CLAVE_*)
  //    por las que sembraste; la BD solo guarda el hash, no la clave en texto.
  it('CP-UI-58: El administrador debe iniciar sesión y llegar a /InicioAdmin', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('admin1@mjbe.com');
    cy.get('#loginPassword').type('123');
    cy.contains('button', 'Iniciar sesión').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/InicioAdmin');
  });

  it('CP-UI-59: El vendedor debe iniciar sesión y llegar a /InicioVentas', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('vend1@mjbe.com');
    cy.get('#loginPassword').type('456');
    cy.contains('button', 'Iniciar sesión').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/InicioVentas');
  });

  it('CP-UI-60: El bodeguero debe iniciar sesión y llegar a /InicioBodega', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('bod1@mjbe.com');
    cy.get('#loginPassword').type('789');
    cy.contains('button', 'Iniciar sesión').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/InicioBodega');
  });

  it('CP-UI-61: El cliente debe iniciar sesión y llegar a la tienda', () => {
    cy.intercept('GET', '**/api/usuarios*').as('login');

    cy.get('#loginEmail').type('cli1@gmail.com');
    cy.get('#loginPassword').type('135');
    cy.contains('button', 'Iniciar sesión').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/');
  });

  // ============================================
  // CASOS DE NAVEGACIÓN Y CIERRE DE SESIÓN
  // ============================================
  it('CP-UI-62: El enlace "Regístrate aquí" debe abrir el registro', () => {
    cy.contains('a', 'Regístrate aquí').click();
    cy.url().should('include', '/register');
  });

  it('CP-UI-63: "Cerrar sesión" debe borrar la sesión y volver al login', () => {
    // 1. Iniciar sesión como administrador
    cy.get('#loginEmail').type('admin1@mjbe.com');
    cy.get('#loginPassword').type('123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.url().should('include', '/InicioAdmin');

    // 2. Cerrar sesión
    cy.contains('button', 'Cerrar sesión').click();

    // 3. Verificar que volvió al login y que la sesión ya no existe
    cy.url().should('include', '/login');
    cy.window().its('localStorage').invoke('getItem', 'mjbe_auth').should('be.null');
  });

});
