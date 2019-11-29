const Joi = require('@hapi/joi');

module.exports = {

	create: {
		body: Joi.object({
			type: Joi.string().required(),
			name: Joi.string().required()
		})
	}
}