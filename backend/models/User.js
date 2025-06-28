import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  descriptors: [[Number]], // array of float arrays
});

const User = mongoose.model('User', UserSchema);
export default User;
