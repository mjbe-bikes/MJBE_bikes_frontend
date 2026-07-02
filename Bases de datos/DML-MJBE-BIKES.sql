-- ==========================
-- ROLES
-- ==========================
use mjbe_bikes;

insert into roles(tipo_rol)
values
('Administrador'),
('Cliente'),
('Vendedor'),
('Bodeguero');


insert into usuarios
(
login,
email,
password,
image_url,
token_activacion,
reset_key,
reset_base,
rol_id,
estado
)

values

(
'Eduard',
'Edu@edu.com',
SHA2('123456',256),
NULL,
'token_admin',
'reset_admin',
'base_admin',
1,
'activo'
),

(
'Jhair',
'julian12040712@gmail.com',
SHA2('123456',256),
NULL,
'token_cliente',
'reset_cliente',
'base_cliente',
2,
'activo'
),

(
'Jharol',
'Jharolwrld@gmail.com',
SHA2('123456',256),
NULL,
'token_vendedor',
'reset_vendedor',
'base_vendedor',
3,
'activo'
),

(
'Manuel',
'manuelorduzperez@gmail.com',
SHA2('123456',256),
NULL,
'token_bodeguero',
'reset_bodeguero',
'base_bodeguero',
4,
'activo'
),

(
'JuanPerez',
'juan.perez@gmail.com',
SHA2('Juan2026',256),
NULL,
'token5',
'reset5',
'base5',
2,
'activo'
),

(
'MariaGomez',
'maria.gomez@gmail.com',
SHA2('Maria#123',256),
NULL,
'token6',
'reset6',
'base6',
2,
'activo'
),

(
'CarlosRuiz',
'carlos.ruiz@gmail.com',
SHA2('CRuiz789',256),
NULL,
'token7',
'reset7',
'base7',
2,
'activo'
),

(
'LauraSanchez',
'laura.sanchez@gmail.com',
SHA2('Laura2025',256),
NULL,
'token8',
'reset8',
'base8',
2,
'activo'
),

(
'AndresTorres',
'andres.torres@gmail.com',
SHA2('ATorres88',256),
NULL,
'token9',
'reset9',
'base9',
2,
'activo'
),

(
'SofiaMartinez',
'sofia.martinez@gmail.com',
SHA2('SofiaBike1',256),
NULL,
'token10',
'reset10',
'base10',
2,
'activo'
),

(
'FelipeLopez',
'felipe.lopez@gmail.com',
SHA2('Felipe777',256),
NULL,
'token11',
'reset11',
'base11',
2,
'activo'
),

(
'ValentinaRojas',
'valentina.rojas@gmail.com',
SHA2('ValeRojas9',256),
NULL,
'token12',
'reset12',
'base12',
2,
'activo'
);




-- ==========================
-- TIPOS DOCUMENTO
-- ==========================

insert into tipos_documentos
(sigla,nombre_documento,estado)

values
('CC','Cedula Ciudadania','activo'),
('TI','Tarjeta Identidad','activo');



-- CLIENTES


insert into clientes
(
usuario_id,
tipo_documento_id,
numero_documento,
nombres,
apellidos,
direccion
)

values

(
5,
1,
'1001234567',
'Juan',
'Pérez Gómez',
'Bosa'
),

(
6,
1,
'1002345678',
'María',
'Gómez Ruiz',
'Kennedy'
),

(
7,
1,
'1003456789',
'Carlos',
'Ruiz Torres',
'Suba'
),

(
8,
2,
'10234567',
'Laura',
'Sánchez Díaz',
'Engativá'
),

(
9,
1,
'1004567890',
'Andrés',
'Torres Rojas',
'Fontibón'
),

(
10,
1,
'1005678901',
'Sofía',
'Martínez León',
'Usaquén'
),

(
11,
1,
'1006789012',
'Felipe',
'López Vargas',
'Ciudad Bolívar'
),

(
12,
2,
'10345678',
'Valentina',
'Rojas Castro',
'Soacha'
);


-- ==========================
-- TELEFONOS
-- (ejecutar después de corregir FK)
-- ==========================

insert into telefonos
(
cliente_id,
no_telefono
)

values

(1,'3104567890'),
(1,'3201234567'),

(2,'3112345678'),

(3,'3123456789'),
(3,'3009876543'),

(4,'3134567890'),

