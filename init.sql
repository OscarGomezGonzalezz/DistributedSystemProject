USE database1;
DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
    order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    isin VARCHAR(12) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    state INT DEFAULT 0,
    CONSTRAINT chk_state CHECK (state IN (0, 1, 2,3))
);