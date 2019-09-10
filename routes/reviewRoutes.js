const express = require('express');

const { protect, restrictTo } = require('../controllers/authController');
const { createReview, getAllReviews, getReview } = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), createReview);

router.route('/:id').get(protect, getReview);

module.exports = router;
