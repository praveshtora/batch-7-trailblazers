import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: 'created_at' } });

function preprocess(next) {
  const { email, password } = this;
  this.email = email.toLowerCase();
  const salt = bcrypt.genSaltSync();
  this.password = bcrypt.hashSync(password, salt);
  next();
}
UserSchema.pre('save', preprocess);
UserSchema.methods.validatePassword = password => bcrypt.compareSync(password, this.password);

export default mongoose.model('User', UserSchema);
