const express = require('express');
const commentsController = require('../controlers/commentsController');

const router = express.Router();


router.get('/:tid/:bonus', commentsController.getAllComments);
router.get('/:id', commentsController.getComment);
router.post('/', commentsController.addComment);
router.delete('/:id', commentsController.deleteComment);
router.patch('/', commentsController.updateComment);

module.exports = router;