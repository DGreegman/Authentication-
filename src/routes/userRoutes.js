const express = require('express');
const Users = require('../controllers/userController')
const router = express.Router();
const { protect, restrict } = require('../middleware/protect')

const user = new Users();

router.post('/signup', user.register)
router.get('/view', protect, restrict('admin'), user.viewRegistered)
router.delete('/delete-all', user.deleteAllUsers)
router.post('/login',  user.login)

module.exports = router;