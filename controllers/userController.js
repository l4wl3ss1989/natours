const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create err if user POSTS password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password updates.', 400));

  // Update user document and filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: { updatedUser }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented'
  });
};
