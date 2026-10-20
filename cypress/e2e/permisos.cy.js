describe('Pruebas de Caja Negra - Permisos por rol (UI)', () => {

  // 👇 Sesiones de cada rol: se guardan en el navegador antes de abrir la página
  //    (cambia el id y el usuario por los de tu base de datos)
  const sesionAdmin = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '1');
      win.localStorage.setItem('mjbe_user_login', 'admin');
      win.localStorage.setItem('mjbe_rol_id', '1');       // 1 = Administrador
    },
  };

  const sesionVendedor = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '2');
      win.localStorage.setItem('mjbe_user_login', 'vendedor');
      win.localStorage.setItem('mjbe_rol_id', '2');       // 2 = Vendedor
    },
  };

  const sesionBodeguero = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '3');
      win.localStorage.setItem('mjbe_user_login', 'bodeguero');
      win.localStorage.setItem('mjbe_rol_id', '3');       // 3 = Bodeguero
    },
  };

  const sesionCliente = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '4');
      win.localStorage.setItem('mjbe_user_login', 'cliente');
      win.localStorage.setItem('mjbe_rol_id', '4');       // 4 = Cliente
    },
  };

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
  });

  // ============================================
  // CASOS SIN SESIÓN
  // ============================================
  it('CP-UI-73: Un visitante sin sesión NO debe poder entrar a /InicioAdmin', () => {
    cy.visit('/InicioAdmin');
    cy.location('pathname').should('not.eq', '/InicioAdmin');
  });

  it('CP-UI-74: Un visitante sin sesión NO debe poder entrar a /VerUsuarios', () => {
    cy.visit('/VerUsuarios');
    cy.location('pathname').should('not.eq', '/VerUsuarios');
  });

  it('CP-UI-75: Un visitante sin sesión NO debe poder entrar a /Ventas', () => {
    cy.visit('/Ventas');
    cy.location('pathname').should('not.eq', '/Ventas');
  });

  it('CP-UI-76: Un visitante sin sesión NO debe poder entrar a /checkout', () => {
    cy.visit('/checkout');
    cy.location('pathname').should('not.eq', '/checkout');
  });

  it('CP-UI-77: Un visitante sin sesión NO debe poder entrar a /mis-compras', () => {
    cy.visit('/mis-compras');
    cy.location('pathname').should('not.eq', '/mis-compras');
  });

  // ============================================
  // CASOS DEL ADMINISTRADOR
  // ============================================
  it('CP-UI-78: El administrador debe poder entrar a /VerUsuarios', () => {
    cy.visit('/VerUsuarios', sesionAdmin);
    cy.location('pathname').should('eq', '/VerUsuarios');
  });

  it('CP-UI-79: El administrador debe poder entrar a /VentasAdmin', () => {
    cy.visit('/VentasAdmin', sesionAdmin);
    cy.location('pathname').should('eq', '/VentasAdmin');
  });

  it('CP-UI-80: El administrador NO debe poder entrar a /CrearVenta', () => {
    cy.visit('/CrearVenta', sesionAdmin);
    cy.location('pathname').should('not.eq', '/CrearVenta');
  });

  // ============================================
  // CASOS DEL VENDEDOR
  // ============================================
  it('CP-UI-81: El vendedor debe poder entrar a /Ventas', () => {
    cy.visit('/Ventas', sesionVendedor);
    cy.location('pathname').should('eq', '/Ventas');
  });

  it('CP-UI-82: El vendedor debe poder entrar a /CrearVenta', () => {
    cy.visit('/CrearVenta', sesionVendedor);
    cy.location('pathname').should('eq', '/CrearVenta');
  });

  it('CP-UI-83: El vendedor NO debe poder entrar a /VerUsuarios', () => {
    cy.visit('/VerUsuarios', sesionVendedor);
    cy.location('pathname').should('not.eq', '/VerUsuarios');
  });

  it('CP-UI-84: El vendedor NO debe poder entrar a /VentasAdmin', () => {
    cy.visit('/VentasAdmin', sesionVendedor);
    cy.location('pathname').should('not.eq', '/VentasAdmin');
  });

  // ============================================
  // CASOS DEL BODEGUERO
  // ============================================
  it('CP-UI-85: El bodeguero debe poder entrar a /InicioBodega', () => {
    cy.visit('/InicioBodega', sesionBodeguero);
    cy.location('pathname').should('eq', '/InicioBodega');
  });

  it('CP-UI-86: El bodeguero NO debe poder entrar a /VentasAdmin', () => {
    cy.visit('/VentasAdmin', sesionBodeguero);
    cy.location('pathname').should('not.eq', '/VentasAdmin');
  });

  it('CP-UI-87: El bodeguero NO debe poder entrar a /CrearEmpleado', () => {
    cy.visit('/CrearEmpleado', sesionBodeguero);
    cy.location('pathname').should('not.eq', '/CrearEmpleado');
  });

  // ============================================
  // CASOS DEL CLIENTE
  // ============================================
  it('CP-UI-88: El cliente debe poder entrar a /mis-compras', () => {
    cy.visit('/mis-compras', sesionCliente);
    cy.location('pathname').should('eq', '/mis-compras');
  });

  it('CP-UI-89: El cliente NO debe poder entrar a /InicioAdmin', () => {
    cy.visit('/InicioAdmin', sesionCliente);
    cy.location('pathname').should('not.eq', '/InicioAdmin');
  });

  it('CP-UI-90: El cliente NO debe poder entrar a /Ventas', () => {
    cy.visit('/Ventas', sesionCliente);
    cy.location('pathname').should('not.eq', '/Ventas');
  });

  // ============================================
  // CASO DE PANTALLA PROTEGIDA → LOGIN
  // ============================================
  it('CP-UI-91: Sin sesión, una pantalla protegida debe llevar al login', () => {
    cy.visit('/VentasAdmin');
    cy.url().should('include', '/login');
  });

});
