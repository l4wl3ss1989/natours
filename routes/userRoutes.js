const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  createUser
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect); //WARN: Will protect the rest of the routes.
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin')); //WARN: Will restrict the rest of the routes.
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
