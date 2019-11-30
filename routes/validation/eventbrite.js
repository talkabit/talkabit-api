const Joi = require('@hapi/joi');

module.exports = {

	create: {
		body: Joi.object({
			apiUrl: Joi.string().uri().required()
		})
	},
}