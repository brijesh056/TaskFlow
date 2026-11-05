const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

// GET /api/users  (Admin) - used for the "Assign to" dropdown
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email role').sort('name');
  res.json(users);
});

module.exports = { getUsers };
