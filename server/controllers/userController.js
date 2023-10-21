const User = require("../models/userModel");

module.exports.login = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user || user === null){
      return res.json({ message: "Incorrect Username", status: false });
    }
    
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, userType } = req.body;
    const serviceType =  "";
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ message: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ message: "Email already used", status: false });

    const user = await User.create({
      email,
      username, 
      userType,
      serviceType,
    });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.selectService = async (req, res, next) => {
  try {
    const { username, value } = req.body;
    const user = await User.findOneAndUpdate({ username },{ serviceType: value })
    const respond = await User.findById(user._id);
    if (respond){
      return res.json({ status: true, respond });
    }
  
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id }, userType:{$ne: "Bot"}, serviceType:{$ne: "Bot"} }).select([
      "email",
      "username",
      "_id",
      "userType",
      "serviceType",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ message: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.getServeiceUser = async (req, res, next) => {
  try {
    const user = await User.findOne({  userType: req.params.key }).select([
      "email",
      "username",
      "_id",
      "userType",
      "serviceType",
    ]);
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
};

