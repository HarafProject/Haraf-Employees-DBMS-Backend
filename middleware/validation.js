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
    phone: Joi.string().min(11)
    .message('Please enter a valid phone number')
    .required(),
    accountNumber: Joi.string().pattern(/^\d{10}$/)
      .message('Please enter a valid bank account number')
      .required(),
    bankName: Joi.string().min(2).max(250).required(),
    zone: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .message('Please enter a valid Zone ID')
      .required(),
    lga: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .message('Please enter a valid lga ID')
      .required(),
    ward: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .message('Please enter a valid Ward ID')
      .required(),
    address: Joi.string().min(2).max(250).required(),
    age: Joi.string().min(2).max(250).required(),
    workTypology: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .message('Please enter a valid Typology ID')
      .required(),
    maritalStatus: Joi.string().min(2).max(250),
    specialDisability: Joi.string().min(2).max(250),
    householdSize: Joi.string().min(1).max(250),
    householdHead: Joi.string().min(2).max(250),
    sex: Joi.string().min(2).max(250),
  });
  return schema.validate(req);
};


exports.validateAccount = (req) => {

  const schema = Joi.object({
    accountNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .message('Please enter a valid bank account number')
      .required(),
    bankCode: Joi.string()
      .min(1)
      .required(),
    bankName: Joi.string()
      .min(2)
      .max(1024)
      .required(),

  })
  return schema.validate(req);
}

exports.supervisorRequest = (req) => {

  const schema = Joi.object({
    reason: Joi.string()
      .min(1)
      .required(),

  })
  return schema.validate(req);
}
