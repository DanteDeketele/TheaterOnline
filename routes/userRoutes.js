// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.delete('/delete/:userId', userController.deleteUser);
router.put('/update/:userId', userController.editUser);
router.get('/all', userController.getAllUsers);

module.exports = router;
