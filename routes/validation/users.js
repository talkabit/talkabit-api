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

	create: {
		body: Joi.object({
			eventBriteUrl: Joi.string().required()
		})
	},

	register: {
		body: Joi.object({
			email: Joi.string().email().required(),
			name: Joi.string().required(),
			username: Joi.string().required(),
			cv: Joi.string().required(),
			//Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
			password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
			ticketId: Joi.string().required()
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
			id: Joi.number().integer().min(1).required()
		}),

		body: Joi.object({
			email: Joi.string().email(),
			password: Joi.string().min(5),
			admin: Joi.boolean(),
		}).or('email','password','admin')
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
				achievementUuid: Joi.string().guid({
				    version: [
				        'uuidv1'
				    ]
				}).required()
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