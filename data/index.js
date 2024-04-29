import bookingRoute from './booking.js';

const constructorMethod = (app) => {
  app.use('/addBooking', bookingRoute);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;