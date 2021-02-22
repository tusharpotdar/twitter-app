var express = require("express");
var router = express.Router();
var path = require("path");
const rqp = require("request-promise");

router.get("/trends", function (req, res, next) {
	rqp
		.get("https://api.twitter.com/1.1/trends/place.json?id=20070458", {
			headers: {
				"User-Agent": "v2SampleStreamJS",
				Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
			},
			timeout: 2000,
		})
		.then((resp) => {
			const data = JSON.parse(resp);
			const trends = data[0].trends;
			res.json(trends);
		})
		.catch((err) => {
			res.status(err.statusCode);
			res.json(JSON.parse(err.error));
		});
});

module.exports = router;
