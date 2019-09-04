const { promisify } = require('util');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm, passwordChangedAt });
  const token = signToken(newUser._id);

  res.status(201).send({
    status: 'success',
    token,
    data: { user: newUser }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide an email and password!'), 400);
  }
  // Check if user exeists && password corresct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if it's therefore
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('You are not logged in! Please log in to get acces.', 401));
  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // If check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('The user belonging to this token no longer exists.', 401));
  // If user chanjed password after the token was issued
  if (await currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError('User changed password! Please log in again.', 401));

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // role: ['admin', 'lead-guide']
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to perform this action.', 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it to user's email
});

exports.resetPassword = (req, res, next) => {};
