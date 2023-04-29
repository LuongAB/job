const JobModel = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
	const jobs = await JobModel.find({});
	res.json({ data: jobs });
};

const getJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;
	const job = await JobModel.findOne({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) throw new NotFoundError("Not found job");
	res.json(job);
};

const addJob = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const job = await JobModel.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req;

	if (!company || !position)
		throw new BadRequestError("Company or Position is missing");

	const job = await JobModel.findOneAndUpdate(
		{
			_id: jobId,
			createdBy: userId,
		},
		req.body,
		{ new: true, runValidators: true }
	);

	if (!job) throw new NotFoundError("Not found job");

	res.json(job);
};

const deleteJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await JobModel.findOneAndRemove({
		_id: jobId,
		createdBy: userId,
	});

	if (!job) throw new NotFoundError("Not found job with id: " + jobId);
	res.send();
};

module.exports = { getAllJobs, getJob, addJob, updateJob, deleteJob };
