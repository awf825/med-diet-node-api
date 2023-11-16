const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
  try {
    const { username, password } = req.body;
 
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = { username, password: hashedPassword };
    const newUser = { username, password };
    
    // users.push(newUser);
 
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (e) {
    console.log(e.message);
  }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
     
        const user = await User.findOne({
            where: {
                username: 'awf825'
            }
        })
     
        // if (!user) {
        //   return res.status(400).json({ message: "Invalid username or password" });
        // }
     
        // const passwordMatch = await bcrypt.compare(password, user.password);
     
        // if (!passwordMatch) {
        //   return res.status(400).json({ message: "Invalid username or password" });
        // }
     
        const token = jwt.sign(
          { username: user.username },
          process.env.NODE_JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
     
        res.json({ message: "Logged in successfully", token });
      } catch (e) {
        console.log(e.message);
      }
}