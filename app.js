const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Middleware modifies the incoming requests data.
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
// 404 routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;

// BUG: install globally --> https://www.npmjs.com/package/win-node-env  https://www.npmjs.com/package/ndb( + npm install -g windows-build-tools)
