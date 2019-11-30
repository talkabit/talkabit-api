const Joi = require('@hapi/joi');

module.exports = {

	create: {
		body: Joi.object({
			type: Joi.string().required(),
			name: Joi.string().required(),
			limit: Joi.number().min(1)
		})
	}
}