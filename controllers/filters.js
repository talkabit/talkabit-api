module.exports = {
	usr: {
		userFilter:  "-__v -_id -qr -cv -password -banned -scanned",
		achievementFilter: "-__v -_id -createdAt -updatedAt -users -qr",
		eventFilter: "-__v -_id -createdAt -updatedAt -users",
	},

	adm: {
		userFilter:  "-__v -_id -password",
		achievementFilter: "-__v -_id",
		eventFilter: "-__v -_id"
	}
}