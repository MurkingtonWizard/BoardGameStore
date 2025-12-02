CREATE DEFINER=`admin`@`%` TRIGGER `a_expansion` AFTER INSERT ON `Expansion` FOR EACH ROW BEGIN
	UPDATE BoardGame bg SET bg.is_expansion = TRUE
	WHERE bg.id = NEW.fk_child_board_game_id;

END;

CREATE DEFINER=`admin`@`%` TRIGGER `a_fund_record` AFTER INSERT ON `FundRecord` FOR EACH ROW BEGIN
	UPDATE Account a
		SET a.funds = a.funds + NEW.amount;
END;

CREATE DEFINER=`admin`@`%` TRIGGER `a_implementation` AFTER INSERT ON `Implementation` FOR EACH ROW BEGIN
	UPDATE BoardGame bg SET bg.is_reimplementation = TRUE
		WHERE bg.id = NEW.fk_child_board_game_id;
END;

CREATE DEFINER=`admin`@`%` TRIGGER `a_rating_insert` AFTER INSERT ON `Rating` FOR EACH ROW BEGIN
		DECLARE avg_rating FLOAT(32);
	SELECT AVG(r.number_rating) INTO avg_rating FROM Rating r 
		WHERE r.fk_board_game_id = NEW.fk_board_game_id;
	UPDATE BoardGame bg SET bg.store_page_rating = avg_rating
		WHERE bg.id = NEW.fk_board_game_id; 
END;

CREATE DEFINER=`admin`@`%` TRIGGER `a_rating_update` AFTER UPDATE ON `Rating` FOR EACH ROW BEGIN
	DECLARE avg_rating FLOAT(32);
	SELECT AVG(r.number_rating) INTO avg_rating FROM Rating r 
		WHERE r.fk_board_game_id = NEW.fk_board_game_id;
	UPDATE BoardGame bg SET bg.store_page_rating = avg_rating
		WHERE bg.id = NEW.fk_board_game_id;

END;

CREATE DEFINER=`admin`@`%` TRIGGER `a_return` AFTER INSERT ON `BG_Return` FOR EACH ROW BEGIN
	DECLARE game_price DECIMAL(5,2);
	DECLARE acc_email VARCHAR(255);
	SELECT bg.price INTO game_price
		FROM TransLines tl JOIN BoardGame bg ON tl.fk_board_game_id = bg.id
		WHERE tl.fk_transaction_id = NEW.fk_transaction_id
			AND tl.fk_board_game_id = NEW.fk_board_game_id;
	SELECT t.fk_account_email INTO acc_email 
		FROM TransLines tl JOIN BG_Transaction t ON t.id = tl.fk_transaction_id
		WHERE tl.fk_transaction_id = NEW.fk_transaction_id
			AND tl.fk_board_game_id = NEW.fk_board_game_id;
	UPDATE Account a SET a.funds = a.funds + (game_price * NEW.quantity)
		WHERE a.email = acc_email;
END;

CREATE DEFINER=`admin`@`%` TRIGGER `a_trans_lines` AFTER INSERT ON `TransLines` FOR EACH ROW BEGIN
	DECLARE acc_email varchar(255);
	DECLARE game_price DECIMAL(5,2);
		SELECT b.price INTO game_price 
	FROM BoardGame b WHERE b.id = NEW.fk_board_game_id;	
	SELECT t.fk_account_email INTO acc_email 
	FROM BG_Transaction t WHERE t.id = NEW.fk_transaction_id;
	UPDATE Account a
		SET a.funds = a.funds - (NEW.quantity * game_price)
		WHERE email = acc_email;
	UPDATE BG_Transaction t SET t.total = t.total + (NEW.quantity * game_price)
		WHERE t.id = NEW.fk_transaction_id;

END;

CREATE DEFINER=`admin`@`%` TRIGGER `b_fund_record` BEFORE INSERT ON `FundRecord` FOR EACH ROW BEGIN
	IF NEW.amount <= 0 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid amount: can only add money to account.';
	END IF;
END;

CREATE DEFINER=`admin`@`%` TRIGGER `b_rating` BEFORE UPDATE ON `Rating` FOR EACH ROW BEGIN
	IF NEW.number_rating < 1 OR NEW.number_rating > 10 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid rating: rating must be [1,10].';
	END IF;
END;

CREATE DEFINER=`admin`@`%` TRIGGER `b_rating_insert` BEFORE INSERT ON `Rating` FOR EACH ROW BEGIN
	IF NEW.number_rating < 1 OR NEW.number_rating > 10 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid rating: rating must be [1,10].';
	END IF;	
END;

CREATE DEFINER=`admin`@`%` TRIGGER `b_return` BEFORE INSERT ON `BG_Return` FOR EACH ROW BEGIN
	DECLARE qnt_returned int;
	DECLARE qnt_purchased int;
	DECLARE purchase_date DATETIME;
	SELECT IFNULL(SUM(r.quantity), 0) INTO qnt_returned FROM BG_Return r
		WHERE r.fk_transaction_id = NEW.fk_transaction_id AND r.fk_board_game_id = NEW.fk_board_game_id;
	SELECT tl.quantity, t.date_time
		INTO qnt_purchased, purchase_date
		FROM TransLines tl JOIN BG_Transaction t ON t.id = tl.fk_transaction_id
		WHERE tl.fk_transaction_id = NEW.fk_transaction_id
			AND tl.fk_board_game_id = NEW.fk_board_game_id;
	IF (qnt_purchased - qnt_returned) < NEW.quantity THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid quantity: you can’t return more than you’ve bought - what you’ve returned.';
	END IF;
	IF DATEDIFF(NOW(), purchase_date) > 30 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid time: 30 days have passed since purchase';
	END IF;

END;

CREATE DEFINER=`admin`@`%` TRIGGER `b_trans_lines` BEFORE INSERT ON `TransLines` FOR EACH ROW BEGIN
	DECLARE account_funds DECIMAL(7,2);
	DECLARE GAME_PRICE DECIMAL(5,2); 
	SELECT a.funds INTO account_funds
		FROM BG_Transaction t JOIN Account a ON t.fk_account_email = a.email
		WHERE t.id = NEW.fk_transaction_id;
	SELECT b.price into game_price
		FROM BoardGame b WHERE b.id = NEW.fk_board_game_id;
	IF NEW.quantity <= 0 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'INVALID ACCOUNT FUNDS: BOARD GAME COSTS MORE THAN ACCOUNT FUNDS';
	END IF;
END;
