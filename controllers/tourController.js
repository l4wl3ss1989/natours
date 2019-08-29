// const fs = require('fs');
const Tour = require('../models/tourModel');

// const toursFileName = `${__dirname}/../dev-data/data/tours-simple.json`;
// const tours = JSON.parse(fs.readFileSync(toursFileName));

// exports.checkID = (req, res, next, val) => {
//   // if (parseInt(req.params.id) > tours.length) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     requestedAt: req.requestTime,
//   //     message: 'Invalid ID'
//   //   });
//   // }
//   // next();
// };

// exports.checkBody = (req, res, next) => {
//   const { name, price } = req.body;
//   if (!name || !price) {
//     return res.status(400).json({
//       status: 'fail',
//       requestedAt: req.requestTime,
//       message: 'Missing name or price.'
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    // FILTERING
    const queryOb = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryOb[field]);
    // AVANCE FILTERING
    let queryStr = JSON.stringify(queryOb);
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr);
    // BUILD QUERY
    const query = Tour.find(queryStr);
    // EJEXUTE QUERY
    const tours = await query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
  // OLD VERSION DIRECT FROM FILE
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = { ...req.body, id: newId };
  // tours.push(newTour);
  // fs.writeFile(toursFileName, JSON.stringify(tours), err => {
  //   res.status(201).json({
  //     status: 'success',
  //     requestedAt: req.requestTime,
  //     data: {
  //       tour: newTour
  //     }
  //   });
  // });
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
