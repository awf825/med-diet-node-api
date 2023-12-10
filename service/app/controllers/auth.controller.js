const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({
      where: {
        username: username,
        password: hashedPassword
      }
    })

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      user = await User.create({
        username: username,
        password: hashedPassword
      })

      if (!user) {
        throw new Error("ERROR");
      } else {
        const token = jwt.sign(
          { 
            username: user.username,
            user_id: user.user_id
          },
          process.env.NODE_JWT_SECRET
        );
        return res
          .status(201)
          .json({ message: "User registered successfully", token });
      }
    }

  } catch (e) {
    console.log('e: ', e)
    return res.status(500).json({ message: "Something went wrong." });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { 
        email: user.email,
        user_id: user.user_id
      },
      process.env.NODE_JWT_SECRET
    );

    res.json({ message: "Logged in successfully", token });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}

exports.googleLogin = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { 
        email: user.email,
        user_id: user.user_id
      },
      process.env.NODE_JWT_SECRET
    );

    res.json({ message: "Logged in successfully", token });
  } catch (e) {
    console.log('e: ', e)
    return res.status(500).json({ message: "Something went wrong." });
  }
}