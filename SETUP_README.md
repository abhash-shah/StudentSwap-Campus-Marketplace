# StudentSwap — updated project

## Important: database setup (one time)
1. Back up your existing MySQL `studentswap` database in MySQL Workbench.
2. Open `database-migration.sql` in MySQL Workbench, select your MySQL80 connection, and execute the script **once**. It creates `app_users`, `user_sessions`, `listing_owners`, and `buyer_messages` without deleting your original categories, students, listings, or contact requests.
3. The SQL script checks that `students.student_id=1` exists. **New listings require this legacy student** because your original `listings.seller_id` foreign key still references the original `students` table. Student account ownership is securely tracked separately in `listing_owners`.
4. If the `students` table has no student ID 1, you'll need to add a suitable legacy row to the original `students` table first, using its existing required columns. This project does not assume or overwrite that schema.

## Run on Windows
- Requirements: MySQL80 running, Java 21, Node.js, and internet for initial Maven/npm dependencies.
- Double-click `START_STUDENTSWAP.bat`. Enter your **existing** MySQL root password and an admin password when prompted. It opens separate backend/frontend command windows.
- If the launcher cannot start Maven, use `studentswap-backend\\mvnw.cmd spring-boot:run` from Command Prompt after setting the environment variables `DB_PASSWORD` and `ADMIN_PASSWORD`.
- Open http://localhost:5175. Backend API: http://localhost:8080/api/health.
- Do **not** expose this local demo directly to the public internet. Configure HTTPS, CSRF protection, secure session cookies, rate limiting, email verification, and hosted image storage before production deployment.

## Features
- Student registration/login with BCrypt-hashed passwords, seven-day random bearer sessions (only hashed session tokens in MySQL), logout, account deletion.
- Every new listing is linked to the logged-in account in `listing_owners`; edit/delete authorization enforced on backend. Admin can moderate any listing.
- Buyer-to-seller messages saved in `buyer_messages`, inbox includes sender email so sellers can reply externally. Messaging requires login.
- Image upload on listing creation; images stored in backend `uploads/` folder. Existing images preserved.
- Admin login and contact requests remain available.

## Notes and limitations
- **Existing listings** were created before accounts existed. They have no ownership mapping, so admin can manage them, but no new student can claim them automatically.
- Account deletion permanently deletes the student's listings and related messages. Take backups first.
- The app uses the original `listings.seller_id` compatibility value `1`; actual owner ID is stored in `listing_owners`. Do not remove this mapping table.
- The application was statically inspected and JSX syntax checked in the delivery environment, but end-to-end MySQL/Spring Boot startup could not be verified against your local Windows database. Test the signup → listing → messaging → ownership flow on your machine.
- Credentials are not bundled. Set them through the launcher. The app uses localStorage for student bearer tokens; for production use, switch to secure HttpOnly cookies with CSRF protection.
- The previous admin password and database password were removed from the distributed `application.properties` file. Change any previously shared passwords.
