const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.updateUserInfo = (req, res) => {
  const { dob, gender, origin } = req.body;
    User.update({
        origin: origin,
        gender: gender,
        dob: new Date(dob),
        ffq_complete: 1
    }, {
        where: {
            user_id: req.user.user_id
        }
    })
    .then(resp => {
      res.send( { message: "User updated" })
    })
    .catch(err => {
      console.log('err: ', err)
      res.status(500).send( { message: "User could not be updated" } )
    })
}
