import mongoose from 'mongoose';
import autoIncrementId from './autoIncrementModel';

const { Schema } = mongoose;
const MemberSchema = new Schema({
  userId: { type: String, required: true },
  role: { type: Number },
});

const BoardSchema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lifecycles: [{ type: String }],
  issues: { type: Array, default: [] },
  members: { type: [MemberSchema], default: [] },
});

async function preProcess(next) {
  const increment = autoIncrementId.bind(this, 'boardId', 'id');
  await increment();
  next();
}
BoardSchema.pre('save', preProcess);
export default mongoose.model('Board', BoardSchema);
