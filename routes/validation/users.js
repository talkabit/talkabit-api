const Joi = require('@hapi/joi');

module.exports = {

	get: {
		params: Joi.object({
			userUuid: Joi.string().guid({
			    version: [
			        'uuidv1'
			    ]
			}).required()
		})
	},

	register: {
		body: Joi.object({
			email: Joi.string().email().required(),
			name: Joi.string(),
			cv: Joi.string().uri(),
			//Minimum eight characters, at least one uppercase letter, one lowercase letter, one number
			password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required(),
			orderId: Joi.number().required()
		})
	},

	login: {
		body: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required()
		})
	},


	loginAdmin: {
		body: Joi.object({
			username: Joi.string().required(),
			password: Joi.string().required()
		})
	},

	update: {
		params: Joi.object({
			userUuid: Joi.string().guid({
				    version: [
				        'uuidv1'
				    ]
				}).required()
		}),

		body: Joi.object({
			cv: Joi.string().uri()
		})
	},

	

	addAchievement: {
		params: Joi.object({
				userUuid: Joi.string().guid({
				    version: [
				        'uuidv1'
				    ]
				}).required()
		}),
		
		body: Joi.object({
				achievementUuid: Joi.string().required()
			})
	},

	addEvent: {
		params: Joi.object({
			userUuid: Joi.string().guid({
			    version: [
			        'uuidv1'
			    ]
			}).required()
		}),
		body: Joi.object({
			eventUuid: Joi.string().guid({
			    version: [
			        'uuidv1'
			    ]
			}).required()
		})
	}
}