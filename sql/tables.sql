-- `bg-database`.Account definition

CREATE TABLE `Account` (
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `funds` decimal(7,2) DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.BoardGame definition

CREATE TABLE `BoardGame` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `year_published` int DEFAULT NULL,
  `min_players` int DEFAULT NULL,
  `max_players` int DEFAULT NULL,
  `average_user_score` double DEFAULT NULL,
  `bayes_average_user_score` double DEFAULT NULL,
  `users_rate` int DEFAULT NULL,
  `game_rank` int DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_play_time` int DEFAULT NULL,
  `min_play_time` int DEFAULT NULL,
  `playing_time` int DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `is_expansion` tinyint(1) DEFAULT NULL,
  `is_reimplementation` tinyint(1) DEFAULT NULL,
  `store_page_rating` double DEFAULT NULL,
  `series` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.BG_Transaction definition

CREATE TABLE `BG_Transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_account_email` varchar(255) NOT NULL,
  `date_time` datetime DEFAULT NULL,
  `total` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_account_email` (`fk_account_email`),
  CONSTRAINT `BG_Transaction_ibfk_1` FOREIGN KEY (`fk_account_email`) REFERENCES `Account` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.Category definition

CREATE TABLE `Category` (
  `fk_board_game_id` int NOT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`fk_board_game_id`,`category`),
  CONSTRAINT `Category_ibfk_1` FOREIGN KEY (`fk_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.Expansion definition

CREATE TABLE `Expansion` (
  `fk_parent_board_game_id` int NOT NULL,
  `fk_child_board_game_id` int NOT NULL,
  PRIMARY KEY (`fk_child_board_game_id`),
  KEY `fk_parent_board_game_id` (`fk_parent_board_game_id`),
  CONSTRAINT `Expansion_ibfk_1` FOREIGN KEY (`fk_parent_board_game_id`) REFERENCES `BoardGame` (`id`),
  CONSTRAINT `Expansion_ibfk_2` FOREIGN KEY (`fk_child_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.FundRecord definition

CREATE TABLE `FundRecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_email` varchar(255) NOT NULL,
  `amount` decimal(7,2) DEFAULT NULL,
  `date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_email` (`fk_email`),
  CONSTRAINT `FundRecord_ibfk_1` FOREIGN KEY (`fk_email`) REFERENCES `Account` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.`Implementation` definition

CREATE TABLE `Implementation` (
  `fk_parent_board_game_id` int NOT NULL,
  `fk_child_board_game_id` int NOT NULL,
  PRIMARY KEY (`fk_child_board_game_id`),
  KEY `fk_parent_board_game_id` (`fk_parent_board_game_id`),
  CONSTRAINT `Implementation_ibfk_1` FOREIGN KEY (`fk_parent_board_game_id`) REFERENCES `BoardGame` (`id`),
  CONSTRAINT `Implementation_ibfk_2` FOREIGN KEY (`fk_child_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.Mechanics definition

CREATE TABLE `Mechanics` (
  `fk_board_game_id` int NOT NULL,
  `mechanic` varchar(255) NOT NULL,
  PRIMARY KEY (`fk_board_game_id`,`mechanic`),
  CONSTRAINT `Mechanics_ibfk_1` FOREIGN KEY (`fk_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.Owned definition

CREATE TABLE `Owned` (
  `fk_email` varchar(255) NOT NULL,
  `fk_board_game_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`fk_email`,`fk_board_game_id`),
  KEY `fk_board_game_id` (`fk_board_game_id`),
  CONSTRAINT `Owned_ibfk_1` FOREIGN KEY (`fk_email`) REFERENCES `Account` (`email`),
  CONSTRAINT `Owned_ibfk_2` FOREIGN KEY (`fk_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.Rating definition

CREATE TABLE `Rating` (
  `fk_email` varchar(255) NOT NULL,
  `fk_board_game_id` int NOT NULL,
  `number_rating` int NOT NULL,
  `text` varchar(1023) DEFAULT NULL,
  PRIMARY KEY (`fk_email`,`fk_board_game_id`),
  KEY `fk_board_game_id` (`fk_board_game_id`),
  CONSTRAINT `Rating_ibfk_1` FOREIGN KEY (`fk_email`) REFERENCES `Account` (`email`),
  CONSTRAINT `Rating_ibfk_2` FOREIGN KEY (`fk_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.TransLines definition

CREATE TABLE `TransLines` (
  `fk_transaction_id` int NOT NULL,
  `fk_board_game_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`fk_transaction_id`,`fk_board_game_id`),
  KEY `fk_board_game_id` (`fk_board_game_id`),
  CONSTRAINT `TransLines_BG_Transaction_FK` FOREIGN KEY (`fk_transaction_id`) REFERENCES `BG_Transaction` (`id`),
  CONSTRAINT `TransLines_ibfk_2` FOREIGN KEY (`fk_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- `bg-database`.BG_Return definition

CREATE TABLE `BG_Return` (
  `return_id` int NOT NULL AUTO_INCREMENT,
  `fk_board_game_id` int NOT NULL,
  `date_time` datetime DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `fk_transaction_id` int NOT NULL,
  PRIMARY KEY (`return_id`),
  KEY `fk_board_game_id` (`fk_board_game_id`),
  KEY `BG_Return_BG_Transaction_FK` (`fk_transaction_id`),
  CONSTRAINT `BG_Return_BG_Transaction_FK` FOREIGN KEY (`fk_transaction_id`) REFERENCES `BG_Transaction` (`id`),
  CONSTRAINT `BG_Return_ibfk_2` FOREIGN KEY (`fk_board_game_id`) REFERENCES `BoardGame` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
