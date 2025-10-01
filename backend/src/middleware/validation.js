const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username može sadržavati samo slova i brojeve',
        'string.min': 'Username mora imati minimum 3 karaktera',
        'string.max': 'Username može imati maksimum 30 karaktera',
        'any.required': 'Username je obavezan'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email mora biti validan',
        'any.required': 'Email je obavezan'
      }),
    
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Lozinka mora imati minimum 6 karaktera',
        'any.required': 'Lozinka je obavezna'
      }),
    
    avatar: Joi.string()
      .uri()
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Avatar mora biti validan URL'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email mora biti validan',
        'any.required': 'Email je obavezan'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Lozinka je obavezna'
      })
  }),

  updateProfile: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .optional()
      .messages({
        'string.alphanum': 'Username može sadržavati samo slova i brojeve',
        'string.min': 'Username mora imati minimum 3 karaktera',
        'string.max': 'Username može imati maksimum 30 karaktera'
      }),
    
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Email mora biti validan'
      }),
    
    avatar: Joi.string()
      .uri()
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Avatar mora biti validan URL'
      })
  }),

  createMatch: Joi.object({
    player2_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'ID drugog igrača mora biti broj',
        'number.positive': 'ID mora biti pozitivan broj',
        'any.required': 'ID drugog igrača je obavezan'
      }),
    
    winner_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'ID pobednika mora biti broj',
        'number.positive': 'ID mora biti pozitivan broj',
        'any.required': 'ID pobednika je obavezan'
      }),
    
    game_type: Joi.string()
      .valid('casual', 'ranked', 'tournament')
      .default('casual')
      .messages({
        'any.only': 'Tip igre mora biti: casual, ranked ili tournament'
      }),
    
    game_duration: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Trajanje igre mora biti broj',
        'number.positive': 'Trajanje mora biti pozitivno'
      }),
    
    notes: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Napomene mogu imati maksimum 500 karaktera'
      })
  })
};

// Middleware za validaciju
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  schemas,
  validate
};