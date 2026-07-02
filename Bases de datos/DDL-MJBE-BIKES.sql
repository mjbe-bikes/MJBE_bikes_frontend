create database mjbe_bikes
CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
use mjbe_bikes;

-- creacion de tablas primarias
create table roles (
	id int auto_increment primary key,
    tipo_rol varchar(50) not null
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;


create table tipos_documentos(
	id int auto_increment primary key,
    sigla varchar(20) not null ,
    nombre_documento varchar(255) not null ,
    estado varchar(20) not null,
    
    constraint uc_tipos_documentos unique(sigla, nombre_documento)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table locales(
	id int auto_increment primary key,
    nombre_local varchar(255)not null,
    direccion_local varchar(150) not null ,
    correo varchar(255) not null ,
    telefono varchar(20) not null,
    estado varchar(20) not null,
    
    constraint uc_locales unique(direccion_local, correo)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table tallas (
	id int auto_increment primary key,
    talla varchar(50) not null
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table categorias (
	id int auto_increment primary key,
    nombre_categoria varchar(50) not null
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;



-- Creacion de tablas secundarias

create table usuarios (
	id int auto_increment primary key,
    login varchar(50) not null ,
    email varchar(255) not null,
    password varchar(255) not null,
    image_url varchar(255),
    token_activacion varchar(255) not null,
    reset_key varchar(255) not null,
	reset_base varchar(255) not null,
    rol_id int not null,
    estado varchar(20) not null,
    
    constraint uc_usuario unique(login, email),
    
    foreign key (rol_id)
    references roles(id)
    on update cascade
    
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table clientes (
	id int auto_increment primary key,
    usuario_id int not null,
    tipo_documento_id int not null,
    numero_documento varchar(30)not null,
    nombres varchar(100)not null,
    apellidos varchar(100)not null,
	direccion varchar(150)not null,
    
    
    constraint uc_cliente unique(tipo_documento_id, numero_documento),
    
    foreign key (usuario_id)
    references usuarios(id)
    on update cascade
    on delete restrict,
    
    foreign key(tipo_documento_id)
    references tipos_documentos(id)
    on update cascade
    on delete restrict
   
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table telefonos(
	id int auto_increment primary key,
    cliente_id int not null,
    no_telefono varchar(20) not null,
    
    foreign key (cliente_id)
    references clientes(id)
    on update cascade
    on delete cascade
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table medidas(
	id int auto_increment primary key,
    talla_id int not null,
    tipo_medida varchar(40) not null,
    
    foreign key (talla_id)
    references tallas(id)
    on update cascade
    on delete restrict
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table proveedores(
	id int auto_increment primary key,
    nombre_proveedor varchar(100) not null,
    tipo_documento_id int not null,
    numero_identidad varchar(30) not null,
    direccion varchar(150) not null,
    telefono varchar(20) not null,
    estado varchar(20)not null,
    
     constraint uc_proveedores unique(tipo_documento_id, numero_identidad),
    
    foreign key (tipo_documento_id)
    references tipos_documentos(id)
    on update cascade
    on delete restrict
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

create table productos(
	id int auto_increment primary key,
    img_producto varchar(255) not null,
    nombre_producto varchar(40) not null,
    descripcion varchar(100) not null,
    color_producto varchar(20) not null,
    marca_producto varchar(20) not null
    
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_venta DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL,

    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;