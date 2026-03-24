import {Comment} from "../models/comment.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Aggregate comments
    const comments = await Comment.aggregate([

        // Match comments for this video
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parentComment: null // only top-level comments
            }
        },

        // Sort latest first
        {
            $sort: { createdAt: -1 }
        },

        // Pagination
        {
            $skip: (pageNumber - 1) * limitNumber
        },
        {
            $limit: limitNumber
        },

        // Join user (owner) data
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        // Convert owner array → object
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }

    ]);

    // Count total comments (for pagination)
    const totalComments = await Comment.countDocuments({
        video: videoId,
        parentComment: null
    });

    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            pagination: {
                totalComments,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalComments / limitNumber)
            }
        }, "Comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
        parentComment: null // top-level comment
    });

    const populatedComment = await Comment.findById(comment._id)
        .populate("owner", "username avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            populatedComment,
            "Comment added successfully"
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    comment.content = content;

    await comment.save();

    const updatedComment = await Comment.findById(commentId)
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

export {getVideoComments, addComment, updateComment, deleteComment}