const db = require("../models");
const Question = db.question;
const Op = db.Sequelize.Op;

/*
  Gather all questions with their options for FFQ form.
*/

exports.findAllFFQ = async (req, res) => {
   Question.scope('withFieldTypeAndAnswerOptions').findAll({
    where: { form_id: 1 }
   })
    .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log('err: ', err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving questions"
        });
      });
};

/*
  Gather all questions with their options for Weekly survey form
*/

exports.findAllWeekly = async (req, res) => {
  Question.scope('withFieldTypeAndAnswerOptions').findAll({
   where: { form_id: 2 }
  })
   .then(data => {
       res.send(data);
     })
     .catch(err => {
       console.log('err: ', err)
       res.status(500).send({
         message:
           err.message || "Some error occurred while retrieving questions"
       });
     });
};