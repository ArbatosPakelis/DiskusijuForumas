const express = require('express');
const usersController = require('../controlers/usersController');

const router = express.Router();


router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.post('/:val1/:val2/:val3/:val4/:val5/:val6', usersController.addUser);
router.delete('/:id', usersController.deleteUser);
router.patch('/:val1/:val2/:val3/:val4/:val5/:val6/:val7', usersController.updateUser);
router.patch('/', usersController.login); // not implemented
router.patch('/', usersController.logout); // not implemented
router.post('/', usersController.register); // not implemented
module.exports = router;
