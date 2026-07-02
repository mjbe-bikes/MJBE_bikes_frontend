-- ============================================================
-- CONSULTAS SIMPLES
-- ============================================================

-- 1. Mostrar todos los usuarios
SELECT * FROM usuarios;

-- 2. Mostrar todos los clientes
SELECT * FROM clientes;

-- 3. Mostrar todos los productos
SELECT * FROM productos;

-- 4. Mostrar proveedores activos
SELECT *
FROM proveedores
WHERE estado = 'activo';

-- 5. Clientes que viven en Bosa
SELECT *
FROM clientes
WHERE direccion = 'Bosa';

-- 6. Productos de la marca GW
SELECT *
FROM productos
WHERE marca_producto = 'GW';

-- 7. Usuarios ordenados por login
SELECT *
FROM usuarios
ORDER BY login;

-- 8. Primeros 10 productos
SELECT *
FROM productos
LIMIT 10;



-- ============================================================
-- INNER JOIN
-- ============================================================

-- 1. Usuarios con su rol
SELECT
u.login,
u.email,
r.tipo_rol
FROM usuarios u
INNER JOIN roles r
ON u.rol_id = r.id;

-- 2. Clientes con su usuario
SELECT
u.login,
c.nombres,
c.apellidos
FROM usuarios u
INNER JOIN clientes c
ON u.id = c.usuario_id;

-- 3. Clientes con tipo de documento
SELECT
c.nombres,
c.apellidos,
td.sigla,
td.nombre_documento
FROM clientes c
INNER JOIN tipos_documentos td
ON c.tipo_documento_id = td.id;

-- 4. Clientes con teléfonos
SELECT
c.nombres,
c.apellidos,
t.no_telefono
FROM clientes c
INNER JOIN telefonos t
ON c.id = t.cliente_id;

-- 5. Tallas con medidas
SELECT
ta.talla,
m.tipo_medida
FROM tallas ta
INNER JOIN medidas m
ON ta.id = m.talla_id;



-- ============================================================
-- LEFT JOIN
-- ============================================================

-- 1. Todos los usuarios aunque no tengan registro en clientes
SELECT
u.login,
u.email,
c.nombres,
c.apellidos
FROM usuarios u
LEFT JOIN clientes c
ON u.id = c.usuario_id;

-- 2. Todas las tallas aunque no tengan medida
SELECT
ta.talla,
m.tipo_medida
FROM tallas ta
LEFT JOIN medidas m
ON ta.id = m.talla_id;

-- 3. Todos los clientes aunque no tengan teléfono
SELECT
c.nombres,
c.apellidos,
t.no_telefono
FROM clientes c
LEFT JOIN telefonos t
ON c.id = t.cliente_id;

-- 4. Todos los roles aunque no tengan usuarios
SELECT
r.tipo_rol,
u.login
FROM roles r
LEFT JOIN usuarios u
ON r.id = u.rol_id;

-- 5. Todos los tipos de documento aunque no tengan clientes
SELECT
td.sigla,
td.nombre_documento,
c.nombres,
c.apellidos
FROM tipos_documentos td
LEFT JOIN clientes c
ON td.id = c.tipo_documento_id;



-- ============================================================
-- RIGHT JOIN
-- ============================================================

-- 1. Todos los clientes con su usuario
SELECT
u.login,
c.nombres,
c.apellidos
FROM usuarios u
RIGHT JOIN clientes c
ON u.id = c.usuario_id;

-- 2. Todas las medidas con su talla
SELECT
ta.talla,
m.tipo_medida
FROM tallas ta
RIGHT JOIN medidas m
ON ta.id = m.talla_id;

-- 3. Todos los teléfonos con su cliente
SELECT
c.nombres,
c.apellidos,
t.no_telefono
FROM clientes c
RIGHT JOIN telefonos t
ON c.id = t.cliente_id;

-- 4. Todos los usuarios con su rol
SELECT
r.tipo_rol,
u.login
FROM roles r
RIGHT JOIN usuarios u
ON r.id = u.rol_id;

-- 5. Todos los clientes con su tipo de documento
SELECT
td.sigla,
td.nombre_documento,
c.nombres,
c.apellidos
FROM tipos_documentos td
RIGHT JOIN clientes c
ON td.id = c.tipo_documento_id;



-- ============================================================
-- SUBCONSULTAS NO CORRELACIONADAS
-- ============================================================

-- 1. Usuarios que son clientes
SELECT *
FROM usuarios
WHERE rol_id = (
SELECT id
FROM roles
WHERE tipo_rol = 'Cliente'
);

-- 2. Usuarios administradores
SELECT *
FROM usuarios
WHERE rol_id = (
SELECT id
FROM roles
WHERE tipo_rol = 'Administrador'
);

-- 3. Clientes con cédula
SELECT *
FROM clientes
WHERE tipo_documento_id = (
SELECT id
FROM tipos_documentos
WHERE sigla='CC'
);

-- 4. Clientes con tarjeta de identidad
SELECT *
FROM clientes
WHERE tipo_documento_id = (
SELECT id
FROM tipos_documentos
WHERE sigla='TI'
);

-- 5. Medida de la talla XL
SELECT *
FROM medidas
WHERE talla_id = (
SELECT id
FROM tallas
WHERE talla='XL'
);



-- ============================================================
-- SUBCONSULTAS CORRELACIONADAS
-- ============================================================

-- 1. Clientes con más de un teléfono
SELECT
c.nombres,
c.apellidos
FROM clientes c
WHERE (
SELECT COUNT(*)
FROM telefonos t
WHERE t.cliente_id = c.id
) > 1;

-- 2. Clientes que tienen teléfono registrado
SELECT
c.nombres,
c.apellidos
FROM clientes c
WHERE EXISTS(
SELECT *
FROM telefonos t
WHERE t.cliente_id = c.id
);

-- 3. Usuarios registrados como clientes
SELECT
u.login
FROM usuarios u
WHERE EXISTS(
SELECT *
FROM clientes c
WHERE c.usuario_id = u.id
);

-- 4. Tallas que tienen medida registrada
SELECT
ta.talla
FROM tallas ta
WHERE EXISTS(
SELECT *
FROM medidas m
WHERE m.talla_id = ta.id
);

-- 5. Proveedores activos
SELECT
p.nombre_proveedor
FROM proveedores p
WHERE EXISTS(
SELECT *
FROM proveedores pr
WHERE pr.id = p.id
AND pr.estado='activo'
);