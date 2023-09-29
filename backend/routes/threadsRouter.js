const express = require('express');
const threadsController = require('../controlers/threadsController');

const router = express.Router();


router.get('/:pid/:bonus', threadsController.getAllThreads);
router.get('/:id', threadsController.getThread);
router.post('/:val1/:val2/:val3/:val4/:val5', threadsController.addThread);
router.delete('/:id', threadsController.deleteThread);
router.patch('/:val1/:val2/:val3/:val4/:val5/:val6', threadsController.updateThread);

module.exports = router;