(5,'3145678901'),
(5,'3214567890'),

(6,'3156789012'),

(7,'3167890123'),
(7,'3223456789'),

(8,'3178901234');



-- ==========================
-- LOCALES
-- ==========================

insert into locales
(nombre_local,direccion_local,correo,telefono,estado)

values

(
'Local Bosa',
'Cra 1 #12-34',
'bosa@mjbe.com',
'3001234567',
'activo'
),

(
'Local Centro',
'Calle 20 #15-40',
'centro@mjbe.com',
'3209876543',
'activo'
);



-- ==========================
-- TALLAS
-- ==========================

insert into tallas (talla)

values
('XS'),
('S'),
('M'),
('L'),
('XL'),
('XXL');



-- ==========================
-- MEDIDAS
-- ==========================

insert into medidas (talla_id,tipo_medida)

values
(1,'15 pulgadas'),
(2,'16 pulgadas'),
(3,'17 pulgadas'),
(4,'18 pulgadas'),
(5,'19 pulgadas'),
(6,'21 pulgadas');



-- ==========================
-- CATEGORIAS
-- ==========================

insert into categorias (nombre_categoria)

values
('Montaña'),
('Ruta'),
('BMX'),
('Urbanas'),
('Eléctricas'),
('Infantiles'),
('Cascos'),
('Guantes'),
('Jerseys'),
('Licras'),
('Calzado'),
('Luces'),
('Herramientas'),
('Repuestos'),
('Lubricantes'),
('Accesorios');



-- ==========================
-- PROVEEDOR
-- ==========================

insert into proveedores
(
nombre_proveedor,
tipo_documento_id,
numero_identidad,
direccion,
telefono,
estado
)

values

(
'Bike Store SAS',
1,
'900123456',
'Calle 100 #20-15, Bogotá',
'3204445555',
'activo'
),

(
'Ciclo Mundo SAS',
1,
'900234567',
'Carrera 30 #45-20, Bogotá',
'3112345678',
'activo'
),

(
'Importadora GW',
1,
'900345678',
'Calle 80 #25-60, Bogotá',
'3123456789',
'activo'
),

(
'Shimano Colombia',
1,
'900456789',
'Autopista Norte #120-15, Bogotá',
'3134567890',
'activo'
),

(
'Specialized Colombia',
1,
'900567890',
'Carrera 15 #98-30, Bogotá',
'3145678901',
'activo'
),

(
'Trek Bikes Colombia',
1,
'900678901',
'Calle 170 #12-40, Bogotá',
'3156789012',
'activo'
),

(
'Venzo Bike Parts',
1,
'900789012',
'Carrera 68 #13-20, Bogotá',
'3167890123',
'activo'
),

(
'GW Bicicletas',
1,
'900890123',
'Zona Industrial, Bogotá',
'3178901234',
'activo'
),

(
'Maxxis Tires',
1,
'900901234',
'Calle 26 #70-15, Bogotá',
'3189012345',
'activo'
),

(
'Tektro Colombia',
1,
'901012345',
'Carrera 50 #22-30, Bogotá',
'3190123456',
'activo'
),

(
'Rockbros Importaciones',
1,
'901123456',
'Calle 13 #65-18, Bogotá',
'3201234567',
'activo'
),

(
'CamelBak Colombia',
1,
'901234567',
'Carrera 7 #150-20, Bogotá',
'3212345678',
'activo'
),

(
'Thule Colombia',
1,
'901345678',
'Calle 72 #18-35, Bogotá',
'3223456789',
'activo'
),

(
'Muc-Off Colombia',
1,
'901456789',
'Carrera 24 #63-40, Bogotá',
'3234567890',
'activo'
),

(
'Elite Cycling SAS',
1,
'901567890',
'Calle 127 #45-60, Bogotá',
'3245678901',
'activo'
);


-- ==========================
-- PRODUCTOS EXTRA
-- ACCESORIOS Y REPUESTOS
-- ==========================

insert into productos
(
img_producto,
nombre_producto,
descripcion,
color_producto,
marca_producto
)

values

(
'casco_bell_tracker.jpg',
'Casco Bell Tracker',
'Casco para ciclismo de montaña con ventilación avanzada',
'Azul',
'Bell'
),

