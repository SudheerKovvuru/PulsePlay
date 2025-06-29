import User from '../models/User.js';

export const register = async (req, res) => {
  const { name, descriptors } = req.body;
  let user = await User.findOne({ name });

  if (!user) {
    user = new User({ name, descriptors });
  } else {
    user.descriptors.push(...descriptors);
  }

  await user.save();
  res.json({ message: 'User registered successfully' });
};

export const login = async (req, res) => {
  const users = await User.find();
  res.json({ users });
};