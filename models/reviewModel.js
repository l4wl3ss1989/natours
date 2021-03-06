const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewShema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty.']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// QUERY MIDDLEWARES
reviewShema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: '-guides name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewShema.statics.calcAvarageRatings = async function(tourId) {
  // this -> current Model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  // Default review status
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
};

reviewShema.index({ tour: 1, user: 1 }, { unique: true });

reviewShema.post('save', function() {
  // this points to current review.
  this.constructor.calcAvarageRatings(this.tour);
});

reviewShema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewShema.post(/^findOneAnd/, async function() {
  // await findOne does NOT work here because query has already executed.
  await this.r.constructor.calcAvarageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;
