const express = require('express');
const followsController = require('../controlers/followsController');

const router = express.Router();


router.get('/', followsController.getAllFollows);
router.get('/:id', followsController.getFollow);
router.post('/:val1/:val2', followsController.addFollow);
router.delete('/:id', followsController.deleteFollow);
router.patch('/:val1/:val2/:val3', followsController.updateFollow);

module.exports = router;