const queries = {
  createDB: (db: string) => `CREATE DATABASE IF NOT EXISTS ${db}`,
  createInventory: `CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`,

  insertInventory: `INSERT INTO inventory (product_id,product_name, quantity, price) VALUES(?,?,?,?)`,
};

export default queries;
