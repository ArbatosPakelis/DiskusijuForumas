const express = require('express');
const pagesController = require('../controlers/pagesController');

const router = express.Router();


router.get('/', pagesController.getAllPages);
router.get('/:id', pagesController.getPage);
router.post('/:val1/:val2/:val3', pagesController.addPage);
router.delete('/:id', pagesController.deletePage);
router.patch('/:val1/:val2/:val3/:val4', pagesController.updatePage);

module.exports = router;