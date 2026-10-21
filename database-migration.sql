-- BACK UP your studentswap database before running this script.
-- Run the entire script once in MySQL Workbench on your local MySQL80 server.
CREATE DATABASE IF NOT EXISTS studentswap;
USE studentswap;

CREATE TABLE IF NOT EXISTS app_users (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 created_at DATETIME(6) NOT NULL
);
CREATE TABLE IF NOT EXISTS user_sessions (
 token_hash VARCHAR(64) NOT NULL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 expires_at DATETIME(6) NOT NULL,
 INDEX idx_session_user (user_id),
 CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS listing_owners (
 listing_id BIGINT NOT NULL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 INDEX idx_listing_owner_user (user_id),
 CONSTRAINT fk_listing_owner_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
 CONSTRAINT fk_listing_owner_listing FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS buyer_messages (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 listing_id BIGINT NOT NULL,
 buyer_id BIGINT NOT NULL,
 seller_id BIGINT NOT NULL,
 message VARCHAR(1000) NOT NULL,
 created_at DATETIME(6) NOT NULL,
 INDEX idx_messages_seller (seller_id),
 INDEX idx_messages_buyer (buyer_id),
 CONSTRAINT fk_message_buyer FOREIGN KEY (buyer_id) REFERENCES app_users(id) ON DELETE CASCADE,
 CONSTRAINT fk_message_seller FOREIGN KEY (seller_id) REFERENCES app_users(id) ON DELETE CASCADE,
 CONSTRAINT fk_message_listing FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

-- The existing listings.seller_id still references the original students table.
-- New accounts have independent IDs in app_users and ownership in listing_owners.
-- The app temporarily uses the existing legacy student with student_id=1 for the
-- old required listings.seller_id field. Confirm it exists before creating listings:
SELECT * FROM students WHERE student_id = 1;
-- If this returns no rows, create a legacy student with ID 1 using your original
-- students table schema before testing listing creation.
