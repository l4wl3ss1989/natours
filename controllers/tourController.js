const fs = require('fs');

const toursFileName = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursFileName));

exports.checkID = (req, res, next, val) => {
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      requestedAt: req.requestTime,
      message: 'Invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      requestedAt: req.requestTime,
      message: 'Missing name or price.'
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find(t => id === t.id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      requestedAt: req.requestTime,
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);

  fs.writeFile(toursFileName, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: newTour
      }
    });
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null
  });
};
