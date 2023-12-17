const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({
      where: {
        email: email,
        password: hashedPassword
      }
    })

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      user = await User.create({
        email: email,
        password: hashedPassword
      })

      if (!user) {
        throw new Error("ERROR");
      } else {
        const token = jwt.sign(
          { 
            email: user.email,
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

exports.appleRegister = async (req, res) => {
  try {
    const { apple_user_id, email } = req.body;
    let token = null;

    const existingUser = await User.findOne({
      where: {
        apple_user_id: apple_user_id,
        email: email,
        auth_method_id: 3
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }); 
    } else if (!email) {
      return res.status(422).json({ message: "Must pass an email." });
    } else {
      console.log(console.log('server side user creation apple_user_id, email: ', apple_user_id, email))
      const hashedPassword = await bcrypt.hash(apple_user_id, 10);
      let newUser = await User.create({
        email: email,
        apple_user_id: apple_user_id,
        password: hashedPassword,
        auth_method_id: 3
      })

      if (!newUser) {
        throw new Error("ERROR");
      } else {
        console.log('newUser: ', newUser)
        token = jwt.sign(
          { 
            email: newUser.email,
            user_id: newUser.user_id
          },
          process.env.NODE_JWT_SECRET
        );
      }
    }

    return token ?
      res.status(201).json({ message: "Successfully registered with Apple ID.", token }) :
      res.status(500).json({ message: "Could not authenticate with Apple ID." });

  } catch (e) {
    console.log('e: ', e)
    return res.status(500).json({ message: "Something went wrong." });
  }
}

exports.appleLogin = async (req, res) => {
  try {
    const { apple_user_id } = req.body;
    let token = null;

    const existingUser = await User.findOne({
      where: {
        apple_user_id: apple_user_id,
        auth_method_id: 3
      }
    })

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(apple_user_id, existingUser.password);
  
      if (passwordMatch) {
        // if the password matches the encrypted incoming apple user,
        token = jwt.sign(
          { 
            email: existingUser.email,
            user_id: existingUser.user_id
          },
          process.env.NODE_JWT_SECRET
        );
      } else {
        return res.status(400).json({ message: "Invalid username or password" });
      }
    }
        
    return token ?
      res.status(201).json({ message: "Successfully logged in with Apple ID.", token }) :
      res.status(500).json({ message: "Could not authenticate with Apple ID." });

  } catch (e) {
    console.log('e: ', e)
    return res.status(500).json({ message: "Something went wrong." });
  }
}