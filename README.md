# StudentSwap — Campus Marketplace

**A Student-to-Student Marketplace for Buying, Selling, and Reusing Campus Essentials**

StudentSwap is a full-stack web application designed to help college students buy, sell, and exchange used academic materials and other campus essentials. It provides a centralized platform where students can publish listings, upload product images, browse available items, contact sellers, and manage their own listings.

The application combines a React-based frontend, a Java Spring Boot backend, and a MySQL relational database to demonstrate full-stack web development, database management, authentication, REST APIs, and access control.

---

## Table of Contents

1. Project Overview
2. Problem Statement
3. Objectives
4. Key Features
5. Technology Stack
6. System Architecture
7. Project Structure
8. Database Design
9. Database Setup and SQL
10. Backend Setup
11. Frontend Setup
12. Running the Application
13. Authentication and Authorization
14. Image Uploads
15. API Overview
16. Testing and Validation
17. Security Considerations
18. Troubleshooting
19. Future Enhancements
20. Conclusion

---

## 1. Project Overview

College students frequently need textbooks, laboratory equipment, calculators, electronics, and other academic essentials. Purchasing every item new can be expensive, while usable items often remain unused after a semester or academic year.

StudentSwap addresses this problem by providing a digital marketplace for student communities. Students can list pre-owned items, browse available products, view item details, and contact sellers. Listing ownership and authenticated operations help prevent users from modifying listings belonging to other students.

The application also includes an administrative interface for managing submitted contact requests.

## 2. Problem Statement

Students often lack a convenient and affordable way to purchase second-hand academic materials from other students on campus. Existing general-purpose marketplaces may not focus on college communities or provide a simple student-oriented experience.

StudentSwap aims to make campus exchanges more accessible, organized, and economical.

## 3. Objectives

- Develop a responsive web-based campus marketplace.
- Enable student registration and login.
- Allow students to create, view, edit, and delete their own listings.
- Support product images and item descriptions.
- Store application data in a MySQL database.
- Implement RESTful APIs using Spring Boot.
- Enforce authentication and role-based access control.
- Support communication between buyers and sellers.
- Provide an administrative interface for contact-request management.
- Encourage reuse and reduce unnecessary spending on campus essentials.

## 4. Key Features

### Student Features

- Student account registration and login.
- Browse marketplace listings.
- Search and filter available products.
- View product details, prices, and condition.
- Create listings with titles, descriptions, prices, categories, and images.
- Edit and delete listings according to ownership permissions.
- Contact sellers or submit contact requests.
- Manage account-related activities supported by the application.

### Marketplace Features

- Product listings stored in MySQL.
- Category-based organization.
- Product availability status.
- Product image uploads.
- Listing ownership tracking.
- Input validation for important listing fields.
- Persistent database storage.

### Administrator Features

- Separate administrator login.
- Protected administrative endpoints.
- View pending contact requests.
- Refresh the request list.
- Delete individual contact requests.

### Technical Features

- React frontend powered by Vite.
- Spring Boot REST API.
- MySQL relational database.
- Spring Data JPA for persistence.
- Spring Security for authentication and authorization.
- Bearer-token support for student authentication.
- CORS configuration for local frontend-backend communication.
- Server-side validation and error handling.
- Image upload restrictions for supported image formats and file sizes.

*Note: The availability of individual features depends on their implementation in the current source code and database configuration.*

## 5. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend development server | Vite |
| Frontend styling | CSS |
| Backend | Java |
| Backend framework | Spring Boot |
| API design | REST |
| Security | Spring Security |
| Persistence | Spring Data JPA / Hibernate |
| Database | MySQL |
| Database administration | MySQL Workbench |
| Build tool | Apache Maven |
| Development environment | Visual Studio Code |
| Version control support | Git |

## 6. System Architecture

StudentSwap follows a three-layer architecture.

```text
+----------------------------------+
|         Presentation Layer       |
|                                  |
|       React + Vite + CSS         |
|  Student UI / Admin UI / Forms   |
+----------------+-----------------+
                 |
                 | HTTP / REST / JSON
                 v
+----------------------------------+
|          Application Layer       |
|                                  |
|        Java + Spring Boot        |
| Controllers / Validation / APIs  |
| Authentication / Authorization   |
| Image Upload Handling            |
+----------------+-----------------+
                 |
                 | Spring Data JPA
                 v
+----------------------------------+
|             Data Layer           |
|                                  |
|             MySQL                |
| Users / Listings / Categories    |
| Ownership / Messages / Requests  |
+----------------------------------+
```

