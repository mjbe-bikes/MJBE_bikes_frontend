describe('Pruebas de Caja Negra - Inventario de productos (UI)', () => {

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

  const sesionBodeguero = {
    onBeforeLoad(win) {
      win.localStorage.setItem('mjbe_auth', 'true');
      win.localStorage.setItem('mjbe_user_id', '4');
      win.localStorage.setItem('mjbe_user_login', 'bodega1');
      win.localStorage.setItem('mjbe_rol_id', '3');       // 3 = Bodeguero (usuario id 4 = bodega1)
    },
  };

  // 🔑 Registrar el handler del confirm UNA VEZ, antes de todos los tests
  beforeEach(() => {
    cy.on('window:confirm', () => true);   // Aceptar cualquier confirm
    cy.on('window:alert', () => true);      // Aceptar cualquier alert
    cy.visit('/VerProductos', sesionAdmin);
  });

  // ============================================
  // CASOS BÁSICOS (administrador)
  // ============================================
  it('CP-UI-20: Debe mostrar el título "Productos" y las columnas de la tabla', () => {
    cy.url().should('include', '/VerProductos');
    cy.contains('h4', 'Productos').should('be.visible');
    cy.contains('th', 'ID').should('be.visible');
    cy.contains('th', 'Producto').should('be.visible');
    cy.contains('th', 'Modelo').should('be.visible');
    cy.contains('th', 'Marca').should('be.visible');
    cy.contains('th', 'Color').should('be.visible');
    cy.contains('th', 'Cantidad').should('be.visible');
    cy.contains('th', 'Estado').should('be.visible');
  });

  it('CP-UI-21: La lista debe cargar los productos desde el backend', () => {
    cy.intercept('GET', '**/api/productos').as('getProductos');
    cy.visit('/VerProductos', sesionAdmin);
    cy.wait('@getProductos').its('response.statusCode').should('eq', 200);
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.contains('No se pudo cargar el inventario desde la API.').should('not.exist');
  });

  // ============================================
  // CASOS DE FILTRO Y ORDEN
  // ============================================
  it('CP-UI-22: Debe filtrar los productos por marca', () => {
    // 👇 Tomamos la marca de la primera fila y filtramos por ella
    cy.get('table tbody tr').first().find('td').eq(3).invoke('text').then((marca) => {
      cy.contains('button', 'Filtrar').click();
      cy.get('.dropdown-menu select').first().select('marca_producto');
      cy.get('input[placeholder="Ingrese el valor"]').type(marca.trim());
      cy.contains('button', 'Aplicar filtro').click();

      // Todas las filas que quedan deben tener esa marca
      cy.get('table tbody tr').each(($fila) => {
        cy.wrap($fila).find('td').eq(3).should('contain', marca.trim());
      });
    });
  });

  it('CP-UI-23: Debe ordenar los productos por cantidad de menor a mayor', () => {
    cy.contains('button', 'Filtrar').click();
    // 👇 El orden por cantidad solo aplica si se filtra por "Cantidad"
    cy.get('.dropdown-menu select').first().select('cant_producto');
    cy.get('.dropdown-menu select').last().select('asc');
    cy.contains('button', 'Aplicar filtro').click();

    // 👇 La columna 6 es "Cantidad": cada valor debe ser mayor o igual al anterior
    let anterior = -1;
    cy.get('table tbody tr').each(($fila) => {
      const cantidad = Number($fila.find('td').eq(5).text());
      expect(cantidad).to.be.at.least(anterior);
      anterior = cantidad;
    });
  });

  // ============================================
  // CASOS DE CREACIÓN (bodeguero)
  // ============================================
  it('CP-UI-24: Debe crear un nuevo producto correctamente', () => {
    const nombreUnico = 'Producto ' + Date.now();

    cy.intercept('POST', '**/api/productos').as('crearProducto');

    // 1. Llenar el formulario
    cy.visit('/CrearProducto', sesionBodeguero);
    cy.contains('h4', 'Crear Producto').should('be.visible');
    cy.get('input[name="img_producto"]').type('https://via.placeholder.com/300');
    cy.get('input[name="nombre_producto"]').type(nombreUnico);
    cy.get('input[name="descripcion"]').type('Producto creado con Cypress');
    cy.get('input[name="color_producto"]').type('Negro');
    cy.get('input[name="marca_producto"]').type('Shimano');
    cy.get('input[name="modelo"]').type('2026');
    cy.get('input[name="cant_producto"]').type('10');
    cy.get('input[name="valor_unitario"]').type('150000');
    cy.get('select[name="id_talla"]').select(1);
    cy.get('select[name="id_proveedor"]').select(1);
    cy.get('select[name="id_local"]').select(1);
    cy.contains('button', 'Guardar Producto').click();

    // 2. Esperar a que el POST se complete
    cy.wait('@crearProducto').its('response.statusCode').should('eq', 201);

    // 3. Debe volver a la lista y mostrar el nuevo producto
    cy.url().should('include', '/VerProductos');
    cy.contains('td', nombreUnico).should('be.visible');
  });

  it('CP-UI-25: NO debe crear un producto con los campos vacíos', () => {
    cy.intercept('POST', '**/api/productos').as('crearProducto');

    cy.visit('/CrearProducto', sesionBodeguero);
    cy.contains('button', 'Guardar Producto').click();

    // 👇 No se debe llamar al backend
    cy.get('@crearProducto.all').should('have.length', 0);
    cy.url().should('include', '/CrearProducto');
  });

  it('CP-UI-26: NO debe crear un producto con cantidad negativa', () => {
    const nombreUnico = 'Negativo ' + Date.now();

    cy.visit('/CrearProducto', sesionBodeguero);
    cy.get('input[name="img_producto"]').type('https://via.placeholder.com/300');
    cy.get('input[name="nombre_producto"]').type(nombreUnico);
    cy.get('input[name="descripcion"]').type('Cantidad no válida');
    cy.get('input[name="color_producto"]').type('Negro');
    cy.get('input[name="marca_producto"]').type('Shimano');
    cy.get('input[name="modelo"]').type('2026');
    cy.get('input[name="cant_producto"]').type('-1');
    cy.get('input[name="valor_unitario"]').type('150000');
    cy.get('select[name="id_talla"]').select(1);
    cy.get('select[name="id_proveedor"]').select(1);
    cy.get('select[name="id_local"]').select(1);
    cy.contains('button', 'Guardar Producto').click();

    // 👇 El producto NO se debe guardar
    cy.visit('/VerProductos', sesionBodeguero);
    cy.contains(nombreUnico).should('not.exist');
  });

  // ============================================
  // CASO DE EDICIÓN (bodeguero)
  // ============================================
  it('CP-UI-27: Debe actualizar la cantidad de un producto', () => {
    const cantidadNueva = String(Math.floor(Math.random() * 50) + 20);

    cy.intercept('PUT', '**/api/productos/**').as('actualizarProducto');

    // 1. Clic en Actualizar en la primera fila
    cy.visit('/VerProductos', sesionBodeguero);
    cy.get('table tbody tr').first().within(() => {
      cy.contains('a', 'Actualizar').click();
    });
    cy.contains('h3', 'Actualizar Producto').should('be.visible');

    // 2. Cambiar la cantidad y guardar
    cy.get('input[name="cant_producto"]').clear().type(cantidadNueva);
    cy.contains('button', 'Actualizar Producto').click();

    // 3. Esperar a que el PUT se complete y verificar el cambio
    cy.wait('@actualizarProducto').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/VerProductos');
    cy.get('table tbody tr').first().find('td').eq(5).should('have.text', cantidadNueva);
  });

  // ============================================
  // CASOS DE DESACTIVACIÓN Y ELIMINACIÓN (bodeguero)
  // ============================================
  it('CP-UI-28: Debe desactivar un producto existente', () => {
    const nombreUnico = 'Desactivar ' + Date.now();

    cy.intercept('POST', '**/api/productos').as('crearProducto');
    cy.intercept('PUT', '**/api/productos/**').as('desactivarProducto');

    // 1. Crear el producto
    cy.visit('/CrearProducto', sesionBodeguero);
    cy.get('input[name="img_producto"]').type('https://via.placeholder.com/300');
    cy.get('input[name="nombre_producto"]').type(nombreUnico);
    cy.get('input[name="descripcion"]').type('Producto para desactivar');
    cy.get('input[name="color_producto"]').type('Negro');
    cy.get('input[name="marca_producto"]').type('Shimano');
    cy.get('input[name="modelo"]').type('2026');
    cy.get('input[name="cant_producto"]').type('10');
    cy.get('input[name="valor_unitario"]').type('150000');
    cy.get('select[name="id_talla"]').select(1);
    cy.get('select[name="id_proveedor"]').select(1);
    cy.get('select[name="id_local"]').select(1);
    cy.contains('button', 'Guardar Producto').click();
    cy.wait('@crearProducto');

    // 2. Clic en Acción → Desactivar en la fila correspondiente
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Acción').click();
    });
    cy.contains('h5', 'Gestión de producto').should('be.visible');
    cy.contains('button', 'Desactivar').click();

    // 3. Esperar a que se complete y verificar el estado
    cy.wait('@desactivarProducto').its('response.statusCode').should('eq', 200);
    cy.contains('tr', nombreUnico).should('contain', 'inactivo');
  });

  it('CP-UI-29: Debe eliminar un producto existente', () => {
    const nombreUnico = 'ParaBorrar ' + Date.now();

    cy.intercept('POST', '**/api/productos').as('crearProducto');
    cy.intercept('DELETE', '**/api/productos/**').as('borrarProducto');

    // 1. Crear el producto
    cy.visit('/CrearProducto', sesionBodeguero);
    cy.get('input[name="img_producto"]').type('https://via.placeholder.com/300');
    cy.get('input[name="nombre_producto"]').type(nombreUnico);
    cy.get('input[name="descripcion"]').type('Producto para eliminar');
    cy.get('input[name="color_producto"]').type('Negro');
    cy.get('input[name="marca_producto"]').type('Shimano');
    cy.get('input[name="modelo"]').type('2026');
    cy.get('input[name="cant_producto"]').type('10');
    cy.get('input[name="valor_unitario"]').type('150000');
    cy.get('select[name="id_talla"]').select(1);
    cy.get('select[name="id_proveedor"]').select(1);
    cy.get('select[name="id_local"]').select(1);
    cy.contains('button', 'Guardar Producto').click();
    cy.wait('@crearProducto');

    // 2. Clic en Acción → Eliminar en la fila correspondiente
    //    (el cy.on('window:confirm') ya está registrado en beforeEach)
    cy.contains('tr', nombreUnico).within(() => {
      cy.contains('button', 'Acción').click();
    });
    cy.contains('button', 'Eliminar').click();

    // 3. Esperar a que el DELETE se complete
    cy.wait('@borrarProducto').its('response.statusCode').should('be.oneOf', [200, 204]);

    // 4. Verificar que ya no esté
    cy.contains(nombreUnico).should('not.exist');
  });

});
