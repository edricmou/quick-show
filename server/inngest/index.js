import { Inngest } from 'inngest';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import sendEmail from '../config/nodeMailer.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'movie-ticket-booking' });

const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    console.log('received clerk user create messages:', event.data);
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image_url: image_url,
    };
    await User.create(userData);
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    console.log('received clerk user delete messages:', id);
    await User.findByIdAndDelete(id);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    console.log('received clerk user update messages:', event.data);
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image_url: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// 3分钟后自动释放座位和删除订单
const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: 'release-seats-and-delete-booking' },
  { event: 'app/checkpayment' },
  async ({ event, step }) => {
    const threeMinutesLater = new Date(Date.now() + 3 * 60 * 1000);
    await step.sleepUntil('wait-for-3-minutes', threeMinutesLater);
    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const bookingRecord = await Booking.findById(bookingId);
      if (!bookingRecord.isPaid) {
        const showRecord = await Show.findById(bookingRecord.show);
        bookingRecord.bookedSeats.forEach(bookedSeat => delete showRecord.occupiedSeats[bookedSeat]);
        showRecord.markModified('occupiedSeats');
        await showRecord.save();
        await Booking.findByIdAndDelete(bookingId);
        return { success: true, message: 'Booking released and deleted.' };
      } else {
        return { success: true, message: 'Booking is paid.' };
      }
    });
  },
)

// 客户支付成功发送邮件确认订单
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: 'send-booking-confirmation-email' },
  { event: 'app/show.booked' },
  async ({ event, step }) => {
    const { bookingId } = event.data;
    const bookingRecord = await Booking.findById(bookingId)
      .populate({ path: 'show', populate: { path: 'movie', model: 'Movie' } })
      .populate('user')

    await sendEmail({
      to: bookingRecord.user.email,
      subject: `Payment Confirmation: "${bookingRecord.show.movie.title}" booked!`,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hi ${bookingRecord.user.name},</h2>
        <p>Your booking for <strong style="color: #F84565;">"${bookingRecord.show.movie.title}"</strong> is confirmed.</p>
        <p>
          <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { timeZone: "Asia/Shanghai" })}<br />
          <strong>Time:</strong> ${new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Shanghai" })}
        </p>
        <p>Enjoy the show! 🍿</p>
        <p>Thanks for booking with us!<br />- QuickShow Team</P>
      </div>`,
    })
    return { success: true, message: 'Send Confirmation email successfully' };
  }
)




// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail];
