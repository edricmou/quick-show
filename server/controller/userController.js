import Booking from '../models/Booking.js';
import { clerkClient } from '@clerk/express';
import Movie from '../models/Movie.js';

export const getUserBookings = async (req, res) => {
  try {
    const auth = req.auth();

    const bookings = await Booking.find({ user: auth.userId })
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });
    return res.json({ success: true, result: bookings });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, result: e.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter((item) => item !== movieId);
    }
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, result: 'Favorite movies updated' });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, result: e.message });
  }
};

// API Controller Function to Get Favorite Movies from Clerk User Metadata
export const getFavorites = async (req, res) => {
  try {
    const auth = req.auth();
    if (!auth || !auth.userId) {
      return res.json({ success: false, result: 'Please Login' });
    }
    const user = await clerkClient.users.getUser(auth.userId);
    const favorites = user.privateMetadata.favorites;

    // Getting movies from database
    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, result: movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
