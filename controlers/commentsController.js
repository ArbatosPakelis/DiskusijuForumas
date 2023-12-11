const {comments, users} = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const auth = require('./authenticationController');

exports.addComment = catchAsync(async (req, res, next) => {
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
    const newComment = await comments.create({
        content: body.content,
        upvotes: body.upvotes,
        downvotes: body.downvotes,
        threads_fk: body.threads_fk,
        users_fk: userT.sub,
        createdAt: Date.now(),
        updatedAt: Date.now()
    })
    if(!newComment)
    {
        res.status(403).json({
            comment: newComment,
        });
    }
    else
    {
        res.status(200).json({
            comment: newComment,
            });
    }
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    auth.authenticateAccessToken(req, res, next);
    if(req.error !== undefined) return res.status(req.error).json({"message": "token expired or invalid"});

    const userT = req.user;
    if(userT === undefined)
    {
        return res.status(401).json({"message": "token expired"});
    }

    const {id} = req.params;
    const comment = await comments.findOne({ where: { id: id}});

    if (!comment) return next(new AppError('No comment was found', 404));
    
    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != comment.users_fk && userT.role != 'admin')
    {
        return res.status(401).json({"message": "user invalid"});
    }

    const userCaller = await users.findOne({ where: { id: userT.sub}});

    if(!userCaller || userCaller.ForceRelogin)
    {
        return res.status(401).json({"message": "user must relog"});
    }
    
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
    const existingComment = await comments.findOne({ where: {id :  body.id}});

    if(!existingComment) {
        return next(new AppError("Comment was not found", 404));
    }

    if(userT.role != 'regular' && userT.role != 'admin' ||
    Date.now() >= new Date(userT.expire) ||
    userT.sub != existingComment.users_fk && userT.role != 'admin')
    {
        res.status(401).json({"message": "user invalid"});
    }

    try // can't catch error otherwise
    {
        if(userT.role == 'admin')
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
        else
        {
            let updatedComment = await comments.update({
                content: body.content,
                upvotes: body.upvotes,
                downvotes: body.downvotes,
                threads_fk: body.threads_fk,
                users_fk: body.users_fk,
                updatedAt: Date.now()
            }, { where: {id :  body.id, users_fk: userT.sub}})
        }
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