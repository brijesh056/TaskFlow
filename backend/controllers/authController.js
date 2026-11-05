const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sendAuth = (res, user, status = 200) =>
  res.status(status).json({
    token: signToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  // Demo project: role can be chosen at signup. In production, make everyone Member.
  const user = await User.create({ name, email, password, role: role === 'Admin' ? 'Admin' : 'Member' });
  sendAuth(res, user, 201);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  sendAuth(res, user);
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ user: { _id, name, email, role } });
});

module.exports = { register, login, getMe };
