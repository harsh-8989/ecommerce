exports.userSignupValidator = (req, res, next) => {
  req.check("name", "name is required").notEmpty()
  req
    .check("email", "email must be b/w 3 to 32 charators")
    .matches(/.+\@.+\..+/)
    .withMessage("emil must contain @")
    .isLength({
      min: 4,
      max: 32,
    })
  req.check("email", "email is required").notEmpty()
  req.check("password", "Password is required").notEmpty()
  req
    .check("password")
    .isLength({
      min: 6,
      max: 32,
    })
    .withMessage("password must be b/w 6 to 32 charactor")
    .matches(/\d/)
    .withMessage("password must contain a number")

  const error = req.validationErrors()
  if (error) {
    const first = error.map((e) => e.msg)[0]
    return res.status(400).json({ error: first })
  }
  next()
}
