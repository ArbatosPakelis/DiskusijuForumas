const {users, Tokens,} = require("../models");
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require('./authenticationController');

exports.addUser = catchAsync(async (req, res, next) => {
    const body = req.body;
    let newUser;
    const existingUser = await users.findOne({ where: {username: body.username}});
    try
    {
        const pswd = await bcrypt.hash(body.password, 10);
    
        if(!existingUser) {
            newUser = await users.create({
                username: body.username,
                password: pswd,
                email: body.email,
                isDeleted: body.isDeleted,
                status: body.status,
                ForceRelogin: body.ForceRelogin,
                createdAt: Date.now(),
                updatedAt: Date.now()
            })
            res.status(200).json({
                user: newUser,
            });
        }
        else{
            return next(new AppError('User like that already exists', 403));
        }
    }
    catch
    {
        res.status(500).send();
    }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
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

    let id = 0;
    if(userT.role == 'admin')
    {
        id = req.params.id;

    }
    else
    {
        id = userT.sub;
    }
    const user = await users.findOne({ where: { id: id}});

    if (!user) return next(new AppError('No user was found', 404));

    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {

        return res.status(401).json({"message": "user must relog"});
    }

    const result = await user.destroy({ force: true});

    res.status(200).json({
        result: result,
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
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

    let id = 0;
    if(userT.role == 'admin')
    {
        id = req.params.id;

    }
    else
    {
        id = userT.sub;
    }
    const user = await users.findOne({ where: { id: id}});

    if (!user) return next(new AppError('No user was found', 404));

    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
  
    res.status(200).json({
      users: user,
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
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
    const existingUser = await users.findOne({ where: {id :  body.id}});

    if(!existingUser) {
        return next(new AppError("User was not found", 404));
    }

    const duplicateUser = await users.findOne({ where: {username: body.username}});
    if(duplicateUser != undefined && duplicateUser.id != existingUser.id) {
        return next(new AppError("User has a duplicate username", 403));
    }

    let id = 0;
    if(userT.role === 'admin')
    {
        id = body.id;

    }
    else
    {
        id = userT.sub;
    }

    const pswd = await bcrypt.hash(body.password, 10);
    let updatedUser = await users.update({
        username: body.username,
        password: pswd,
        email: body.email,
        isDeleted: body.isDeleted,
        status: body.status,
        ForceRelogin: body.ForceRelogin,
        updatedAt: Date.now()
    }, { where: {id :  id}})

    const updateUser = await users.findOne({ where: {id :  id}});

    res.status(200).json({
        user: updateUser,
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }
    if(userT.role != 'admin' || Date.now() >= new Date(userT.expire))
    {
        res.status(401).json({"message": "user invalid"});
    }
    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
    const Users = await users.findAll();

    if (!Users) return next(new AppError('No users were found', 404));
  
    res.status(200).json({
      users: Users,
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const body = req.body;

    const user = await users.findOne({ where: {username: body.username}});
    if(!user)
    {
        return res.status(404).send();
    }
    if(user.status != "regular" && user.status != "admin")
    {
        return res.status(401).send();
    }
    try
    {
        const correct = bcrypt.compare(body.password, user.password);
        if(correct)
        {
            let updatedUser = await users.update({
                username: user.username,
                password: user.password,
                email: user.email,
                isDeleted: user.isDeleted,
                status: user.status,
                ForceRelogin: false,
                updatedAt: Date.now()
            }, { where: {id :  user.id}})

            var currentTime1 = new Date();
            currentTime1.setMinutes(currentTime1.getMinutes() + 15);
            const userPayload1 = {
                sub: user.id,
                role: user.status,
                created: new Date(),
                expire: currentTime1,
            };

            var currentTime2 = new Date();
            currentTime2.setDate(currentTime2.getDate() + 1);
            const userPayload2 = {
                sub: user.id,
                role: user.status,
                created: new Date(),
                expire: currentTime2,
            };

            const accessToken = jwt.sign(
                userPayload1,
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'});

            const refreshToken = jwt.sign(
                userPayload2,
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'});

            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.status,
                id: user.id
            });
        }
        else
        {
            res.status(401).json({
                message: "Wrong password",
            });
        }
    }
    catch(err)
    {
        res.status(500).json({
            err: err,
        });
    }
});

exports.logout = catchAsync(async (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    const existingToken = await Tokens.findOne({ where: { token: token}});

    if(existingToken  != null) return res.status(403);

    auth.authenticateRefreshToken(req, res, next);

    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});
    const user = req.user;

    if(user.role != 'regular' && user.role != 'admin' || Date.now() >= new Date(user.expire)) res.status(401);
    
    let result = await Tokens.create({
        token:token,
        users_fk:user.sub,
        createdAt:Date.now(),
        updatedAt:Date.now(),
    });

    const existingUser = await users.findOne({ where: {id: user.sub}});
    if(!existingUser) return res.status(403);

    let updatedUser = await users.update({
        username: existingUser.username,
        password: existingUser.password,
        email: existingUser.email,
        isDeleted: existingUser.isDeleted,
        status: existingUser.status,
        ForceRelogin: true, // forces user to relog
        updatedAt: Date.now()
    }, { where: {id :  existingUser.id}})

    const updateUser = await users.findOne({ where: {id :  existingUser.id}});

    return res.status(200).json({
        user: updateUser.username,
        ForceRelogin: updateUser.ForceRelogin,
    });
    
});

exports.renewTokens = catchAsync(async (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    const existingToken = await Tokens.findOne({ where: { token: token}});
    if(existingToken  != null){
        return res.status(403).json({ message: 'token is blacklisted' });
    }

    auth.authenticateRefreshToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});
    const user = req.user;
    if(user.role != 'regular' && user.role != 'admin' || Date.now() >= new Date(user.expire)){
        return res.status(401);
    }

    var currentTime1 = new Date();
    currentTime1.setMinutes(currentTime1.getMinutes() + 15);
    const userPayload1 = {
        sub: user.sub,
        role: user.role,
        created: new Date(),
        expire: currentTime1,
    };

    var currentTime2 = new Date();
    currentTime2.setDate(currentTime2.getDate() + 1);
    const userPayload2 = {
        sub: user.sub,
        role: user.role,
        created: new Date(),
        expire: currentTime2,
    };

    const accessToken = jwt.sign(
        userPayload1,
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '15m'});

    const refreshToken = jwt.sign(
        userPayload2,
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'});

    let result = await Tokens.create({
        token:token,
        users_fk:user.sub,
        createdAt:Date.now(),
        updatedAt:Date.now(),
    });
    return res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
});

