const router = require('express').Router();
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
