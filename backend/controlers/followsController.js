const {follows} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const auth = require('./authenticationController');

exports.addFollow = catchAsync(async (req, res, next) => {
    const body = req.body;
    const existingFollow = await follows.findOne({
         where: {pages_fk: body.pages_fk, users_fk: body.users_fk}});
    if(!existingFollow) {
        let newFollow = await follows.create({
            pages_fk: body.pages_fk,
            users_fk: body.users_fk,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
        const updateFollow = await follows.findOne({
            where: {pages_fk: body.pages_fk, users_fk: body.users_fk}});
        res.status(200).json({
            follow: updateFollow,
          });
    }
    else{
        return next(new AppError('Follow like that already exists', 403));
    }
});

exports.deleteFollow = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const follow = await follows.findOne({ where: { id: id}});

    if (!follow) return next(new AppError('No follow was found', 404));
    
    const result = await follow.destroy({ force: true});

    if(!result)
    {
        res.status(200).json({
            result: result,
        });
    }
    else
    {
        res.status(403).json({
            result: result,
        });
    }
});

exports.getFollow = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const follow = await follows.findOne({ where: { id: id}});

    if (!follow) return next(new AppError('No follow was found', 404));
  
    res.status(200).json({
      follow: follow,
    });
});

exports.updateFollow = catchAsync(async (req, res, next) => {
    const body = req.body;
    const existingFollow = await follows.findOne({ where: {id :  body.id}});

    if(!existingFollow) {
        return next(new AppError("Follow was not found", 404));
    }

    const duplicateFollow = await follows.findOne({ where: {users_fk: body.users_fk, pages_fk: body.pages_fk }});
    if(duplicateFollow != undefined && duplicateFollow.id != existingFollow.id) {
        return next(new AppError("Follow is a duplicate", 403));
    }

    let updatedFollow = await follows.update({
        pages_fk: body.pages_fk,
        users_fk: body.users_fk,
        updatedAt: Date.now()
    }, { where: {id :  body.id}})

    const updateFollow = await follows.findOne({ where: {users_fk: body.users_fk, pages_fk: body.pages_fk }});

    res.status(200).json({
        follow: updateFollow,
    });
});

exports.getAllFollows = catchAsync(async (req, res, next) => {
    const Follows = await follows.findAll();

    if (!Follows) return next(new AppError('No follows were found', 404));
  
    res.status(200).json({
      follows: Follows,
    });
});