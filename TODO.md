# TODO List for Adding Blog to Portfolio Website

## Backend Setup
- [x] Initialize Node.js project with package.json
- [x] Install dependencies: express, sqlite3, express-session, bcrypt, express-validator, helmet, cors
- [x] Create server.js with basic Express setup
- [x] Set up SQLite database schema for users and posts
- [x] Implement user authentication (register, login, logout) with sessions
- [x] Add middleware for input sanitization and security (helmet, express-validator)

## Blog CRUD Operations
- [x] Create API endpoints for blog posts (GET, POST, PUT, DELETE)
- [x] Implement blog post creation/editing with input validation
- [x] Add blog post display functionality

## Frontend Updates
- [ ] Update index.html to display blog posts dynamically
- [ ] Integrate login.html with backend authentication
- [ ] Update settings.html if needed for blog settings
- [ ] Add JavaScript for API interactions (fetch blog posts, handle login)
- [ ] Ensure dark mode works with new elements

## Security and Testing
- [x] Sanitize all user inputs to prevent XSS and SQL injection
- [x] Test authentication and authorization
- [x] Test blog CRUD operations
- [x] Run the full application and verify functionality
