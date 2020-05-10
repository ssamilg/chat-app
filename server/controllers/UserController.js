const JWT = require('jsonwebtoken'); 
const UserModel = require("../models/UserModel");
const { JWT_SECRET } = require("../configuration");

signToken = (user) => {
  return JWT.sign({
    iss: 'ssg',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() +1 ), //+1 day from now
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    const { username, password } = req.value.body;

    //Check is user uniqe
    const foundUser = await UserModel.findOne({ username });

    if (foundUser) {
      return res.status(403).send({ error: 'Username is already in use !' })
    } 

    //Create new user
    const newUser = new UserModel(
      { username,
        password,
        dateCreated: new Date().getTime(),
      });
    await newUser.save();

    //Generate a Token
    const token = signToken(newUser);

    //Respond with token
    res.status(200).json({ token });
  },

  login: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token })
  },

  secret: async (req, res, next) => {
    res.json({ secret: 'resource' })
  },
}