import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from './inngest/index.js';
import showRouter from './routes/showRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import adminRouter from './routes/adminRouter.js';
import userRouter from './routes/userRouter.js';
import stripeWebHooks from './controller/stripeWebHooks.js';

const app = express();
const port = 3000;

// 连接MongoDB
await connectDB();

// 必须要放在express.json()前面，express.raw将请求体的内容保留为二进制的buffer类型，确保Stripe 签名验证能正常执行
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks);

// 中间件
app.use(express.json());
app.use(cors());
// clerk认证
app.use(clerkMiddleware());
// inngest
app.use('/api/inngest', serve({ client: inngest, functions }));

// express路由
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);


// router路由
app.get('/', (req, res) => res.send('Server is Live!'));

// 监听
app.listen(port, () => console.log(`Listening on port ${port}`));
