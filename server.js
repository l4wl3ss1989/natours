const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXEPTION: 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config/config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    //console.log(con.connections);
    console.log('DB connection succesfull!');
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// SAFTY NET ONLY

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION: 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
