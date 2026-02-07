import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: { type: String, required: true, ref: 'Movie' },
    showDateTime: { type: Date, required: true },
    showPrice: { type: Number, required: true },
    occupiedSeats: { type: Object, default: {} },
  },
  // 如果某个字段的类型是 Object/Plain Object，且值为空对象 {} ，Mongoose 会在保存文档时自动忽略这个字段
  // 加上 { minimize: false } 后, occupiedSeats: {} // 空对象被强制保存
  { minimize: false }
);

const Show = mongoose.model('Show', showSchema);

export default Show;