(
'casco_lazer.jpg',
'Casco Lazer Compact',
'Casco ligero para uso urbano y deportivo',
'Negro',
'Lazer'
),

(
'pedales_spd.jpg',
'Pedales Shimano SPD',
'Pedales automáticos para MTB',
'Negro',
'Shimano'
),

(
'pedales_flat.jpg',
'Pedales Flat Nylon',
'Pedales de plataforma antideslizantes',
'Rojo',
'Venzo'
),

(
'guantes_gel.jpg',
'Guantes GW Gel',
'Guantes acolchados con gel para mayor comodidad',
'Negro',
'GW'
),

(
'jersey_racing.jpg',
'Jersey Racing',
'Jersey de manga corta con secado rápido',
'Rojo',
'GW'
),

(
'jersey_pro.jpg',
'Jersey Pro Team',
'Jersey profesional para competencias',
'Azul',
'Suárez'
),

(
'licra_hombre.jpg',
'Licra Hombre',
'Licra con badana de alta densidad',
'Negro',
'Suárez'
),

(
'licra_mujer.jpg',
'Licra Mujer',
'Licra femenina transpirable',
'Morado',
'Suárez'
),

(
'chaqueta_impermeable.jpg',
'Chaqueta Impermeable',
'Chaqueta resistente al agua para ciclismo',
'Gris',
'Northwave'
),

(
'chaleco_reflectivo.jpg',
'Chaleco Reflectivo',
'Chaleco de alta visibilidad',
'Amarillo',
'GW'
),

(
'zapatos_xc.jpg',
'Zapatos Shimano XC3',
'Zapatos para pedales automáticos',
'Negro',
'Shimano'
),

(
'medias_deportivas.jpg',
'Medias Deportivas',
'Medias de compresión para ciclismo',
'Blanco',
'GW'
),

(
'gafas_fotocromaticas.jpg',
'Gafas Fotocromáticas',
'Lentes que se adaptan a la luz',
'Negro',
'Oakley'
),

(
'candado_u.jpg',
'Candado Tipo U',
'Candado de alta seguridad',
'Negro',
'OnGuard'
),

(
'candado_cable.jpg',
'Candado de Cable',
'Candado flexible con combinación',
'Azul',
'GW'
),

(
'computador_gps.jpg',
'Computador GPS',
'Ciclocomputador con GPS y Bluetooth',
'Negro',
'Garmin'
),

(
'soporte_gps.jpg',
'Soporte GPS',
'Soporte para ciclocomputador',
'Negro',
'Garmin'
),

(
'guardabarros_mtb.jpg',
'Guardabarros MTB',
'Juego delantero y trasero',
'Negro',
'GW'
),

(
'porta_bicicletas.jpg',
'Portabicicletas',
'Soporte para dos bicicletas',
'Plateado',
'Thule'
),

(
'multiherramienta.jpg',
'Multiherramienta 16 en 1',
'Herramienta para mantenimiento',
'Gris',
'Rockbros'
),

(
'botiquin.jpg',
'Botiquín Compacto',
'Botiquín portátil para ciclistas',
'Rojo',
'GW'
),

(
'cinta_manubrio.jpg',
'Cinta para Manubrio',
'Cinta antideslizante para ruta',
'Negro',
'PRO'
),

(
'grasa_cadena.jpg',
'Lubricante Cadena',
'Lubricante para cadenas de bicicleta',
'Transparente',
'Finish Line'
),

(
'limpiador_bici.jpg',
'Limpiador Bicicleta',
'Limpiador biodegradable',
'Verde',
'Muc-Off'
),

(
'desengrasante.jpg',
'Desengrasante',
'Desengrasante para transmisión',
'Azul',
'Muc-Off'
),

(
'bolso_herramientas.jpg',
'Bolso Herramientas',
'Bolso bajo sillín para herramientas',
'Negro',
'Roswheel'
),

(
'maleta_hidratacion.jpg',
'Maleta Hidratación',
'Morral con bolsa de agua de 2 litros',
'Negro',
'CamelBak'
),

(
'rodillo_entrenamiento.jpg',
'Rodillo de Entrenamiento',
'Rodillo para entrenamiento en casa',
'Negro',
'Elite'
),

(
'parrilla_carga.jpg',
'Parrilla Trasera',
'Parrilla para transportar equipaje',
'Negro',
'Topeak'
);