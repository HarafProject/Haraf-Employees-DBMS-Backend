const Joi = require('joi');
exports.validate = (validator) => {
    return (req, res, next) => {
        const { error } = validator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    }
};

exports.loginValidator = function (req) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required(),
    })
    return schema.validate(req);
};

exports.validateUser = (req) => {
    const schema = Joi.object({
      firstname: Joi.string().min(2).max(250).required(),
      surname: Joi.string().min(2).max(250).required(),
      phone: Joi.string()
        .pattern(new RegExp(/[1-9]\d{1,14}$/))
        .message('Please enter a valid phone number in international format')
        .required(),
      email: Joi.string().email().min(5).max(255).required(),
      lga: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .message('Please enter a valid LGA ID')
      .required(),
      password: Joi.string().min(5).max(255).required(),
      zone: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .message('Please enter a valid Zone ID')
      .required(),
    });
    return schema.validate(req);
  };

  exports.validateEmployee = (req) => {
    const schema = Joi.object({
      fullName: Joi.string().min(2).max(250).required(),
      phone: Joi.string().min(2).max(250).required(),
      accountNumber: Joi.string().min(2).max(250).required(),
      bankName: Joi.string().min(2).max(250).required(),
      ward: Joi.string().min(2).max(255).required(),
      address: Joi.string().min(2).max(250).required(),
      age: Joi.string().min(2).max(250).required(),
      workTypology: Joi.string().min(2).max(250),
      maritalStatus: Joi.string().min(2).max(250),
      specialAbility: Joi.string().min(2).max(250),
      householdSize: Joi.string().min(2).max(250),
      householdHead: Joi.string().min(2).max(250),
      gender: Joi.string().min(2).max(250),
    });
    return schema.validate(req);
  };