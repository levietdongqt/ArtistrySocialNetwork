DROP DATABASE IF EXISTS snap_connectDb;
CREATE DATABASE snap_connectDb;
use snap_connectDb;

CREATE TABLE IF NOT EXISTS roles (
	id Bigint auto_increment,
    name enum('ROLE_USER','ROLE_ADMIN','ROLE_PROVIDER','ROLE_STUDIO','ROLE_MAKEUP','ROLE_MODEL','ROLE_PHOTO') unique,
    description varchar(255) CHARACTER SET utf8mb4,
    primary key(id) 
);

CREATE TABLE IF NOT EXISTS users (
	id VARCHAR(36) DEFAULT (UUID()),
    full_name varchar(50) CHARACTER SET utf8mb4,
    email varchar(50) CHARACTER SET utf8mb4  null unique,
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
    metadata JSON,
    auth_provider varchar(20),
    priority_score float default 0,
    password varchar(128) CHARACTER SET utf8mb4,
    change_password boolean default 0,
    search_history JSON,
     theme ENUM('LIGHT', 'DIM', 'DARK') DEFAULT 'LIGHT',
        accent ENUM('BLUE', 'YELLOW', 'PINK', 'PURPLE', 'ORANGE', 'GREEN') DEFAULT 'BLUE',
    bio text null,
    update_At datetime null,
    verified boolean default 0,
    total_Post int default 0,
    total_Photos int default 0,
    pinned_Post varchar(250) null,
    address varchar(250) null,
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
    status json DEFAULT NULL,
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

CREATE TABLE IF NOT EXISTS promotions (
	id Bigint auto_increment,
	name varchar(100) CHARACTER SET utf8mb4 not null,
    discount_Percent float default 0,
    start_Date datetime not null,
    end_Date datetime not null,
    user_id VARCHAR(36),
    description TEXT,
    type enum('FOR_ORDER','FOR_SERVICE'),
    status boolean default 1,
	Foreign key(user_id) references users(id),
    primary key(id)
);
CREATE TABLE IF NOT EXISTS extra_services (
	id Bigint auto_increment,
    user_Id VARCHAR(36),
    name varchar(100) CHARACTER SET utf8mb4,
    price double default 0,
    price_Type varchar(20) CHARACTER SET utf8mb4 not null,
    description TEXT,
	image_Url JSON,
    status bit default(1),
    create_Date datetime,
    create_By varchar(50) CHARACTER SET utf8mb4,
    update_Date datetime,
	promotion_Id bigint,
    primary key(id),
    Foreign key(user_Id) references users(id),
    Foreign key(promotion_Id) references promotions(id)
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
    promotion_Id bigint,
    primary key(id),
    Foreign key(promotion_Id) references promotions(id),
    Foreign key(user_Id) references users(id)
);

CREATE TABLE additional_details (
	main_service_Id Bigint,
    extra_service_Id Bigint,
    primary key(main_service_Id,extra_service_Id),
    foreign key(main_service_Id) references main_services(id),
    foreign key(extra_service_Id) references extra_services(id)
);

CREATE TABLE saved_service(
	user_Id VARCHAR(36),
    main_Service_Id Bigint,
    primary key(user_Id,main_Service_Id),
    foreign key(user_Id) references users(id),
    foreign key(main_Service_Id) references main_services(id)
);

CREATE TABLE IF NOT EXISTS working_time (
	id Bigint auto_increment,
    user_Id VARCHAR(36),
    start_Date datetime not null,
    end_Date datetime not null,
    working_Day varchar(20) CHARACTER SET utf8mb4,
    status boolean default 1,
	working_Days json DEFAULT NULL,
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
    promotion_Id bigint,
	status ENUM('PENDING', 'ACTIVE', 'CANCELLING', 'CANCELLED') DEFAULT 'PENDING',
    amount int,
    total_Price bigint,
    meta_Data json,
    primary key(id),
    Foreign key(customer_User_Id) references users(id),
    Foreign key(promotion_Id) references promotions(id),
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

DELIMITER $$
CREATE PROCEDURE FindFriendByFullName(in v_status VARCHAR(255))
BEGIN
    SET @json_status = CONCAT('"', v_status, '"');
    SELECT *
    FROM FriendShip
    WHERE JSON_CONTAINS(`status`, @json_status, '$') = 1;
END; $$

INSERT INTO users
(`id`,`full_name`, `email`, `phone_number`, `gender`, `email_confirmed`, `phone_confirmed`, `password`,`status`)
 VALUES ('e32a7a1c-98e2-498c-97e2-65404e4fd356','Trần Thụ Huy', 'huy@gmail.com', '+84398713844',b'1', b'1', b'1', '$2a$10$JtnC7NwMNMKK3UeW7awdFuymSQsRJSwnm6UrttGHlc07ZDJSJLqwO','ACTIVED'),
 ('7aac6b78-49b0-492a-a653-976bc56df03d','Lê Viết Đông', 'dong@gmail.com', '+84398713843',b'1', b'1', b'1', '$2a$10$JtnC7NwMNMKK3UeW7awdFuymSQsRJSwnm6UrttGHlc07ZDJSJLqwO','ACTIVED'); 

INSERT INTO roles(`id`,`name`,`description`)	
VALUES
 (1,'ROLE_ADMIN', 'This is role for admin page'),
 (2,'ROLE_USER', 'This is role for normal user'),
 (3,'ROLE_PROVIDER', 'This is role for service  provider'),
(4,'ROLE_STUDIO', 'This is role for studio provider'),
 (5,'ROLE_MAKEUP', 'This is role for provider Makeup'),
 (6,'ROLE_PHOTO', 'This is role for provider photo'),
 (7,'ROLE_MODEL', 'This is role for provider model');
 
INSERT INTO users_roles (`user_Id`,`role_Id`)
values 
	('e32a7a1c-98e2-498c-97e2-65404e4fd356','2'),
    	('7aac6b78-49b0-492a-a653-976bc56df03d','2');
