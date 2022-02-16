const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  //todo => validation
  //todo => existing user by username

  const user = new User({ name, password, email });

  if (user.validateSync())
    return res.status(400).json({ msg: 'Validation Error.' });

  //hash user document's password with method defined in user model
  await user.hashPassword();

  await user.save();

  //新用户注册后就可以直接浏览private route
  const token = generateToken({ name });

  res.json({ name, token });
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ msg: 'user not found' });
  }

  res.json(user);
};

module.exports = {
  createUser,
  getUserById,
};
