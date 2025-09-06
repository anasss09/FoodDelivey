import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import uploadOnCloudinary from "../utils/uploadCloudinary.js";
import jwt from 'jsonwebtoken'

export const postSignup = ErrorWrapper(async (req, res, next) => {
	const { username, email, password, name } = req.body;
	const incomingField = Object.keys(req.body);
	const requiredField = ["username", "email", "password", "name"];
	const missingField = requiredField.filter(
		(field) => !incomingField.includes(field)
	);

	if (missingField.length > 0) {
		throw new ErrorHandler(401, `${missingField.join(",")} is missing`);
	}

	const existingUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existingUser) {
		throw new ErrorHandler(401, "User Already Exist");
	}

	let CloudinaryResponse;
	try {
		CloudinaryResponse = await uploadOnCloudinary(req.file.path);
	} catch (error) {
		throw new ErrorHandler(500, `While Cloudinary ${error.message}`);
	}

	try {
		const user = await User.create({
			username,
			password,
			email,
			name,
			image: CloudinaryResponse.secure_url,
		});

		const newUser = await User.findOne({
			_id: user._id,
		}).select("-password");

		res.status(200).json({
			message: "Successful",
			user: newUser,
		});
	} catch (error) {
		throw new ErrorHandler(500, `While Creating user in DB ${error.message}`);
	}
});

const generteAccessTokenAndgenerteRefreshToken = async (userId) => {
	try {
		let user = await User.findOne({
			_id: userId,
		});		

		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();
		

		return {
			accessToken,
			refreshToken
		};
	} catch (error) {
		throw new ErrorHandler(
			500,
			`Error while generating access token and refresh token ${error.message}`
		);
	}
};


export const postLogin = ErrorWrapper(async (req, res, next) => {
	const { username, password, email } = req.body;

	if (!username && !email) {
		throw new ErrorHandler(401, `Enter username or password !!`);
	}
	if (!password) {
		throw new ErrorHandler(401, "Enter password ");
	}

	let user = await User.findOne({
		$or: [{ username }, { email }]
	});

	if (!user) {
		throw new ErrorHandler(401, "User not found");
	}

	const passwordMatch = await user.isPasswordCorrect(password);
	if (!passwordMatch) {
		throw new ErrorHandler(401, "Password Incorrect");
	}

	const { accessToken, refreshToken } = await generteAccessTokenAndgenerteRefreshToken(user._id);
	
	user.refreshToken = refreshToken
	await user.save()	
	
	user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("-password -refreshToken")

	res.status(200)
		.cookie(`AccessToken`, accessToken)
		.cookie(`RefreshToken`, refreshToken)
		.json({
			success: true,
			message: "Login Successfull",
			user
		});
});

export const getLogout = ErrorWrapper(async (req, res, next) => {
	try {
		res.cookie('AccessToken', process.env.ACCESS_TOKEN_KEY, {
			httpOnly: true,
			maxAge: 0
		})
		
		res.cookie('RefreshToken', process.env.ACCESS_TOKEN_KEY, {
			httpOnly: true,
			maxAge: 0
		})
		
		res.status(200).json({
			message: 'Logout SuccessFull'
		})
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message)
	}
})