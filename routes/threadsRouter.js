const express = require('express');
const threadsController = require('../controlers/threadsController');

const router = express.Router();


router.get('/:pid/:bonus', threadsController.getAllThreads);
router.get('/:id', threadsController.getThread);
router.post('/', threadsController.addThread);
router.delete('/:id', threadsController.deleteThread);
router.patch('/', threadsController.updateThread);

module.exports = router;