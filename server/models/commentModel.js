import mongoose from 'mongoose';
import autoIncrementId from './autoIncrementModel';

const CommentSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt' } },
);

async function prepProcess(next) {
  const increment = autoIncrementId.bind(this, 'commentId', 'id');
  await increment();
  next();
}
CommentSchema.pre('save', prepProcess);
export default mongoose.model('Comment', CommentSchema);
