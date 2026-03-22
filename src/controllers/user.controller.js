import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler( async(req, res) => {
    // get user details from frontend
    // validation of user details- not empty, email format, password strength etc
    // check if user already exists in database using email, ussername etc
    // check for images , check for avatar
    // upload them to cloudinary, avatar and get the url
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password}=req.body
    console.log("email :", email);

    if(
        [fullName, email, username, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError("All fields are required", 400);
    }

    const existedUser =User.findOne({
        $or: [{ username }, { email }]
    })
    // console.log("existedUser :", existedUser);

    if(existedUser){
        throw new ApiError("User already exists", 409)
    }

    
    const avatarLocalPath = req.files?.avatar[0]?.path
    // console.log("req.files :", avatarLocalPath);
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400)
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("Failed to upload avatar", 500)
    }

    const user =await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        username : username.toLowerCase(),
        password
    })

    const createdUser =await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError("Something is wrong while registering the user", 500)
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}