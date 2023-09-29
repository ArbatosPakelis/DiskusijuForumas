const {follows} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.addFollow = catchAsync(async (req, res, next) => {
    const params = req.params;
    let newFollow;
    const existingFollow = await follows.findOne({
         where: {Users_FK: params.val1, Pages_FK: params.val2}});
    if(!existingFollow) {
        newFollow = await follows.create({
            Users_FK: params.val1,
            Pages_FK: params.val2,
        })
        res.status(200).json({
            status:"success",
            follow: newFollow,
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
            status: 'success',
            result: result,
        });
    }
    else
    {
        res.status(403).json({
            status: 'failure',
            result: result,
        });
    }
});

exports.getFollow = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const follow = await follows.findOne({ where: { id: id}});

    if (!follow) return next(new AppError('No follow was found', 404));
  
    res.status(200).json({
      status: 'success',
      follow: follow,
    });
});

exports.updateFollow = catchAsync(async (req, res, next) => {
    const params = req.params;
    const existingFollow = await follows.findOne({ where: {id :  params.val3}});

    if(!existingFollow) {
        return next(new AppError("Follow was not found", 404));
    }

    let updatedFollow = await follows.update({
        Users_FK: params.val1,
        Pages_FK: params.val2,
    }, { where: {id :  params.val3}})

    res.status(200).json({
        status:"success",
        follow: updatedFollow,
    });
});

exports.getAllFollows = catchAsync(async (req, res, next) => {
    const Follows = await follows.findAll();

    if (!Follows) return next(new AppError('No follows were found', 404));
  
    res.status(200).json({
      status: 'success',
      follows: Follows,
    });
});