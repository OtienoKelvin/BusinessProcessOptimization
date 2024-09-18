CREATE DATABASE IF NOT EXISTS business_process_opt;
USE business_process_opt;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    profile_picture_url VARCHAR(255),
    role ENUM('admin', 'owner', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Businesses (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   owner_id INT,
   industry VARCHAR(255),
   location VARCHAR(255),
   website_url VARCHAR(255),
   contact_email VARCHAR(255),
   contact_phone VARCHAR(15),
   registration_date DATE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10, 2),
    sale_price DECIMAL(10, 2),
    supplier_id INT NOT NULL,
    location VARCHAR(255),
    restock_threshold INT,
    last_restock_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);


CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    inventory_id INT NOT NULL,
    transaction_type ENUM('purchase', 'sale') NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);





CREATE TABLE IF NOT EXISTS Expenses (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   expense_category VARCHAR(255) NOT NULL,
   amount DECIMAL(10, 2) NOT NULL,
   expense_date DATE NOT NULL,
   description TEXT,
   payment_method ENUM('Cash', 'Credit', 'Debit', 'Bank Transfer', 'Other'),
   receipt_url VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Employees (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   first_name VARCHAR(55) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   position VARCHAR(255),
   salary DECIMAL(10, 2),
   hire_date DATE,
   contract_type ENUM('Full-time', 'Part-time', 'Contract'),
   performance_review TEXT,
   status ENUM('Active', 'On Leave', 'Terminated') DEFAULT 'Active',
   contact_email VARCHAR(255),
   contact_phone VARCHAR(15),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OperationsData (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   operation_type VARCHAR(255) NOT NULL,
   operation_description TEXT,
   duration DECIMAL(10, 2),  -- hours or other units
   cost DECIMAL(10, 2),
   start_time DATETIME,
   end_time DATETIME,
   status ENUM('Ongoing', 'Completed', 'Delayed') DEFAULT 'Ongoing',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OptimizationRecommendations (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   recommendation TEXT,
   impact_type ENUM('Cost Reduction', 'Time Saving', 'Efficiency Boost'),
   estimated_savings DECIMAL(10, 2),
   recommendation_date DATE,
   status ENUM('Pending', 'Implemented') DEFAULT 'Pending',
   implemented_on DATE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Predictions (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   prediction_type ENUM('Inventory', 'Expense', 'HR') NOT NULL,
   predicted_value DECIMAL(10, 2),
   predicted_for_date DATE,
   accuracy DECIMAL(5, 2),  -- Prediction accuracy percentage
   generated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Reports (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   report_type ENUM('Daily', 'Weekly', 'Monthly', 'Custom') NOT NULL,
   report_content TEXT,
   report_url VARCHAR(255),  -- Link to report file if downloadable
   generated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AuditLog (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   action VARCHAR(255) NOT NULL,
   action_description TEXT,
   action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   ip_address VARCHAR(45),  -- IPv4 or IPv6 addresses
   device_info VARCHAR(255),  -- Device used for the action
   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Settings (
   id INT AUTO_INCREMENT PRIMARY KEY,
   business_id INT,
   setting_key VARCHAR(255) NOT NULL,
   setting_value TEXT NOT NULL,
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);
