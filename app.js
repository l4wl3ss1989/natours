const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitaize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limitier = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limitier);

// Middleware modifies the incoming requests data. BODY PARSER
app.use(express.json({ limit: '10kb' }));

// Data sanitization against noSQL query injection
app.use(mongoSanitaize()); //Filter $ and .

// Data sanitization against XSS
app.use(xss()); //HTML atached js code

// Prevent parameter pollution (duplicated fields)
app.use(
  hpp({
    witheList: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // IMPLEMENT: Save requests to a file * .
  // console.log(req.headers);
  next();
});

// ROUTES
const version = 'v1';
app.use(`/api/${version}/tours`, tourRouter);
app.use(`/api/${version}/users`, userRouter);
app.use(`/api/${version}/reviews`, reviewRouter);
// 404 routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;

// BUG: install globally --> https://www.npmjs.com/package/win-node-env  https://www.npmjs.com/package/ndb( + npm install -g windows-build-tools)
