# User Registration Application - Week 7 Assignment

## Description
A complete user registration web application built with Node.js, Express, and EJS. Features real-time form validation using jQuery and backend validation with persistent storage using JSON.

## Features
- ✅ User registration with email and password
- ✅ Frontend validation using jQuery:
  - Email format validation
  - Password requirements: minimum 6 characters, at least 1 number and 1 special character
  - Password confirmation matching
- ✅ Backend validation and storage
- ✅ Responsive Bootstrap UI
- ✅ User list display on home page
- ✅ Password hashing with SHA-256

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm

### Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Run the application:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure
```
Week 7/
├── src/
│   ├── app.js              # Express app configuration
│   ├── controllers/        # Route controllers
│   │   ├── index.js       # Home, login, register routes
│   │   └── user.js        # User registration logic
│   ├── models/            # Data models
│   │   ├── db.js          # Database operations
│   │   ├── index.js       # Model exports
│   │   ├── user.local.js  # Local (JSON) user model
│   │   └── user.mongo.js  # MongoDB user model (optional)
│   ├── views/             # EJS templates
│   │   ├── layout.ejs     # Main layout
│   │   ├── index.ejs      # Home page
│   │   ├── register.ejs   # Registration form
│   │   └── login.ejs      # Login page
│   └── public/            # Static files
│       ├── js/
│       ├── css/
│       └── bootstrap/
├── package.json
├── README.md
└── .gitignore
```

## Usage

### Registration
1. Navigate to `/register`
2. Enter your email address (must be valid email format)
3. Enter password (must have at least 6 characters, 1 number, and 1 special character like !@#$%^&*)
4. Confirm password (must match the password field)
5. Click Register

### Validation Rules
**Email:** Must be in valid email format (example@domain.com)

**Password:** Must contain:
- Minimum 6 characters
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

**Confirm Password:** Must exactly match the password field

## Validation Implementation

### Frontend (jQuery)
- Real-time validation as user types
- Visual feedback with error messages
- Form submission prevented if validation fails

### Backend (Node.js)
- Server-side validation for security
- Prevents duplicate email registrations
- Password hashing with SHA-256
- Error handling and response messages

## Database

### JSON File (Default)
Users are stored in `src/models/db.json`

### MongoDB (Optional)
To use MongoDB:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Replace `user.local` with `user.mongo` in `src/models/index.js`
3. Update connection string in environment variables

## Technologies Used
- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, Bootstrap, jQuery
- **Template Engine:** EJS
- **Database:** JSON (default) or MongoDB (optional)
- **Security:** SHA-256 password hashing

## API Endpoints
- `GET /` - Home page
- `GET /register` - Registration form
- `POST /register` - Submit registration
- `GET /login` - Login page
- `GET /users` - Get all registered users (JSON)

## Assignment Requirements Met ✅
- [x] Registration form with 3+ fields (username/email, password, confirm password)
- [x] jQuery validation for email format and password requirements
- [x] Backend validation and MongoDB/JSON database storage
- [x] Password hashing
- [x] Real-time error messages
- [x] Responsive UI with Bootstrap

## Development

To run with automatic restart on file changes:
```bash
npm install -g nodemon
npm run dev
```

## Notes
- Default database uses JSON file storage
- Users are stored with hashed passwords (SHA-256)
- Special characters allowed in passwords: !@#$%^&*
- Email addresses must be unique

## Future Enhancements
- Add login functionality with session management
- Implement JWT authentication
- Add user profile management
- Email verification
- Password reset functionality
- Admin dashboard
