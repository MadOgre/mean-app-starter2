"use strict";
let express = require("express");
let app = express();
let bp = require("body-parser");
let init = require("./init");
const PORT = process.env.NODE_PORT || 3000;

require("./db");

app.use(express.static("public"));

app.use(bp.json());

require("./routes")(app);

app.get("*", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.use((err, req, res, next) => {
	if (app.get("env") !== "production") {
		return res.status(err.code || 500).json({
			error: err.message
		});
	} else {
		return res.status(500).json({
			error: "(500) Internal Server Error"
		});
	}
	return next(err);
});

init().
then(() => {
	app.listen(PORT, () => {
		console.log(`Server active on port ${PORT}`);
	});	
})
