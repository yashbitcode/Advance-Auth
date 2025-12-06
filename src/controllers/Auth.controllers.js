const User = require("../models/user.models");
const { asyncHandler } = require("../utils/async-handler");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");
const { sendEmail, emailVerificationMailContent } = require("../utils/mail");

const generateTokens = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while token generation");
    }
};

const register = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const haveUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (haveUser)
        throw new ApiError(
            409,
            "User already exist with this username or email"
        );

    const user = new User({
        email,
        username,
        password,
        isEmailVerified: false
    });

    const { accessToken } = await generateTokens(user);
    const { unHashedToken, hashedToken, tokenExpiry } =
        await user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    const savedUser = await user.save();

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailContent: emailVerificationMailContent(
            user?.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    // const createdUser = await User.findById(user._id).select(
    //     "-password -isEmailVerfied -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -refreshToken"
    // );

    // if (!createdUser)
    //     throw new ApiError(500, "Something went wrong while creating the user");

    res.status(201).json(
        new ApiResponse(
            201,
            { user: savedUser },
            "User created and verification email sent successfully!"
        )
    ); 
});

module.exports = {
    register
};