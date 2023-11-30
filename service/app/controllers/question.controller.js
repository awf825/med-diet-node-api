const db = require("../models");
const Question = db.question;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  Question.findAll()
  .then(data => {
      console.log('data: ', data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions"
      });
    });
};