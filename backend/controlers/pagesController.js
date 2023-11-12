const {pages, users,} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const authenticateAccessToken = require('../controlers/usersController');
const auth = require('./authenticationController');

exports.addPage = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'regular' && userT.role != 'admin' || Date.now() >= new Date(userT.expire))
    {
        res.status(401).json({"message": "user invalid"});
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
    const body = req.body;
    let newPage;
    const existingPage = await pages.findOne({ where: {name: body.name}});
    if(!existingPage) {
        newPage = await pages.create({
            category: body.category,
            name: body.name,
            description: body.description,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            users_fk: userT.sub,
        })
        res.status(200).json({
            page: newPage,
          });
    }
    else{
        return next(new AppError('Page like that already exists', 403));
    }
});

exports.deletePage = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }

    const {id} = req.params;
    const page = await pages.findOne({ where: { id: id}});

    if (!page) return next(new AppError('No page was found', 404));

    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != page.users_fk && userT.role != 'admin')
    {
        res.status(401).json({"message": "user invalid"});
    }

    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }

    const result = await page.destroy({ force: true});


    res.status(200).json({
        result: result,
    });
});

exports.getPage = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const page = await pages.findOne({ where: { id: id}});

    if (!page) return next(new AppError('No page was found', 404));
  
    res.status(200).json({
      page: page,
    });
});

exports.updatePage = catchAsync(async (req, res, next) => {
    const body = req.body;
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'regular' && userT.role != 'admin' ||
      Date.now() >= new Date(userT.expire) ||
      userT.sub != body.users_fk && userT.role != 'admin')
    {
        res.status(401).json({"message": "user invalid"});
    }
    const existingPage = await pages.findOne({ where: {id :  body.id}});

    if(!existingPage) {
        return next(new AppError("Page was not found", 404));
    }

    const duplicatePage = await pages.findOne({ where: {name: body.name}});
    if(duplicatePage != undefined && duplicatePage.id != existingPage.id) {
        return next(new AppError("Page has a duplicate name", 403));
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }

    if(userT.role == 'admin')
    {
        let updatedPage = await pages.update({
            category: body.category,
            name: body.name,
            description: body.description,
            updatedAt: Date.now()
        }, { where: {id :  body.id}})
    }
    else
    {
        id = userT.sub;
        let updatedPage = await pages.update({
            category: body.category,
            name: body.name,
            description: body.description,
            updatedAt: Date.now()
        }, { where: {id :  body.id, users_fk: id}})
    }
    const updatePage = await pages.findOne({ where: {id :  body.id}});

    res.status(200).json({
        page: updatePage,
    });
});

exports.getAllPages = catchAsync(async (req, res, next) => {
    const Pages = await pages.findAll();

    if (!Pages) return next(new AppError('No pages were found', 404));
  
    res.status(200).json({
      pages: Pages,
    });
});
