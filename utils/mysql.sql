CREATE TABLE users (
    username VARCHAR(20) PRIMARY KEY,
    lowercase VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    joinDate datetime,
    avatar VARCHAR(100) default '/favicon.ico',
    status VARCHAR(180)
);

CREATE TABLE posts (
	post_id INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
    image VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    date DATETIME NOT NULL,
    username VARCHAR(20),
    FOREIGN KEY(username) references users(username) ON DELETE set null
);

CREATE TABLE comments (
	comment_id INT primary key auto_increment,
    content VARCHAR(200) NOT NULL,
    date datetime,
    username VARCHAR(20),
    post_id INT,
    foreign key(username) references users(username) ON DELETE SET NULL,
    FOREIGN KEY(post_id) references posts(post_id) ON DELETE cascade
);