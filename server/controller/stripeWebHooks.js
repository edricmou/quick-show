import stripe from 'stripe';
import Booking from '../models/Booking.js';
import { inngest } from '../inngest/index.js';

const stripeWebHooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOKS_KEY);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // 获取当前用户session
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      // 从session中获取元数据
      const session = sessionList.data[0];
      const { bookingId } = session.metadata;
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
      });

      // 发送订单确认邮件
      await inngest.send({
        name: 'app/show.booked',
        data: { bookingId }
      })
      break;
    default:
      break;
  }

  res.json({ received: true });
};

export default stripeWebHooks;