### Application Workflow

1. A student opens the React application.
2. The frontend sends HTTP requests to the Spring Boot backend.
3. Spring Security checks authentication and permissions where required.
4. Controllers validate incoming requests and process application logic.
5. Spring Data JPA communicates with MySQL.
6. The backend returns JSON responses to the frontend.
7. React updates the interface using the returned data.

## 7. Project Structure

The main project directory is organized approximately as follows:

```text
StudentSwap/
|
|-- studentswap-backend/
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/com/studentswap/backend/
|   |   |   |   |-- entity/
|   |   |   |   |-- repository/
|   |   |   |   |-- ImageUploadController.java
|   |   |   |   |-- SecurityConfig.java
|   |   |   |   |-- SessionService.java
|   |   |   |   |-- StudentswapBackendApplication.java
|   |   |   |   |-- StudentSwapController.java
|   |   |   |   |-- UploadFilesWebConfig.java
|   |   |   |
|   |   |   |-- resources/
|   |   |       |-- application.properties
|   |   |       |-- static/
|   |   |       |-- templates/
|   |   |
|   |   |-- test/
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- pom.xml
|   |
|-- StudentSwap-Frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- styles.css
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|
|-- screenshots/
|-- database-migration.sql
|-- README.md
|-- SETUP_README.md
|-- RUN_ME_FIRST.txt
|-- START_STUDENTSWAP.bat
|-- START_STUDENTSWAP_WINDOWS.bat
```

The exact files and directories may vary slightly depending on the current version of the project.

## 8. Database Design

The application uses a relational database named `studentswap`.

The current project includes tables for marketplace data, accounts, ownership, communication, and administrative requests.

| Table | Purpose |
|---|---|
| `students` | Stores student-related records used by the application. |
| `app_users` | Stores application user accounts. |
| `categories` | Organizes marketplace items into categories. |
| `listings` | Stores marketplace item information. |
| `listing_owners` | Associates listings with their owners. |
| `buyer_messages` | Stores buyer-seller communication records. |
| `contact_requests` | Stores requests submitted to the administrator. |
| `favourites` | Supports saved or favourite items, if used by the current application. |
| `user_sessions` | Supports application session or token-related functionality. |

The exact columns, primary keys, foreign keys, and constraints should be taken from the actual SQL schema exported from MySQL Workbench.

### Database Relationships

The intended relationships include:

- A category can contain multiple listings.
- A student or registered user can own multiple listings.
- A listing may have associated ownership information.
- Buyers and sellers can exchange messages where messaging is implemented.
- Users may save favourite listings where that feature is enabled.
- Contact requests are stored independently for administrative review.

Primary keys uniquely identify records, while foreign keys and application-level checks help maintain relationships between entities.

## 9. Database Setup and SQL

### Prerequisites

Install and configure:

- MySQL Server.
- MySQL Workbench.
- Java Development Kit compatible with the backend configuration.
- Node.js and npm.

### Option A: Import the exported SQL file

This is the recommended method for recreating the existing project database.

1. Open MySQL Workbench.
2. Connect to your local MySQL server.
3. Select **Server → Data Import**.
4. Choose the self-contained SQL file exported for StudentSwap.
5. Select the target schema or create the `studentswap` schema if required by the export.
6. Start the import and wait for it to finish.
7. Verify the imported tables.

If the SQL export already creates the database, follow its included database creation statements and import instructions.

### Option B: Create the database manually

If the database does not exist, run:

```sql
CREATE DATABASE IF NOT EXISTS studentswap;

USE studentswap;

SHOW TABLES;
```

**Important:** These commands create the database but do not recreate all application tables. Import the complete database export or execute the project's full schema and migration SQL before starting the backend.

### Verify the database

After importing the SQL file, run:

```sql
USE studentswap;

SHOW TABLES;

SELECT * FROM categories;
SELECT * FROM listings;
SELECT * FROM students;
SELECT * FROM app_users;
SELECT * FROM contact_requests;
```

If a table does not exist in your exported schema, omit its query or verify the actual table names using `SHOW TABLES;`.

To inspect table definitions:

```sql
SHOW CREATE TABLE categories;
SHOW CREATE TABLE listings;
SHOW CREATE TABLE students;
SHOW CREATE TABLE app_users;
SHOW CREATE TABLE listing_owners;
SHOW CREATE TABLE buyer_messages;
SHOW CREATE TABLE contact_requests;
SHOW CREATE TABLE favourites;
SHOW CREATE TABLE user_sessions;
```

