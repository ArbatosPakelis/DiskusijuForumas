const {comments} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.addComment = catchAsync(async (req, res, next) => {
    const params = req.params;
    const newComment = await comments.create({
        content: params.val1,
        date: Date.now(),
        upvotes: params.val2,
        downvotes: params.val3,
        Threads_FK: params.val4,
        Users_FK: params.val5,
    })
    if(!newComment)
    {
        res.status(200).json({
            status:"success",
            comment: newComment,
            });
    }
    else
    {
        res.status(403).json({
            status:"failure",
            comment: newComment,
        });
    }
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const comment = await comments.findOne({ where: { id: id}});

    if (!comment) return next(new AppError('No comment was found', 404));
    
    const result = await comment.destroy({ force: true});

    res.status(200).json({
        status: 'success',
        result: result,
    });
});

exports.getComment = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const comment = await comments.findOne({ where: { id: id}});

    if (!comment) return next(new AppError('No comment was found', 404));
  
    res.status(200).json({
      status: 'success',
      comments: comment,
    });
});

exports.updateComment = catchAsync(async (req, res, next) => {
    const params = req.params;
    const existingComment = await comments.findOne({ where: {id :  params.val6}});

    if(!existingComment) {
        return next(new AppError("Comment was not found", 404));
    }
    let updatedComment;
    try
    {
        updatedComment = await comments.update({
            content: params.val1,
            date: Date.now(),
            upvotes: params.val2,
            downvotes: params.val3,
            Threads_FK: params.val4,
            Users_FK: params.val5,
        }, { where: {id :  params.val6}})
    }
    catch(err)
    {
        return next(new AppError("Check your foreign key values", 404));
    }

    res.status(200).json({
        status:"success",
        comment: updatedComment,
    });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
    const params = req.params;
    let Comments;
    if(params.bonus === "all")
    {
        Comments = await comments.findAll();
        if (!Comments || Comments.length === 0) return next(new AppError('No comments were found', 404));
        res.status(200).json({
            status: 'success',
            comments: Comments,
        });
    }
    else
    {
        Comments = await comments.findAll({ where: {Threads_FK :  params.tid}});
        if (!Comments || Comments.length === 0) return next(new AppError('No comments were found', 404));
        res.status(200).json({
            status: 'success',
            comments: Comments,
        });
    }
});