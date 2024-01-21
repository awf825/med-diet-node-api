const db = require("../models");
const Question = db.question;
const Op = db.Sequelize.Op;

exports.findAllFFQ = async (req, res) => {
   Question.scope('withFieldTypeAndAnswerOptions').findAll({
    where: { form_id: 1 }
   })
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