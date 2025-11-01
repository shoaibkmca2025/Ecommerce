# Cherish India E-commerce Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd Ecommerse
npm run install:all
```

2. **Environment Setup**

Create `.env` in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/cherish-india
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:3000
```

Create `.env` in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Database Setup**
```bash
npm run seed:backend
```

4. **Start Application**
```bash
npm start
```

## Project Structure

```
Ecommerse/
├── backend/                 # Express.js API
│   ├── middleware/         # Auth & security middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   └── services/      # API services
│   └── public/            # Static assets
└── README.md
```

## Features Implemented

### Backend
✅ RESTful API with Express.js
✅ MongoDB integration with Mongoose
✅ JWT authentication
✅ Password hashing with bcrypt
✅ CORS configuration
✅ Input validation
✅ Error handling middleware
✅ Product CRUD operations
✅ User authentication & authorization
✅ Admin routes protection

### Frontend
✅ Modern React with hooks
✅ Responsive design
✅ Framer Motion animations
✅ Product catalog with filtering
✅ Shopping cart functionality
✅ User authentication
✅ Product detail pages
✅ Admin product management
✅ Error boundaries
✅ Loading states

### Security
✅ JWT token validation
✅ Password hashing
✅ CORS protection
✅ Input sanitization
✅ Error message sanitization

## Available Scripts

- `npm start` - Start both servers
- `npm run dev` - Development mode
- `npm run install:all` - Install all dependencies
- `npm run start:backend` - Backend only
- `npm run start:frontend` - Frontend only
- `npm run seed:backend` - Seed database

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **Port Already in Use**
   - Change PORT in backend/.env
   - Update REACT_APP_API_URL in frontend/.env

3. **CORS Errors**
   - Verify CLIENT_URL in backend/.env
   - Check API_URL in frontend/.env

### Development Tips

- Use `npm run dev` for development with hot reload
- Check browser console for frontend errors
- Check terminal for backend errors
- Use MongoDB Compass to view database

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure production MongoDB URI
4. Build frontend: `cd frontend && npm run build`
5. Serve static files from backend
6. Use process manager (PM2)
7. Configure reverse proxy (Nginx)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request