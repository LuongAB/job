const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide name"],
		minLength: 3,
		maxLength: 50,
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		unique: true,
		match: [
			/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
			"Please provide valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		minLength: 6,
	},
});

UserSchema.pre("save", async function () {
	const salt = await bcryptjs.genSalt(10);
	this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.getName = function () {
	return this.name;
};

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userId: this._id, name: this.name },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE_TIME,
		}
	);
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
	const isMatch = await bcryptjs.compare(canditatePassword, this.password);
	return isMatch;
};

module.exports = mongoose.model("user", UserSchema);
