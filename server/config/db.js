import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => console.log('Mongo Database Connected'))
    .catch((err) => console.log(err.message));
};

export default connectDB;
