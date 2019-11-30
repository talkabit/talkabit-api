const Joi = require('@hapi/joi');

module.exports = {

	create: {
		body: Joi.object({
			api_url: Joi.string().uri().required(),
			config: Joi.any().allow('config')
		})
	},
}