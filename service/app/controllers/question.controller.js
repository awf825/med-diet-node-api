const db = require("../models");
const Question = db.questions;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  Question.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions"
      });
    });
};