require("dotenv").config();
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authentication");

const authRoute = require("./routes/auth");
const jobRoute = require("./routes/jobs");
const connectDB = require("./db/connect");

app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xssClean());

// extra packages
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authMiddleware, jobRoute);

// routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.DB_CONNECT);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
