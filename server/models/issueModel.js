import mongoose from 'mongoose';
import autoIncrementId from './autoIncrementModel';

const IssueSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  description: { type: String },
  assignee: { type: String, default: '' },
  lifeCycle: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'created_at' } });

async function prepProcess(next) {
  const increment = autoIncrementId.bind(this, 'issueId', 'id', 1001);
  await increment();
  next();
}
IssueSchema.pre('save', prepProcess);
export default mongoose.model('Issue', IssueSchema);