These commands are useful for checking primary keys, foreign keys, column types, indexes, and constraints.

### SQL Migration File

The project includes a `database-migration.sql` file. Review it before applying it to an existing database.

A migration script may create new tables or modify existing structures. Run it against a backup or development database first, especially if it contains `ALTER TABLE`, `UPDATE`, or `DELETE` statements.

### Database Configuration

Open:

`studentswap-backend/src/main/resources/application.properties`

The relevant properties should point to the local MySQL database:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/studentswap
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
server.port=8080
```

Use the actual database settings from your working project. The example above assumes that `DB_PASSWORD` is supplied through the environment.

The Hibernate setting `validate` checks whether the existing database schema matches the entities. It does not automatically create missing tables.

Never include a real database password in a publicly submitted README or source repository.

## 10. Backend Setup

### Requirements

- Compatible JDK installed.
- MySQL Server running.
- Database imported and configured.
- Maven Wrapper included in the project.

### Run the backend

Open a terminal in the project root:

```powershell
cd studentswap-backend
```

Supply the database password for the current PowerShell session:

```powershell
$env:DB_PASSWORD = Read-Host "Enter MySQL password"
```

Then start Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Wait until the terminal reports that `StudentswapBackendApplication` has started successfully and Tomcat is running on port `8080`.

Keep this terminal open while using the website.

### Backend Address

```text
http://localhost:8080
```

## 11. Frontend Setup

### Requirements

- Node.js.
- npm.
- The `StudentSwap-Frontend` directory.

Open a separate terminal in the project root:

```powershell
cd StudentSwap-Frontend
```

Install dependencies:

```powershell
npm.cmd install
```

Start the Vite development server:

```powershell
npm.cmd run dev -- --port 5175
```

Open the frontend in your browser:

```text
http://localhost:5175
```

Keep the frontend terminal running while using the application.

## 12. Running the Complete Application

For local development, both services must be running simultaneously.

| Service | Address |
|---|---|
| React frontend | `http://localhost:5175` |
| Spring Boot backend | `http://localhost:8080` |
| MySQL server | `localhost:3306` |

### Startup Checklist

1. Start the MySQL Server service.
2. Confirm that the `studentswap` database exists.
3. Start the Spring Boot backend.
4. Wait for the successful startup message.
5. Start the React frontend in a separate terminal.
6. Open the frontend URL in your browser.
7. Test registration, login, listings, image uploads, and administrative functions.

The included Windows startup scripts may also be used if their database and administrator environment variables are configured correctly.

## 13. Authentication and Authorization

StudentSwap uses Spring Security for protected endpoints.

### Student Authentication

The backend supports student authentication through its registration and login API endpoints. The security configuration includes bearer-token authentication using the application's session service.

Authenticated requests should include the appropriate bearer token:

```http
Authorization: Bearer <access-token>
```

The frontend should use the token returned by the login endpoint for protected student operations.

### Administrator Authentication

An administrator account is configured through the backend's administrator username and password properties.

The administrator interface is intended for authorized management of contact requests and other protected administrative operations.

For local development, the credentials must match the values used by the currently running backend.

### Authorization Principles

- Public endpoints should only expose intended public information.
- Protected operations require authentication.
- Administrative endpoints require administrator authorization.
- Listing modification and deletion should enforce ownership or the appropriate administrative permission.

Authentication alone is not sufficient to establish listing ownership; the backend must verify the authenticated user's authority over the specific listing.

## 14. Image Uploads

StudentSwap supports uploading product images through its backend image-upload endpoint.

The upload controller is configured to accept supported image formats, including:

- JPEG
- PNG
- WEBP
- GIF

The current upload controller applies a maximum image size of 5 MB.

Images are stored by the backend, and the resulting image location can be associated with a listing.

For successful uploads, verify that:

- The backend upload directory is available.
- The frontend sends a multipart form request with the expected file field.
- The backend returns the correct image location.
- The listing stores the returned image location.
- The image is accessible through the configured static-resource mapping.

## 15. API Overview

The following endpoints are represented in the current project configuration. Request formats and response structures should be checked against the controller implementation.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health or status check, if exposed by the controller. |
| GET | `/api/categories` | Retrieve marketplace categories. |
| GET | `/api/listings` | Retrieve public marketplace listings. |
| POST | `/api/auth/register` | Register a student account. |
| POST | `/api/auth/login` | Authenticate a student account. |
| POST | `/api/listings` | Create a listing. |
| PUT | `/api/listings/{id}` | Update a listing, subject to authorization. |
| DELETE | `/api/listings/{id}` | Delete a listing, subject to authorization. |
| POST | `/api/upload-image` | Upload a product image. |
| POST | `/api/contact` | Submit a contact request. |
| GET | `/api/admin/contact-requests` | Retrieve administrative contact requests. |
| DELETE | `/api/admin/contact-requests/{id}` | Delete a contact request, if the endpoint is included in the current controller. |

