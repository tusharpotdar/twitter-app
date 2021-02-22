var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var needle = require("needle");
var CONST = require("./const");
var _ = require("lodash");
const { json } = require("express");
require("dotenv").config();

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./app/build")));
app.use("/", indexRouter);

var messenger;
function streamConnect() {
	const stream = needle.get(CONST.streamURL, {
		headers: {
			"User-Agent": "v2SampleStreamJS",
			Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
		},
		follow_max: 1,
		timeout: 1000 * 60 * 16,
		stream_length: 0,
	});

	stream
		.on("data", (chunk) => {
			console.log(`on data - ${chunk}`);
			if ("Rate limit exceeded".localeCompare(chunk.toString()) === 0) {
				stream.pause();
				setTimeout(() => {
					stream.resume();
				}, 1000 * 60 * 12);
			} else {
				sendMessage(chunk);
				stream.pause();
				setTimeout(() => {
					stream.resume();
				}, 5000);
			}
		})
		.on("err", (error) => {
			console.log(`on error - ${error}`);
			if (error.code === "ETIMEDOUT") {
				sendMessage(error);
			}
		})
		.on("end", (err) => {
			console.log(`connection ended ${err}`);
		});

	return stream;
}

io.on("connection", (socket) => {
	messenger = socket;
	console.log("New client connected !");
	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});

	const sampledStream = streamConnect();
	let timeout = 1;
	sampledStream.on("timeout", () => {
		// Reconnect on error
		console.warn("A connection error occurred. Reconnecting…");
		setTimeout(() => {
			timeout++;
			streamConnect();
		}, 100 ** timeout);
		streamConnect();
	});
});

const sendMessage = (tweets) => {
	try {
		const json = JSON.stringify(JSON.parse(tweets));
		messenger.emit("FromAPI", json);
	} catch (e) {
		messenger.emit("FromAPI", tweets);
	}
};

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({ error: err });
});

module.exports = { app: app, server: server };
