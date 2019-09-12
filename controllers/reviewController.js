const Review = require('../models/reviewModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id; // protect request
  next();
};

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
