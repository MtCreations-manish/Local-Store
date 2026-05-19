CREATE DATABASE IF NOT EXISTS localstore_platform;
USE localstore_platform;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  resetToken VARCHAR(255),
  resetTokenExpiresAt DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_users_email (email)
);

CREATE TABLE themes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  `key` VARCHAR(80) NOT NULL UNIQUE,
  category ENUM('shopping','grocery','all') DEFAULT 'all',
  previewImage VARCHAR(255),
  description TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE stores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId INT UNSIGNED NOT NULL,
  themeId INT UNSIGNED,
  name VARCHAR(140) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description TEXT,
  logoUrl VARCHAR(255),
  bannerUrl VARCHAR(255),
  category ENUM('shopping','grocery') NOT NULL,
  colorPalette JSON,
  sectionOrder JSON,
  hiddenSections JSON,
  whatsappNumber VARCHAR(32),
  email VARCHAR(160),
  address TEXT,
  instagramLink VARCHAR(255),
  facebookLink VARCHAR(255),
  youtubeLink VARCHAR(255),
  upiId VARCHAR(120),
  paymentQrUrl VARCHAR(255),
  codEnabled BOOLEAN DEFAULT TRUE,
  upiEnabled BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_stores_user (userId),
  INDEX idx_stores_category (category),
  CONSTRAINT fk_stores_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_stores_theme FOREIGN KEY (themeId) REFERENCES themes(id) ON DELETE SET NULL
);

CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  storeId INT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discountPrice DECIMAL(10,2),
  category VARCHAR(100),
  availability BOOLEAN DEFAULT TRUE,
  quantity INT UNSIGNED DEFAULT 0,
  sku VARCHAR(80),
  featured BOOLEAN DEFAULT FALSE,
  tags JSON,
  weight VARCHAR(60),
  expiryDate DATE,
  unit VARCHAR(40),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY uq_products_store_slug (storeId, slug),
  INDEX idx_products_store (storeId),
  INDEX idx_products_category (category),
  INDEX idx_products_featured (featured),
  FULLTEXT INDEX ft_products_name (name),
  CONSTRAINT fk_products_store FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  productId INT UNSIGNED NOT NULL,
  url VARCHAR(255) NOT NULL,
  publicId VARCHAR(255),
  sortOrder INT UNSIGNED DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_product_images_product (productId),
  CONSTRAINT fk_product_images_product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE store_sections (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  storeId INT UNSIGNED NOT NULL,
  sectionKey VARCHAR(60) NOT NULL,
  title VARCHAR(140),
  content TEXT,
  visible BOOLEAN DEFAULT TRUE,
  sortOrder INT UNSIGNED DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_store_sections_store_key (storeId, sectionKey),
  CONSTRAINT fk_store_sections_store FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE TABLE social_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  storeId INT UNSIGNED NOT NULL,
  platform ENUM('instagram','facebook','youtube','website') NOT NULL,
  url VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_social_links_store (storeId),
  CONSTRAINT fk_social_links_store FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE
);
