DROP DATABASE IF EXISTS projectsem4;
CREATE DATABASE projectsem4;
use projectsem4;

CREATE TABLE IF NOT EXISTS roles (
	id Bigint auto_increment,
    name enum('ROLE_USER','ROLE_ADMIN','ROLE_PROVIDER','ROLE_STUDIO','ROLE_MAKEUP') unique,
    description varchar(255) CHARACTER SET utf8mb4,
    primary key(id) 
);

CREATE TABLE IF NOT EXISTS users (
	id VARCHAR(36) DEFAULT (UUID()),
    full_name varchar(50) CHARACTER SET utf8mb4,
    email varchar(50) CHARACTER SET utf8mb4 not null unique,
    phone_number varchar(20) CHARACTER SET utf8mb4 unique,
    gender bit default 1,
    date_of_birth date,
    email_confirmed bit default 0,
    phone_confirmed bit default 0,
    create_date datetime default now(),
	status ENUM('PENDING', 'ACTIVED', 'BLOCKED') DEFAULT 'PENDING',
	location JSON,
    avatar varchar(255) CHARACTER SET utf8mb4,
    cover_image varchar(255) CHARACTER SET utf8mb4,
    user_details JSON,
    priority_score float default 0,
    password varchar(128) CHARACTER SET utf8mb4,
    change_password boolean default 0,
    search_history JSON,
     theme ENUM('LIGHT', 'DIM', 'DARK') DEFAULT NULL,
        accent ENUM('BLUE', 'YELLOW', 'PINK', 'PURPLE', 'ORANGE', 'GREEN') DEFAULT NULL,
    bio text null,
    update_At datetime null,
    verified boolean default 0,
    total_Post int default 0,
    total_Photos int default 0,
    pinned_Post varchar(250) null,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS sessions(
	id Bigint auto_increment,
    user_Id VARCHAR(36) not null,
    refresh_Token varchar(100) not null,
    user_Agent varchar(100) null,
    client_Ip varchar(100)  null,
    is_Blocked bit not null default(0),
    expires_At datetime not null,
    created_At datetime not null default now(),
    primary key(id),
    foreign key(user_Id) references users(id)
);

CREATE TABLE IF NOT EXISTS users_roles (
	user_Id VARCHAR(36),
    role_Id Bigint,
    primary key(user_Id,role_Id),
    Foreign key(user_Id) references users(id),
	Foreign key(role_Id) references roles(id)
);

CREATE TABLE IF NOT EXISTS friendships (
	id Bigint auto_increment,
    from_User_Id VARCHAR(36) not null,
    to_User_Id VARCHAR(36),
    status ENUM('PENDING', 'ISFRIEND', 'FOLLOWING', 'BLOCKED') DEFAULT 'PENDING',
    primary key(id),
    foreign key(from_User_Id) references users(id),
    foreign key(to_User_Id) references users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
	id Bigint auto_increment,
    customer_User_Id VARCHAR(36),
    provider_User_Id VARCHAR(36),
    review_Details Json,
    primary key(id),
    Foreign key(customer_User_Id) references users(id),
	Foreign key(provider_User_Id) references users(id)
);

CREATE TABLE IF NOT EXISTS extra_services (
	id Bigint auto_increment,
    user_Id VARCHAR(36),
    name varchar(100) CHARACTER SET utf8mb4,
    price double default 0,
    price_Type varchar(20) CHARACTER SET utf8mb4 not null,
    description TEXT,
    status bit default(1),
    create_Date datetime,
    create_By varchar(50) CHARACTER SET utf8mb4,
    update_Date datetime,
    primary key(id),
    Foreign key(user_Id) references users(id)
);

CREATE TABLE IF NOT EXISTS main_services (
	id Bigint auto_increment,
    user_Id VARCHAR(36),
    name varchar(100) CHARACTER SET utf8mb4,
    price double default 0,
    price_Type varchar(20) CHARACTER SET utf8mb4 not null,
    duration float default 0,
    rest_Time float default 0,
    image_Url JSON,
    description TEXT,
    status bit default(1),
    create_Date datetime,
    create_By varchar(50) CHARACTER SET utf8mb4,
    update_Date datetime,
    primary key(id),
    Foreign key(user_Id) references users(id)
);

CREATE TABLE Additional_Details (
	main_service_Id Bigint,
    extra_service_Id Bigint,
    primary key(main_service_Id,extra_service_Id),
    foreign key(main_service_Id) references main_services(id),
    foreign key(extra_service_Id) references extra_services(id)
);

CREATE TABLE Saved_Service(
	user_Id VARCHAR(36),
    main_Service_Id Bigint,
    primary key(user_Id,main_Service_Id),
    foreign key(user_Id) references users(id),
    foreign key(main_Service_Id) references main_services(id)
);

CREATE TABLE IF NOT EXISTS promotions (
	id Bigint auto_increment,
	name varchar(100) CHARACTER SET utf8mb4 not null,
    discount_Percent float default 0,
    start_Date datetime not null,
    end_Date datetime not null,
    description TEXT,
    status boolean default 1,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS promotion_details (
	main_Service_Id Bigint,
    promotion_Id Bigint,
    Foreign key(main_Service_Id) references main_services(id),
	Foreign key(promotion_Id) references promotions(id)
);


CREATE TABLE IF NOT EXISTS working_time (
	id Bigint auto_increment,
    user_Id VARCHAR(36),
    start_Date datetime not null,
    end_Date datetime not null,
    working_Day varchar(20) CHARACTER SET utf8mb4,
    status boolean default 1,
    primary key(id),
    Foreign key(user_Id) references users(id)
);

CREATE TABLE IF NOT EXISTS orders (
	id Bigint auto_increment,
    customer_User_Id VARCHAR(36),
    provider_User_Id VARCHAR(36),
	main_Service_Id Bigint,
	additional_Service Json,
    start_Date datetime not null,
    end_Date datetime not null,
    create_Date datetime,
    create_By varchar(50) CHARACTER SET utf8mb4,
    update_Date datetime,
    address varchar(255) CHARACTER SET utf8mb4,
	status ENUM('PENDING', 'ACTIVE', 'CANCELLING', 'CANCELLED') DEFAULT 'PENDING',
    primary key(id),
    Foreign key(customer_User_Id) references users(id),
    Foreign key(provider_User_Id) references users(id),
    Foreign key(main_Service_Id) references main_services(id)
);

Create Table template(
	id Bigint auto_increment,
    name varchar(100) character set utf8mb4,
    price double default 0,
    price_Type varchar(20)  character set utf8mb4 not null,
    duration float default 0,
    image_Url json,
    description varchar(255) character set utf8mb4,
    type enum('MAIN_SERVICE','EXTRA_SERVICE'),
    primary key(id)
);

CREATE INDEX fullNameIndex ON users(full_Name);
CREATE INDEX statusIndex ON orders(status);
CREATE INDEX refreshTokenIndex ON sessions(refresh_token);

INSERT INTO `projectsem4`.`Users` 
(`full_name`, `email`, `phone_number`, `gender`, `email_confirmed`, `phone_confirmed`, `password`)
 VALUES ('Trần Thụ Huy', 'huy@gmail.com', '1234567891',b'1', b'1', b'1', '123'),
 ('Lê Viết Đông', 'dong@gmail.com', '1234567892',b'1', b'1', b'1', '123');
 
INSERT INTO `projectsem4`.`roles` (`name`, `description`) 
VALUES
 ('ROLE_ADMIN', 'This is role for admin page'),
 ('ROLE_USER', 'This is role for normal user'),
 ('ROLE_PROVIDER', 'This is role for service  provider'),
('ROLE_STUDIO', 'This is role for studio provider'),
 ('ROLE_MAKEUP', 'This is role for provider Makeup');
