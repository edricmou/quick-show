import Show from '../models/Show.js';
import { inngest } from '../inngest/index.js';
import Booking from '../models/Booking.js';
import stripe from 'stripe';
import show from '../models/Show.js';

const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);

    if (!showData) {
      return false;
    }

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const auth = req.auth();
    const { origin } = req.headers;

    if (!auth || !auth.userId) {
      return res.json({ success: false, message: 'Please login' });
    }

    const userId = auth.userId;

    const { showId, selectedSeats } = req.body;

    // Check if the seat is available for the selected show
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: 'Selected Seats are not available.',
      });
    }

    // Get the show details
    const showData = await Show.findById(showId).populate('movie');
    console.log(showData);
    // Create a new booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified('occupiedSeats');
    console.log(showData);

    await showData.save();

    // 创建stripe实例
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // 设置支付信息
    const line_items = [
      {
        price_data: {
          currency: 'USD',
          product_data: {
            name: showData.movie.title,
          },
          unit_amount: Math.floor(booking.amount) * 100,
        },
        quantity: 1,
      },
    ];

    // 使用api创建支付请求
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items,
      mode: 'payment',
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // 获取stripe支付链接
    booking.paymentLink = session.url;

    // 将stripe支付链接保存到db
    await booking.save();

    // 三分钟后检查是否支付，如果没有支付则释放座位
    inngest.send({
      name:'app/checkpayment',
      data: {
        bookingId: booking._id.toString(),
      }
    })

    res.json({ success: true, message: 'Booking successfully.', url: booking.paymentLink });
    // res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, result: occupiedSeats });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
