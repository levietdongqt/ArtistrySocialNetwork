use projectsem4;
CREATE TABLE IF NOT EXISTS roles (
	id int auto_increment,
    name varchar(50) CHARACTER SET utf8mb4 not null,
    description varchar(255) CHARACTER SET utf8mb4,
    primary key(id) 
);

CREATE TABLE IF NOT EXISTS users (
	id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())),
    fullName varchar(50) CHARACTER SET utf8mb4,
    email varchar(50) CHARACTER SET utf8mb4 not null,
    phoneNumber varchar(20) CHARACTER SET utf8mb4,
    gender bit,
    emailConfirmed bit default 0,
    phoneConfirmed bit default 0,
    createDate datetime default now(),
    status enum('Pending','Actived','Blocked'),
    location JSON,
    avatar varchar(255) CHARACTER SET utf8mb4,
    coverImage varchar(255) CHARACTER SET utf8mb4,
    userDetails JSON,
    priorityScore float,
    password varchar(128) CHARACTER SET utf8mb4,
    changePassword tinyint(1),
    searchHistory JSON,
    theme enum('light','dim','dark') null,
    accent enum('blue','yellow','pink','purple','orange','green') null,
    bio text null,
    updateAt datetime null,
    verified boolean,
    totalPost bigint,
    totalPhotos bigint,
    pinnedPost varchar(250) null,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS sessions(
	id varchar(100) not null,
    userId BINARY(16) not null,
    refreshToken varchar(100) not null,
    userAgent varchar(100) not null,
    clientIp varchar(100) not null,
    isBlocked bit not null default(0),
    expiresAt datetime not null,
    createdAt datetime not null default now(),
    primary key(id),
    foreign key(userId) references users(id)
);

CREATE TABLE IF NOT EXISTS users_roles (
	userId binary(16),
    roleId int,
    primary key(userId,roleId),
    Foreign key(userId) references users(id),
     Foreign key(roleId) references roles(id)
);

CREATE TABLE IF NOT EXISTS friendships (
	id int auto_increment,
    fromUsersId binary(16) not null,
    toUserId binary(16),
    status enum('Pending','IsFriend','Following','Blocked'),
    primary key(id),
    foreign key(fromUsersId) references users(id),
    foreign key(toUserId) references users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
	id int auto_increment,
    customerUserId binary(16),
    providerUserId binary(16),
    primary key(id),
    Foreign key(customerUserId) references users(id),
	Foreign key(providerUserId) references users(id)
);

CREATE TABLE IF NOT EXISTS extra_services (
	id int auto_increment,
    userId binary(16),
    name varchar(100) CHARACTER SET utf8mb4,
    price double not null,
    priceType varchar(20) CHARACTER SET utf8mb4 not null,
    description TEXT,
    status bit default(1),
    createDate datetime,
    createBy varchar(50) CHARACTER SET utf8mb4,
    updateDate datetime,
    primary key(id),
    Foreign key(userId) references users(id)
);

CREATE TABLE IF NOT EXISTS main_services (
	id int auto_increment,
    userId binary(16),
    name varchar(100) CHARACTER SET utf8mb4,
    price double not null,
    priceType varchar(20) CHARACTER SET utf8mb4 not null,
    duration float not null,
    restTime float default 0,
    imageUrl JSON,
    description TEXT,
    status bit default(1),
    createDate datetime,
    createBy varchar(50) CHARACTER SET utf8mb4,
    updateDate datetime,
    primary key(id),
    Foreign key(userId) references users(id)
);

CREATE TABLE SavedService(
	userId BINARY(16),
    mainServiceId int,
    primary key(userId,mainServiceId),
    foreign key(userId) references users(id),
    foreign key(mainServiceId) references main_services(id)
);


CREATE TABLE IF NOT EXISTS promotions (
	id int auto_increment,
	name varchar(100) CHARACTER SET utf8mb4 not null,
    discountPercent float not null,
    startDate datetime not null,
    endDate datetime not null,
    description TEXT,
    status tinyint(1) default 1,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS promotion_details (
	mainServiceId int,
    promotionId int,
    Foreign key(mainServiceId) references main_services(id),
	Foreign key(promotionId) references promotions(id)
);


CREATE TABLE IF NOT EXISTS working_time (
	id int auto_increment,
    userId binary(16),
    startDate datetime not null,
    endDate datetime not null,
    workingDay varchar(20) CHARACTER SET utf8mb4,
    status tinyint(1) default 1,
    primary key(id),
    Foreign key(userId) references users(id)
);

CREATE TABLE IF NOT EXISTS orders (
	id int auto_increment,
    customerUserId binary(16),
    providerUserId binary(16),
	mainServiceId int,
	additonalService Json,
    startDate datetime not null,
    endDate datetime not null,
    createDate datetime,
    createBy varchar(50) CHARACTER SET utf8mb4,
    updateDate datetime,
    address varchar(255) CHARACTER SET utf8mb4,
    status enum('Pending','Actived','Cancelled'),
    primary key(id),
    Foreign key(customerUserId) references users(id),
    Foreign key(providerUserId) references users(id),
    Foreign key(mainServiceId) references main_services(id)
);

Create Table template(
	id int auto_increment,
    name varchar(100) character set utf8mb4,
    price double not null,
    priceType varchar(20)  character set utf8mb4 not null,
    duration float not null,
    imageUrl json,
    description varchar(255) character set utf8mb4,
    type varchar(100) character set utf8mb4,
    primary key(id)
);

CREATE INDEX fullNameIndex ON users(fullName);
CREATE INDEX statusIndex ON orders(status);

