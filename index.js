require("dotenv").config();
const NodeRSA = require('node-rsa');
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./controllers/error");
const db = require("./models");
const userRoutes = require("./routes/users");
const eventsRoutes = require("./routes/events");
const achievementsRoutes = require("./routes/achievements");
const eventBriteRoutes = require("./routes/eventbrite")

const PORT = process.env.PORT || 3000;

init();

async function init(){
	try{
		await generateServerKey();
	}
	catch(err){
		console.log(`${err}\n\nShutting down...`);
		return;
	}

	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use("/api/users", userRoutes);
	app.use("/api/achievements", achievementsRoutes);
	app.use("/api/events", eventsRoutes);
	app.use("/api/eventbrite", eventBriteRoutes);

	app.use(function (req, res, next) {
	    let err = new Error("Not Found");
	    err.status = 404;
	    next(err);
	});

	app.use(errorHandler);

	app.listen(PORT, function () {
	    console.log(`Server is starting on port ${PORT}`);
	});
}

async function generateServerKey(){
	let key = await db.Keys.findOne();

	if(key !== null)
		return;

	key = new NodeRSA({b: 512});
	await db.Keys.create( {
		public: key.exportKey('public'),
		private: key.exportKey('private')
	})
}
