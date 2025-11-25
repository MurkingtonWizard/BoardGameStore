export interface ITransaction {
    id: number,
    date_time: string,
    total: number,
    items: ITransactionItem[]
}

export interface ITransactionItem {
    id: number,
    name: string,
    price: number,
    quantity: number,
    returned_quantity: number,
}

/*
id int,
	fk_account_email varchar(255) NOT NULL,
	date_time datetime,
	total DECIMAL(5,2),
	FOREIGN KEY (fk_account_email ) REFERENCES Account(email),
	PRIMARY KEY (id)


*/
