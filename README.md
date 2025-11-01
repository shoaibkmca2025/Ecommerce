# Cherish India E-commerce Platform

A full-stack e-commerce application built with React and Node.js, featuring authentic Indian handcrafted products.

## Features

### Frontend
- Modern React application with Framer Motion animations
- Responsive design with mobile-first approach
- Product catalog with filtering and search
- Shopping cart functionality
- User authentication and registration
- Product detail pages
- Checkout process
- Error handling and loading states

### Backend
- RESTful API built with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- Password hashing with bcrypt
- CORS enabled for cross-origin requests
- Input validation and error handling
- Admin routes for product management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/cherish-india
JWT_SECRET=your_jwt_secret_key_here_change_in_production
CLIENT_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
├── backend/
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/
│   │   ├── Product.js       # Product model
│   │   └── User.js          # User model
│   ├── routes/
│   │   ├── productRoutes.js # Product routes
│   │   └── userRoutes.js    # User routes
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── images/          # Static images
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── config/          # Configuration files
│   └── package.json
└── README.md
```

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Framer Motion
- Axios
- React Icons
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- Morgan

## Development

### Running in Development Mode

1. Start MongoDB service
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm start`

### Building for Production

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Start backend in production:
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@cherishindia.com or create an issue in the repository.


