# Interview Booking Backend API

A robust, scalable Node.js backend API for the Interview Booking platform, built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user CRUD operations with profile management
- **Session Booking**: Interview session scheduling and management
- **Mentor System**: Mentor profiles, availability, and rating system
- **Real-time Communication**: Socket.io integration for live updates
- **Comprehensive Validation**: Input validation with express-validator
- **Error Handling**: Centralized error handling with detailed logging
- **Rate Limiting**: API rate limiting for security
- **Security**: Helmet.js for security headers, CORS configuration

## 🏗️ Architecture

```
src/
├── config/          # Configuration files (database, environment)
├── middleware/      # Custom middleware (auth, error handling)
├── models/          # Mongoose data models
├── routes/          # API route handlers
├── services/        # Business logic services
├── utils/           # Utility functions (validation, responses)
└── index.ts         # Main application entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet.js, bcryptjs
- **Real-time**: Socket.io
- **Logging**: Morgan
- **Rate Limiting**: express-rate-limit

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/interview-booking
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🚀 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| POST | `/refresh` | Refresh JWT token | Private |
| POST | `/logout` | User logout | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| GET | `/` | Get all users (Admin) | Admin |

### Sessions (`/api/sessions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/available` | Get available sessions | Public |
| POST | `/book` | Book a session | Private |
| GET | `/user` | Get user sessions | Private |

### Mentors (`/api/mentors`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all mentors | Public |
| GET | `/:id` | Get mentor profile | Public |
| GET | `/:id/availability` | Get mentor availability | Public |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **candidate**: Can book interview sessions
- **mentor**: Can offer interview sessions
- **admin**: Full system access

## 📝 Validation

Input validation is handled using express-validator with custom validation schemas:

- **User Input**: Name, email, password, role validation
- **Session Data**: Date, time, duration validation
- **Profile Updates**: Bio, skills, experience validation

## 🚨 Error Handling

The API provides consistent error responses with appropriate HTTP status codes:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "param": "fieldName",
      "msg": "Validation message"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Configurable expiration and secret
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Sanitization**: XSS protection

## 🧪 Development

### Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Code Structure

- **Utils**: Reusable validation and response functions
- **Middleware**: Authentication and error handling
- **Models**: Mongoose schemas with TypeScript interfaces
- **Routes**: RESTful API endpoints
- **Services**: Business logic separation

## 📈 Scalability Features

- **Modular Architecture**: Easy to extend and maintain
- **Validation Schemas**: Reusable validation rules
- **Response Utilities**: Consistent API responses
- **Error Handling**: Centralized error management
- **Async Operations**: Proper async/await patterns
- **Database Indexing**: Optimized queries

## 🚀 Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Build

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Implement proper error handling
4. Add validation for new endpoints
5. Update documentation
6. Test thoroughly

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the project documentation or create an issue in the repository.
