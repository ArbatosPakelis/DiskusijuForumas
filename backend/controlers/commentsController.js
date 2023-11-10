const {comments} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const auth = require('./authenticationController');

exports.addComment = catchAsync(async (req, res, next) => {
    const body = req.body;
    const newComment = await comments.create({
        content: body.content,
        upvotes: body.upvotes,
        downvotes: body.downvotes,
        threads_fk: body.threads_fk,
        users_fk: body.users_fk,
        createdAt: Date.now(),
        updatedAt: Date.now()
    })
    if(!newComment)
    {
        res.status(200).json({
            comment: newComment,
            });
    }
    else
    {
        res.status(403).json({
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
        result: result,
    });
});

exports.getComment = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const comment = await comments.findOne({ where: { id: id}});

    if (!comment) return next(new AppError('No comment was found', 404));
  
    res.status(200).json({
      comments: comment,
    });
});

exports.updateComment = catchAsync(async (req, res, next) => {
    const body = req.body;
    const existingComment = await comments.findOne({ where: {id :  body.id}});

    if(!existingComment) {
        return next(new AppError("Comment was not found", 404));
    }
    try // can't catch error otherwise
    {
        let updatedComment = await comments.update({
            content: body.content,
            upvotes: body.upvotes,
            downvotes: body.downvotes,
            threads_fk: body.threads_fk,
            users_fk: body.users_fk,
            updatedAt: Date.now()
        }, { where: {id :  body.id}})
    }
    catch(err)
    {
        return next(new AppError("Check your foreign key values", 403));
    }

    const updateComment = await comments.findOne({ where: {id :  body.id}});

    res.status(200).json({
        comment: updateComment,
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
            comments: Comments,
        });
    }
    else
    {
        Comments = await comments.findAll({ where: {Threads_FK :  params.tid}});
        if (!Comments || Comments.length === 0) return next(new AppError('No comments were found', 404));
        res.status(200).json({
            comments: Comments,
        });
    }
});