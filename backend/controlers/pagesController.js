const {pages} = require("../models/pages");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.addPage = catchAsync(async (req, res, next) => {
    const params = req.params;
    let newPage;
    const existingPage = await pages.findOne({ where: {name: params.val2}});
    if(!existingPage) {
        newPage = await pages.create({
            category: params.val1,
            name: params.val2,
            description: params.val3,
        })
        res.status(200).json({
            status:"success",
            page: newPage,
          });
    }
    else{
        return next(new AppError('Page like that already exists', 403));
    }
});

exports.deletePage = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const page = await pages.findOne({ where: { id: id}});

    if (!page) return next(new AppError('No page was found', 404));
    
    const result = await page.destroy({ force: true});


    res.status(200).json({
        status: 'success',
        result: result,
    });
});

exports.getPage = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const page = await pages.findOne({ where: { id: id}});

    if (!page) return next(new AppError('No page was found', 404));
  
    res.status(200).json({
      status: 'success',
      page: page,
    });
});

exports.updatePage = catchAsync(async (req, res, next) => {
    const params = req.params;
    const existingPage = await pages.findOne({ where: {id :  params.val4}});

    if(!existingPage) {
        return next(new AppError("Page was not found", 404));
    }

    let updatedPage = await pages.update({
        category: params.val1,
        name: params.val2,
        description: params.val3,
    }, { where: {id :  params.val4}})

    res.status(200).json({
        status:"success",
        page: updatedPage,
    });
});

exports.getAllPages = catchAsync(async (req, res, next) => {
    const Pages = await pages.findAll();

    if (!Pages) return next(new AppError('No pages were found', 404));
  
    res.status(200).json({
      status:"success",
      pages: Pages,
    });
});