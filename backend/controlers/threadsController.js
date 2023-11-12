const {threads, users} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const auth = require('./authenticationController');

exports.addThread = catchAsync(async (req, res, next) => {
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
    let newThread;
    const existingThread = await threads.findOne({ where: { name: body.name}});
    if(!existingThread) {
        try
        {
            newThread = await threads.create({
                name: body.name,
                upvotes: body.upvotes,
                downvotes: body.downvotes,
                pages_fk: body.pages_fk,
                users_fk: userT.sub,
                createdAt: Date.now(),
                updatedAt: Date.now()
            })
        }
        catch(err)
        {
            if(!existingThread)
            {
                return next(new AppError('Please check you foreign key choices', 403));
            }
        }
        res.status(200).json({
            thread: newThread,
          });
    }
    else{
        return next(new AppError('Thread like that already exists', 403));
    }
});

exports.deleteThread = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }

    const {id} = req.params;
    const thread = await threads.findOne({ where: { id: id}});

    if (!thread) return next(new AppError('No thread was found', 404));

    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != thread.users_fk && userT.role != 'admin')
    {
        res.status(401).json({"message": "user invalid"});
    }

    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
    try
    {
        const result = await thread.destroy({ force: true});
        res.status(200).json({
            result: result,
        });
    }
    catch(err)
    {
        return next(new AppError('Please remove all comments before removing the thread', 403));
    }
});

exports.getThread = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const thread = await threads.findOne({ where: { id: id}});

    if (!thread) return next(new AppError('No thread was found', 404));
  
    res.status(200).json({
      thread: thread,
    });
});

exports.updateThread = catchAsync(async (req, res, next) => {
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
    const existingThread = await threads.findOne({ where: {id :  body.id}});

    if(!existingThread) {
        return next(new AppError("thread was not found", 404));
    }

    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != existingThread.users_fk && userT.role != 'admin')
    {
        res.status(401).json({"message": "user invalid"});
    }

    const duplicateThread = await threads.findOne({ where: {name: body.name}});
    if(duplicateThread != undefined && duplicateThread.id != existingThread.id) {
        return next(new AppError("Thread has a duplicate name", 403));
    }
    if(userT.role == 'admin')
    {
        let updatedThread = await threads.update({
            name: body.name,
            upvotes: body.upvotes,
            downvotes: body.downvotes,
            pages_fk: body.pages_fk,
            users_fk: body.users_fk,
            updatedAt: Date.now()
        }, { where: {id :  body.id}})
    }
    else
    {
        let updatedThread = await threads.update({
            name: body.name,
            upvotes: body.upvotes,
            downvotes: body.downvotes,
            pages_fk: body.pages_fk,
            users_fk: body.users_fk,
            updatedAt: Date.now()
        }, { where: {id :  body.id, users_fk: userT.sub}})
    }

    const updateThread = await threads.findOne({ where: {id :  body.id}});

    res.status(200).json({
        thread: updateThread,
    });
});

exports.getAllThreads = catchAsync(async (req, res, next) => {
    const params = req.params;
    let Threads;
    if(params.bonus === 'all')
    {
        Threads = await threads.findAll();
        if (!Threads) return next(new AppError('No threads were found', 404));
        res.status(200).json({
            threads: Threads,
          });
    }
    else
    {
        Threads = await threads.findAll({ where: {Pages_FK :  params.pid}},);
        if (!Threads) return next(new AppError('No threads were found for the page', 404));
        res.status(200).json({
            threads: Threads,
          });
    }
});