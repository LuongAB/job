const express = require("express");
const router = express.Router();
const {
	getAllJobs,
	getJob,
	addJob,
	updateJob,
	deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(addJob);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
