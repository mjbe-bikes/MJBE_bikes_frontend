describe('Pruebas de Caja Negra - Registro de cliente (UI)', () => {

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
    cy.visit('/register');
  });

  // ============================================
  // CASOS BÁSICOS
  // ============================================
  it('CP-UI-64: Debe cargar la página de registro', () => {
    cy.url().should('include', '/register');
  });

  it('CP-UI-65: Debe mostrar el título "Registro de cliente" y el rol asignado', () => {
    cy.contains('h2, h1', 'Registro de cliente').should('be.visible');
    cy.contains('Rol asignado: Cliente').should('be.visible');
  });

  // ============================================
  // CASOS DE VALIDACIÓN
  // ============================================
  it('CP-UI-66: NO debe registrar con los campos vacíos', () => {
    cy.intercept('POST', '**/api/register').as('registrar');

    cy.contains('button', 'Registrarme').click();

    cy.contains('.alert-danger', 'Todos los campos son obligatorios.').should('be.visible');
    // 👇 No se debe llamar al backend
    cy.get('@registrar.all').should('have.length', 0);
  });

  it('CP-UI-67: NO debe registrar si falta confirmar la contraseña', () => {
    const unico = Date.now();

    cy.intercept('POST', '**/api/register').as('registrar');

    cy.get('#registerLogin').type('cliente' + unico);
    cy.get('#registerEmail').type('cliente' + unico + '@test.com');
    cy.get('#registerPassword').type('Clave123');
    cy.contains('button', 'Registrarme').click();

    cy.contains('.alert-danger', 'Todos los campos son obligatorios.').should('be.visible');
    cy.get('@registrar.all').should('have.length', 0);
  });

  it('CP-UI-68: NO debe registrar si las contraseñas no coinciden', () => {
    const unico = Date.now();

    cy.intercept('POST', '**/api/register').as('registrar');

    cy.get('#registerLogin').type('cliente' + unico);
    cy.get('#registerEmail').type('cliente' + unico + '@test.com');
    cy.get('#registerPassword').type('Clave123');
    cy.get('#registerConfirmPassword').type('Clave124');
    cy.contains('button', 'Registrarme').click();

    cy.contains('.alert-danger', 'Las contraseñas no coinciden.').should('be.visible');
    cy.get('@registrar.all').should('have.length', 0);
  });

  // ============================================
  // CASOS DE CREACIÓN
  // ============================================
  it('CP-UI-69: Debe registrar un cliente nuevo y llevarlo al login', () => {
    const unico = Date.now();

    cy.intercept('POST', '**/api/usuarios').as('registrar');

    cy.get('#registerLogin').type('cliente' + unico);
    cy.get('#registerEmail').type('cliente' + unico + '@test.com');
    cy.get('#registerPassword').type('Clave123');
    cy.get('#registerConfirmPassword').type('Clave123');
    cy.contains('button', 'Registrarme').click();

    cy.wait('@registrar').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.contains('.alert-success', 'Registro exitoso').should('be.visible');
    // 👇 Después de 1,5 s la pantalla redirige al login
    cy.url({ timeout: 5000 }).should('include', '/login');
  });

  it('CP-UI-70: La contraseña NO debe viajar en texto plano', () => {
    const unico = Date.now();

    cy.intercept('POST', '**/api/usuarios').as('registrar');

    cy.get('#registerLogin').type('cliente' + unico);
    cy.get('#registerEmail').type('cliente' + unico + '@test.com');
    cy.get('#registerPassword').type('Clave123');
    cy.get('#registerConfirmPassword').type('Clave123');
    cy.contains('button', 'Registrarme').click();

    // 👇 Se envía el hash SHA-256 (64 caracteres hexadecimales), no la clave
    cy.wait('@registrar').its('request.body').then((body) => {
      expect(body.password_harsh).to.not.eq('Clave123');
      expect(body.password_harsh).to.match(/^[0-9a-f]{64}$/);
    });
  });

  it('CP-UI-71: NO debe registrar un usuario o correo repetido', () => {
    const unico = Date.now();

    cy.intercept('POST', '**/api/usuarios').as('registrar');

    // 1. Primer registro (debe funcionar)
    cy.get('#registerLogin').type('repetido' + unico);
    cy.get('#registerEmail').type('repetido' + unico + '@test.com');
    cy.get('#registerPassword').type('Clave123');
    cy.get('#registerConfirmPassword').type('Clave123');
    cy.contains('button', 'Registrarme').click();
    cy.wait('@registrar');

    // 2. Segundo registro con los mismos datos
    cy.visit('/register');
    cy.get('#registerLogin').type('repetido' + unico);
    cy.get('#registerEmail').type('repetido' + unico + '@test.com');
    cy.get('#registerPassword').type('Clave123');
    cy.get('#registerConfirmPassword').type('Clave123');
    cy.contains('button', 'Registrarme').click();

    // 3. El backend lo debe rechazar y seguir en el registro
    cy.wait('@registrar').its('response.statusCode').should('be.oneOf', [400, 409, 422]);
    cy.get('.alert-danger').should('be.visible');
    cy.url().should('include', '/register');
  });

  // ============================================
  // CASO DE NAVEGACIÓN
  // ============================================
  it('CP-UI-72: El enlace "Inicia sesión" debe abrir el login', () => {
    cy.contains('a', 'Inicia sesión').click();
    cy.url().should('include', '/login');
  });

});
