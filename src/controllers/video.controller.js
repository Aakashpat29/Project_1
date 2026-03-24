import { asyncHandler } from "../utils/asyncHandler";
import fs from "fs";

const uploadVideo = asyncHandler(async (req, res) => {

    
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

   
    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video?.url || !thumbnail?.url) {
        throw new ApiError(400, "Upload failed");
    }

    
    const newVideo = await Video.create({
        title: req.body.title,
        description: req.body.description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: req.user._id
    });

    // 🔹 Delete local files
    fs.unlinkSync(videoLocalPath);
    fs.unlinkSync(thumbnailLocalPath);

    return res.status(201).json(
        new ApiResponse(201, newVideo, "Video uploaded successfully")
    );
});