import User from '../models/User.js';
export const register = async (req, res) => {
  const { name, descriptors } = req.body;
  const user = new User({ name, descriptors });
  await user.save();
  res.json({ message: 'User registered successfully' });
};

export const login = async (req, res) => {
  const { descriptors } = req.body;
  const users = await User.find();

  let minDistance = Infinity;
  let matchedUser = null;

  for (const user of users) {
    for (const desc of user.descriptors) {
      const distance = euclideanDistance(desc, descriptors[0]);
      if (distance < 0.5 && distance < minDistance) {
        minDistance = distance;
        matchedUser = user;
      }
    }
  }

  if (matchedUser) {
    res.json({ success: true, user: matchedUser });
  } else {
    res.json({ success: false });
  }
};

// Euclidean distance
function euclideanDistance(d1, d2) {
  return Math.sqrt(d1.reduce((sum, val, i) => sum + Math.pow(val - d2[i], 2), 0));
}
