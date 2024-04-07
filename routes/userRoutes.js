// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registration route
//router.post('/register', userController.registerUser);

// Login route
router.post('/login', userController.loginUser);

router.post('/create', userController.createUser);
router.delete('/delete/:userId', userController.deleteUser);
router.put('/update/:userId', userController.editUser);
router.get('/all', userController.getAllUsers);
router.get('/weekly-created-users', userController.getUsersCreatedPerWeek);

router.put('/promote/:userId', userController.promoteToAdmin);
router.put('/demote/:userId', userController.demoteFromAdmin);
router.get('/admins', userController.getAdmins);

router.get('/:userId', userController.getUserById);

module.exports = router;
