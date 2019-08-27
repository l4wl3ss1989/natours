const express = require('express');
const morgan = require('morgan');

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
// app.use((req, res, next) => {
//   console.log('Middleware');
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // Save as a file *.
  next();
});

// ROUTES
const version = 'v1';
app.use(`/api/${version}/tours`, tourRouter);
app.use(`/api/${version}/users`, userRouter);

module.exports = app;
