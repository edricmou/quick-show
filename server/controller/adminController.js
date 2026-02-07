import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';

// API to check if user is an admin
export const isAdmin = async (req, res) => {
  res.json({ success: true, result: true });
};

export const getDashBoardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });

    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    return res.json({ success: true, result: dashboardData });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: -1 });

    return res.json({ success: true, result: shows });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, result: bookings });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};
