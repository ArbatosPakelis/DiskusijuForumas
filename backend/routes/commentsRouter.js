const express = require('express');
const commentsController = require('../controlers/commentsController');

const router = express.Router();


router.get('/:tid/:bonus', commentsController.getAllComments);
router.get('/:id', commentsController.getComment);
router.post('/:val1/:val2/:val3/:val4/:val5', commentsController.addComment);
router.delete('/:id', commentsController.deleteComment);
router.patch('/:val1/:val2/:val3/:val4/:val5/:val6', commentsController.updateComment);

module.exports = router;