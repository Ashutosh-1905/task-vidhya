const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.createUser = async (req, res) => {
  try {
    let { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match" 
      });
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(401).json({ 
        success: false, 
        message: "You already have an account, please login" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    let token = generateToken(user);
    res.cookie("token", token);

    res.status(201).json({ 
      success: true, 
      message: "User created successfully", 
      user 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.getAllUser = async (req, res) => {
  try {
    let user = await userModel.find();
    res.json({ success: true, message: "here is your all users", user });
  } catch (error) {
    res.json("something went wrong");
  }
};

module.exports.getUser = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id });
    res.json({ success: true, message: "your user details", user });
  } catch (error) {
    res.json({ success: false, message: "something went wrong" });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json({
      success: true,
      message: "user updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.json("something went wrong");
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    let deletedUser = await userModel.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json("something went wrong");
  }
};

module.exports.loginUser = async (req, res) => {
    try {
      let { email, password} = req.body;
      let user = await userModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }
      const matchPassword = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) reject(err);
          resolve(result);
        });
      });
  
      if (matchPassword) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.json({ success: true, message: "You are logged in successfully" });
      } else {
        res.status(400).json({ success: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
module.exports.logoutUser = async (req, res) => {
  try {
    
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
