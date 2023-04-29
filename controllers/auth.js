const UserModel = require("../models/User");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
	const user = await UserModel.create(req.body);
	const token = user.createJWT();

	res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("Please provide email and password");
	}
	const user = await UserModel.findOne({ email });
	if (!user) throw new UnauthenticatedError("Invalid Credentials");

	const isPasswordCorrect = await user.comparePassword(password);

	if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Password");

	const token = user.createJWT();
	res.status(StatusCodes.OK).json({ user, token });
};

module.exports = { register, login };
