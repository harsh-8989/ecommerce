const mongoose = require("mongoose")
const crypto = require("crypto")
const { v1: uuidv1 } = require("uuid")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: 32,
    },
    hashed_password: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)
userSchema
  .virtual("password")
  .set((password) => {
    userSchema._password = password
    userSchema.salt = uuidv1()
    //console.log(userSchema.methods.encryptPassword(password));
    userSchema.hashed_password = userSchema.methods.encryptPassword(password)
  })
  .get(() => {
    return userSchema._password
  })
// Encrypt the Password
userSchema.methods = {
  authenticate: function (text, user) {
    console.log(
      `user ${user.hashed_password} ${user.encryptPassword(text, user)}`
    )
    return user.hashed_password == user.encryptPassword(text, user)
  },
  encryptPassword: function (password, user) {
    if (!password) {
      return "Doesnt have password"
    }
    try {
      return crypto.createHmac("sha1", user.salt).update(password).digest("hex")
    } catch (e) {
      console.log(typeof password, password)
      console.log(typeof userSchema.salt, userSchema.salt)
      return e
    }
  },
}
module.exports = mongoose.model("User", userSchema)
