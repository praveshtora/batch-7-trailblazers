import mongoose from 'mongoose';

const DashboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board', default: [] }],
});

export default mongoose.model('Dashboard', DashboardSchema);
