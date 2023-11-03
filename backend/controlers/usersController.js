const {users} = require("../models");

const { Model } = require('sequelize');
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.addUser = catchAsync(async (req, res, next) => {
    const params = req.params;
    let newUser;
    const existingUser = await users.findOne({ where: {username: params.val1}});
    if(!existingUser) {
        console.log(params)
        newUser = await users.create({
            username: params.val1,
            password: params.val2,
            creationDate: Date.now(),
            email: params.val3,
            isDeleted: params.val4,
            deletedAt: params.val5,
            status: params.val6,
        })
        res.status(200).json({
            status:"success",
            user: newUser,
          });
    }
    else{
        return next(new AppError('User like that already exists', 403));
    }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const user = await users.findOne({ where: { id: id}});

    if (!user) return next(new AppError('No user was found', 404));
    
    const result = await user.destroy({ force: true});


    res.status(200).json({
        status: 'success',
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
    const params = req.params;
    console.log(params)
    const existingUser = await users.findOne({ where: {id :  params.val7}});

    if(!existingUser) {
        return next(new AppError("User was not found", 404));
    }

    let updatedUser = await users.update({
        username: params.val1,
        password: params.val2,
        email: params.val3,
        isDeleted: params.val4,
        deletedAt: params.val5,
        status: params.val6,
    }, { where: {id :  params.val7}})

    res.status(200).json({
        status:"success",
        user: updatedUser,
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    console.log(users, "test");
    const Users = await users.findAll();

    if (!Users) return next(new AppError('No users were found', 404));
  
    res.status(200).json({
      status: 'success',
      users: Users,
    });
});

exports.login = catchAsync(async (req, res, next) => {
    res.status(501).json({});
});

exports.logout = catchAsync(async (req, res, next) => {
    res.status(501).json({});
});

exports.register = catchAsync(async (req, res, next) => {
    res.status(501).json({});
});