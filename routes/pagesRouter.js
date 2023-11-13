const express = require('express');
const pagesController = require('../controlers/pagesController');

const router = express.Router();


router.get('/', pagesController.getAllPages);
router.get('/:id', pagesController.getPage);
router.post('/', pagesController.addPage);
router.delete('/:id', pagesController.deletePage);
router.patch('/', pagesController.updatePage);
module.exports = router;