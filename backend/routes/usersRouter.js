const express = require('express');
const usersController = require('../controlers/usersController');

const router = express.Router();


router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.post('/', usersController.addUser);
router.delete('/:id', usersController.deleteUser);
router.patch('/', usersController.updateUser);
router.post('/login', usersController.login);
router.post('/logout', usersController.logout); 
router.post('/tokens', usersController.renewTokens);
router.post('/signup', usersController.addUser);
module.exports = router;
