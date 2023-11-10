const {users} = require("../models");
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
    const {id} = req.params;
    const user = await users.findOne({ where: { id: id}});

    if (!user) return next(new AppError('No user was found', 404));
    
    const result = await user.destroy({ force: true});


    res.status(200).json({
        result: result,
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const user = await users.findOne({ where: { id: id}});

    if (!user) return next(new AppError('No user was found', 404));
  
    res.status(200).json({
      status: 'success',
      users: user,
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const body = req.body;
    const existingUser = await users.findOne({ where: {id :  body.id}});

    if(!existingUser) {
        return next(new AppError("User was not found", 404));
    }

    const duplicateUser = await users.findOne({ where: {username: body.username}});
    if(duplicateUser != undefined && duplicateUser.id != existingUser.id) {
        return next(new AppError("User has a duplicate username", 403));
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
    }, { where: {id :  body.id}})

    const updateUser = await users.findOne({ where: {id :  body.id}});

    res.status(200).json({
        user: updateUser,
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const Users = await users.findAll();

    if (!Users) return next(new AppError('No users were found', 404));
  
    res.status(200).json({
      users: Users,
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const body = req.body;

    const user = await users.findOne({ where: {username: body.username}});
    if(user.status != "regular")
    {
        res.status("401").send();
    }
    if(!user)
    {
        res.status(404).send();
    }
    try
    {
        const correct = bcrypt.compare(body.password, user.password);
        if(correct)
        {

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
    res.status(501).send();
});


