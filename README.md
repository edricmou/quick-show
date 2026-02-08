# Quick Show Movie Ticket Booking System

Quick Show is a full-stack movie ticket booking system that provides a user-friendly interface to browse movies, view showtimes, and book seats.

## Features

- **User Features**
  - Browse currently playing movies
  - View detailed movie information (posters, synopses, cast, etc.)
  - Select dates and times to view available screenings
  - Interactive seat selection layout
  - Personal booking management
  - Favorite movies functionality

- **Admin Features**
  - Admin dashboard
  - Add new movie showtimes
  - Manage existing shows
  - View all bookings

- **Payment Integration**
  - Stripe payment processing
  - Secure online payments

- **Authentication System**
  - Clerk authentication
  - User session management

## Tech Stack

### Frontend (Client)
- React 19.x
- React Router DOM
- TailwindCSS
- Axios
- Clerk React
- React Hot Toast
- React Player

### Backend (Server)
- Node.js
- Express 5.x
- MongoDB/Mongoose
- Clerk Express
- Stripe
- Cloudinary
- Inngest (for background job processing)
- Nodemailer

## Project Structure

```
quick-show/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context
│   │   ├── util/          # Utility functions
│   │   └── lib/           # Helper function libraries
├── server/                # Node.js backend service
│   ├── config/            # Configuration files
│   ├── controller/        # Controller logic
│   ├── middleware/        # Middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
```

## API Endpoints

### Movie Related
- `GET /api/show/now-playing` - Get currently playing movies
- `GET /api/show/all` - Get all movies
- `GET /api/show/:movieId` - Get showtimes for a specific movie

### Booking Related
- `POST /api/booking/book-seat` - Book seats
- `GET /api/booking/get-user-bookings` - Get user bookings

### Admin Related
- `POST /api/admin/add-show` - Add movie showtimes
- `GET /api/admin/list-shows` - List all shows
- `GET /api/admin/list-bookings` - List all bookings
- `GET /api/admin/is-admin` - Check admin permissions

### User Related
- `GET /api/user/favorites` - Get favorite movies
- `POST /api/user/add-to-favorite` - Add to favorites
- `POST /api/user/remove-from-favorite` - Remove from favorites

## Installation & Running

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
npm run server
```

### Environment Variables

#### Client (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

#### Server (.env)
```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
SVIX_SECRET=your_svix_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
TMDB_READ_ACCESS_TOKEN=your_tmdb_access_token
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## Deployment

The project is configured for Vercel deployment:
- Frontend: `/client/vercel.json`
- Backend: `/server/vercel.json`

## Key Feature Descriptions

1. **Movie Display**: Fetches the latest currently playing movies from TMDB API
2. **Show Management**: Admins can add movie showtimes and prices
3. **Seat Booking**: Interactive seating chart with real-time display of booked seats
4. **Payment Processing**: Secure payment handling through Stripe
5. **User Authentication**: User management and authentication using Clerk
6. **Favorites Functionality**: Users can favorite movies they like

## Contributing

Pull requests are welcome to improve the project.