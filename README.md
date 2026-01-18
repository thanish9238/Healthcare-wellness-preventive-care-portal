# Healthcare Wellness Preventive Care Portal — Backend

Node.js/Express REST API with MongoDB for healthcare user and provider authentication, profile management, and medical record storage. Features JWT-based authentication with secure HTTP-only cookies.

## Stack
- **Node.js** 18+
- **Express** 5
- **MongoDB** with Mongoose 9
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **Validation**: express-validator
- **Additional**: uuid, cookie-parser, dotenv, body-parser, cors

## Features
✅ JWT-based authentication with HTTP-only cookies  
✅ Secure password hashing with bcrypt  
✅ Token blacklisting on logout  
✅ Role-based access (User/Provider)  
✅ Input validation on all routes  
✅ Protected profile endpoints  
✅ MongoDB database integration  
✅ Medical records and allergy tracking  

## Quick Start
1. **Install dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment**
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   DB_CONNECT=mongodb://localhost:27017/healthcare
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

3. **Start the server**
   ```bash
   node server.js
   ```
   Server runs on `http://localhost:3000`

## Project Structure
```
Backend/
├── app.js                      # Express app configuration
├── server.js                   # Server entry point
├── package.json
├── Controllers/
│   ├── User.controller.js      # User auth & CRUD with cookie management
│   └── Provider.controller.js  # Provider auth & CRUD with cookie management
├── Models/
│   ├── user.model.js           # User schema with health goals
│   ├── Provider.model.js       # Provider schema
│   ├── medicalRecord.model.js  # Allergy & medication records
│   └── blackList.model.js      # JWT token blacklist
├── routers/
│   ├── User.routes.js          # User API routes with validation
│   └── Provider.routes.js      # Provider API routes with validation
├── middleware/
│   └── auth.middleware.js      # JWT authentication middleware
├── db/
│   └── db.js                   # MongoDB connection
└── Services/
    ├── User.services.js
    └── Provider.services.js
```

## API Endpoints

### User Routes (`/users`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/users/signup` | ❌ | Register new user, returns JWT + sets cookie |
| POST | `/users/login` | ❌ | Login user, returns JWT + sets cookie |
| POST | `/users/logout` | ❌ | Logout user, blacklists token + clears cookie |
| GET | `/users/profile` | ✅ | Get authenticated user's profile |
| PUT | `/users/profile` | ✅ | Update authenticated user's profile |
| DELETE | `/users/:id` | ✅ | Delete user account |

### Provider Routes (`/providers`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/providers/signup` | ❌ | Register new provider, returns JWT + sets cookie |
| POST | `/providers/login` | ❌ | Login provider, returns JWT + sets cookie |
| POST | `/providers/logout` | ❌ | Logout provider, blacklists token + clears cookie |
| GET | `/providers/profile` | ✅ | Get authenticated provider's profile |
| PUT | `/providers/profile` | ✅ | Update authenticated provider's profile |
| DELETE | `/providers/:id` | ✅ | Delete provider account |

### Request Examples

**User Signup**
```bash
POST /users/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "consent": true
}
```

**Provider Login**
```bash
POST /providers/login
Content-Type: application/json

{
  "email": "provider@example.com",
  "password": "securepass123"
}
```

**Get Profile (with JWT cookie)**
```bash
GET /users/profile
Cookie: token=<jwt-token>
# OR
Authorization: Bearer <jwt-token>
```

## Authentication Flow

1. **Signup/Login**: Generates JWT token → Sets HTTP-only cookie → Returns token in response
2. **Protected Routes**: Middleware checks cookie or Authorization header → Validates JWT → Verifies not blacklisted
3. **Logout**: Adds token to blacklist → Clears cookie → Auto-expires after 1 hour

## Cookie Configuration
- **HTTP-only**: Prevents XSS attacks
- **Secure**: HTTPS-only in production
- **Max Age**: 24 hours
- **SameSite**: Recommended to add for CSRF protection

## Data Models

### User Schema
- Name (firstName, lastName)
- Email (unique)
- Password (bcrypt hashed)
- Age, Gender
- Allergies (array of medical records)
- Consent (required)
- Health Goals (steps, sleep, water intake)

### Provider Schema
- Name (firstName, lastName)
- Email (unique)
- Password (bcrypt hashed)
- Patients (array of user references)

### Medical Record Schema
- Allergy
- Medication
- Timestamps

### BlackList Schema
- Token (JWT string)
- Auto-expires after 1 hour

## Security Features
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens signed with secret key
- ✅ HTTP-only cookies prevent XSS
- ✅ Token blacklisting on logout
- ✅ Input validation with express-validator
- ✅ Protected routes with auth middleware
- ✅ Secure flag for production

## Environment Variables
```env
PORT=3000                                    # Server port
DB_CONNECT=mongodb://localhost:27017/healthcare  # MongoDB connection string
JWT_SECRET=your-super-secret-jwt-key-here   # JWT signing key (change this!)
NODE_ENV=development                         # development | production
```

## Next Steps / TODO
- [ ] Add refresh token mechanism
- [ ] Implement rate limiting
- [ ] Add CORS configuration for specific origins
- [ ] Set up email verification
- [ ] Add password reset functionality
- [ ] Implement role-based permissions
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up logging (Winston/Morgan)
- [ ] Add unit and integration tests
- [ ] Configure SameSite cookie attribute

## Dependencies
```json
{
  "bcrypt": "^6.0.0",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.1.4",
  "uuid": "^13.0.0",
  "express-validator": "^7.x",
  "cookie-parser": "^1.x",
  "dotenv": "^16.x",
  "body-parser": "^1.x",
  "cors": "^2.x"
}
```

## Installation of Missing Dependencies
If you encounter missing package errors, install them:
```bash
npm install express-validator cookie-parser dotenv body-parser cors
```

## Development

**Run in development mode:**
```bash
node server.js
```

**Recommended: Use nodemon for auto-reload:**
```bash
npm install -g nodemon
nodemon server.js
```

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running: `mongod`
- Check `DB_CONNECT` URL in `.env`
- Verify MongoDB service is active

**JWT Errors:**
- Set `JWT_SECRET` in `.env`
- Check token format in requests
- Verify token hasn't expired or been blacklisted

**Cookie Not Set:**
- Install `cookie-parser`: `npm install cookie-parser`
- Verify `app.use(cookieparser())` in `app.js`
- Check browser allows cookies

**Validation Errors:**
- Install `express-validator`: `npm install express-validator`
- Check request body matches schema requirements

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
ISC