Additional endpoints may exist for messaging, account management, favourites, or sessions. Consult `StudentSwapController.java`, the other controllers, and `SecurityConfig.java` for the exact API contract.

## 16. Testing and Validation

The following checks are recommended before demonstration or submission.

### Functional Testing

| Test | Expected Result |
|---|---|
| Open the homepage | The marketplace interface loads. |
| Retrieve categories | Categories appear without database errors. |
| Browse listings | Available items are displayed. |
| Register a student | A new account is created if valid. |
| Log in | Valid credentials authenticate the student. |
| Create a listing | A valid listing is saved to MySQL. |
| Upload an image | A supported image is uploaded successfully. |
| Edit an owned listing | The permitted changes are saved. |
| Delete an owned listing | The listing is removed or marked deleted according to implementation. |
| Submit a contact request | The request appears in the database. |
| Open the admin panel | Authorized administrators can view pending requests. |
| Delete a contact request | The selected request is removed from the database. |
| Attempt unauthorized access | Protected operations are rejected. |

### Database Verification

After creating a listing, inspect the records:

```sql
USE studentswap;

SELECT * FROM listings;
```

After submitting a contact request:

```sql
SELECT *
FROM contact_requests
ORDER BY created_at DESC;
```

After deleting a request:

```sql
SELECT *
FROM contact_requests
ORDER BY created_at DESC;
```

Verify that the deleted request no longer exists.

## 17. Security Considerations

- Do not publish real passwords or database credentials.
- Do not commit sensitive `.env` files or private configuration.
- Use strong administrator credentials.
- Validate inputs on the backend, not only in the frontend.
- Enforce listing ownership on the server for update and delete operations.
- Protect account and administrative endpoints.
- Validate uploaded files and restrict their size and type.
- Use HTTPS and appropriate production configuration when deploying.
- Avoid exposing administrator credentials in frontend JavaScript.
- Configure CORS to allow only trusted origins in production.
- Back up the MySQL database before applying schema migrations.

The included configuration is intended for local development unless it has been hardened for deployment.

## 18. Troubleshooting

### MySQL Access Denied

Check the database username, password, server status, and `DB_PASSWORD` environment variable.

### Backend Fails During Startup

Check the terminal for compilation errors, missing tables, schema validation failures, and database connection errors.

### Frontend Cannot Load Listings

Confirm that Spring Boot is running on port `8080` and inspect the browser console and network requests.

### Browser Shows an Authentication Error

Verify that the frontend is sending the required token or administrator credentials in the format expected by the relevant endpoint.

### Image Upload Fails

Check the file size, image format, multipart field name, upload directory, and static-resource configuration.

### Database Table Is Missing

Import the complete SQL export or apply the required migration before restarting the backend.

### npm Command Is Blocked in PowerShell

On Windows, use `npm.cmd` instead of `npm` if PowerShell blocks the npm script.

## 19. Future Enhancements

Possible improvements include:

- Email verification and password reset.
- Profile editing and account deletion.
- Advanced filters and sorting.
- Pagination for large marketplaces.
- Image previews and multiple product images.
- Listing moderation and report handling.
- Messaging notifications.
- Listing status updates for sold items.
- Improved transaction and pickup coordination.
- Automated unit and integration tests.
- Docker-based deployment.
- Cloud hosting and production monitoring.

These are proposed enhancements and should not be considered implemented unless they are present in the current code.

## 20. Conclusion

StudentSwap demonstrates how a student-focused marketplace can be developed using React, Java Spring Boot, Spring Security, Spring Data JPA, and MySQL.

The project combines frontend development, backend API design, relational database management, account authentication, listing management, image uploads, and administrative request handling into one application.

By enabling students to reuse academic materials and campus essentials, StudentSwap aims to support affordability, convenience, and sustainable consumption within college communities.

---

## Project Information

**Project Name:** StudentSwap — Campus Marketplace  
**Application Type:** Full-stack web application  
**Frontend:** React.js and Vite  
**Backend:** Java and Spring Boot  
**Database:** MySQL  
**Development Environment:** Visual Studio Code  
**Database Tool:** MySQL Workbench  
**Primary Purpose:** Student-to-student marketplace for campus essentials
