module.exports = {
	usr: {
		userFilter:  "-__v -_id -password -banned",
		achievementFilter: "-__v -_id -createdAt -updatedAt -users",
		eventFilter: "-__v -_id -createdAt -updatedAt -users",
	},

	adm: {
		userFilter:  "-__v -_id -password",
		achievementFilter: "-__v -_id",
		eventFilter: "-__v -_id"
	}
}