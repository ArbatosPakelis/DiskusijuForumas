const express = require('express');
const followsController = require('../controlers/followsController');

const router = express.Router();


router.get('/', followsController.getAllFollows);
router.get('/:id', followsController.getFollow);
router.post('/', followsController.addFollow);
router.delete('/:id', followsController.deleteFollow);
router.patch('/', followsController.updateFollow);

module.exports = router;