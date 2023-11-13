const {follows, users} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const auth = require('./authenticationController');

exports.addFollow = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'regular' && userT.role != 'admin' || Date.now() >= new Date(userT.expire))
    {
        return res.status(401).json({"message": "user invalid"});
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
    const body = req.body;
    const existingFollow = await follows.findOne({
         where: {pages_fk: body.pages_fk, users_fk: body.users_fk}});
    if(!existingFollow) {
        let newFollow = await follows.create({
            pages_fk: body.pages_fk,
            users_fk: userT.sub,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
        const updateFollow = await follows.findOne({
            where: {pages_fk: body.pages_fk, users_fk: userT.sub}});
        res.status(200).json({
            follow: updateFollow,
          });
    }
    else{
        return next(new AppError('Follow like that already exists', 403));
    }
});

exports.deleteFollow = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }

    const {id} = req.params;
    const follow = await follows.findOne({ where: { id: id}});

    if (!follow) return next(new AppError('No follow was found', 404));
        
    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != follow.users_fk && userT.role != 'admin')
    {
        return res.status(401).json({"message": "user invalid"});
    }

    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
  
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
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'regular' && userT.role != 'admin' || Date.now() >= new Date(userT.expire))
    {
        return res.status(401).json({"message": "user invalid"});
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }

    const {id} = req.params;
    const follow = await follows.findOne({ where: { id: id}});

    if (!follow) return next(new AppError('No follow was found', 404));
    if(userT.role == 'regular' && userT.sub != follow.users_fk) return res.status(401).json("Can't get follow from other users");
  
    res.status(200).json({
      follow: follow,
    });
});

exports.updateFollow = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'regular' && userT.role != 'admin' || Date.now() >= new Date(userT.expire))
    {
        return res.status(401).json({"message": "user invalid"});
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }

    const body = req.body;
    const existingFollow = await follows.findOne({ where: {id :  body.id}});

    if(!existingFollow) {
        return next(new AppError("Follow was not found", 404));
    }

    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != existingFollow.users_fk && userT.role != 'admin')
    {
        res.status(401).json({"message": "user invalid"});
    }

    const duplicateFollow = await follows.findOne({ where: {users_fk: body.users_fk, pages_fk: body.pages_fk }});
    if(duplicateFollow != undefined && duplicateFollow.id != existingFollow.id) {
        return next(new AppError("Follow is a duplicate", 403));
    }

    if(userT.role == 'admin')
    {
        let updatedFollow = await follows.update({
            pages_fk: body.pages_fk,
            users_fk: body.users_fk,
            updatedAt: Date.now()
        }, { where: {id :  body.id}})

        const updateFollow = await follows.findOne({ where: {users_fk: body.users_fk, pages_fk: body.pages_fk }});

        res.status(200).json({
            follow: updateFollow,
        });
    }
    else
    {
        let updatedFollow = await follows.update({
            pages_fk: body.pages_fk,
            users_fk: userT.sub,
            updatedAt: Date.now()
        }, { where: {id :  body.id, users_fk: userT.sub}})
        
        const updateFollow = await follows.findOne({ where: {users_fk: userT.sub, pages_fk: body.pages_fk }});

        res.status(200).json({
            follow: updateFollow,
        });
    }
});

exports.getAllFollows = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'admin' || Date.now() >= new Date(userT.expire))
    {
        return res.status(401).json({"message": "user invalid"});
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
    const Follows = await follows.findAll();

    if (!Follows) return next(new AppError('No follows were found', 404));
  
    res.status(200).json({
      follows: Follows,
    });
});