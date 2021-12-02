const User = require("../models/user")
const { v1: uuidv1 } = require("uuid")
const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")

exports.signup = (req, res) => {
  console.log(req.body)
  let user = new User(req.body)
  console.log(user.password)
  user.salt = uuidv1()
  user.hashed_password = user.encryptPassword(user.password, user)

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err,
      })
    }
    res.json({
      user,
    })
  })
}

exports.signin = (req, res) => {
  const { email, password } = req.body

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "no user found please signup",
      })
    }
    if (!user.authenticate(password, user)) {
      return res.status(401).json({
        err: "email or password is inncorrect",
      })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.cookie("T", token, { expire: new Date() + 99999 })
    const { id, name, email, role } = user
    res.json({ token, user: { id, name, email, role } })
  })
}
