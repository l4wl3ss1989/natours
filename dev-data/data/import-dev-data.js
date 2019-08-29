// const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config/config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const tours = require('./tours-simple.json');

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

// READ JSON file => SWAP to easier aproach
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

// IMPORT DATA INTO DATA base
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data succesfull loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION TOURS
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data succesfull deletet');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// console.log(process.argv);
