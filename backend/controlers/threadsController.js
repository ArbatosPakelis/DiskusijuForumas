const {threads} = require("../models/threads");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');


exports.addThread = catchAsync(async (req, res, next) => {
    const params = req.params;
    let newThread;
    const existingThread = await threads.findOne({ where: { name: params.val1}});
    if(!existingThread) {
        try
        {
            newThread = await threads.create({
                name: params.val1,
                upvotes: params.val2,
                downvotes: params.val3,
                lastEditDate: Date.now(),
                Pages_FK: params.val4,
                Users_FK: params.val5,
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
            status:"success",
            thread: newThread,
          });
    }
    else{
        return next(new AppError('Thread like that already exists', 403));
    }
});

exports.deleteThread = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const thread = await threads.findOne({ where: { id: id}});

    if (!thread) return next(new AppError('No thread was found', 404));
    
    try
    {
        const result = await thread.destroy({ force: true});
    }
    catch(err)
    {
        return next(new AppError('Please check remove all comments before removing the thread', 403));
    }

    res.status(200).json({
        status: 'success',
        result: result,
    });
});

exports.getThread = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const thread = await threads.findOne({ where: { id: id}});

    if (!thread) return next(new AppError('No thread was found', 404));
  
    res.status(200).json({
      status: 'success',
      thread: thread,
    });
});

exports.updateThread = catchAsync(async (req, res, next) => {
    const params = req.params;
    const existingThread = await threads.findOne({ where: {id :  params.val6}});

    if(!existingThread) {
        return next(new AppError("thread was not found", 404));
    }

    let updatedThread = await threads.update({
        name: params.val1,
        upvotes: params.val2,
        downvotes: params.val3,
        lastEditDate: Date.now(),
        Pages_FK: params.val4,
        Users_FK: params.val5,
    }, { where: {id :  params.val6}})

    res.status(200).json({
        status:"success",
        thread: updatedThread,
    });
});

exports.getAllThreads = catchAsync(async (req, res, next) => {
    const params = req.params;
    let Threads;
    if(params.bonus === 'all')
    {
        Threads = await threads.findAll();
        if (!Threads) return next(new AppError('No threads were found for the page', 404));
        res.status(200).json({
            status: 'success',
            threads: Threads,
          });
    }
    else
    {
        Threads = await threads.findAll({ where: {Pages_FK :  params.pid}},);
        if (!Threads) return next(new AppError('No threads were found for the page', 404));
        res.status(200).json({
            status: 'success',
            threads: Threads,
          });
    }
});