const db = require("../models");
const Submission = db.question_answer_submission;
const Answer = db.question_answers;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.submit = async (req, res) => {
    const { answers, form_id } = req.body;

    try {
        const insertedSubmission = await Submission.create({
            user_id: req.user.user_id,
            form_id: form_id,
            score: answers.reduce((acc, curr) => { return acc + curr.answer_score }, 0),
            completed_at: db.sequelize.fn('NOW')
        })

        if (insertedSubmission) {
            await Answer.bulkCreate(
                answers.map(s => {
                    return {
                        answer_score: s.answer_score,
                        question_id: s.question_id,
                        question_answer_submission_id: insertedSubmission.submission_id
                    }
                })
            )

            res.json({
                submission: insertedSubmission,
                success: true
            })
            
        } else {
            console.log('error: ', error)
            throw new Error("Submission could not be created")
        }

    } catch (err) {
        res.json({ message: err.message, success: false })
    }
};

exports.getAll = async (req, res) => {
    Submission.scope('withAnswers').findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log('err: ', err)
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving submissions."
        });
    });
}

exports.getAnswersByCategory = async (req, res) => {
    try {
        const result = await sequelize.query(
            'select count(qa.answer_score) as answer_number, SUM(qa.answer_score) as score, qc.category_display_name, qc.question_category_id, qc.display_hex_code from question_answer_submissions qas join question_answers qa ON qa.question_answer_submission_id = qas.submission_id JOIN questions q ON q.question_id = qa.question_id join question_categories qc on qc.question_category_id = q.category_id where qc.question_category_id != 9 and qas.user_id = :user_id group by qc.question_category_id', 
            { 
                replacements: {
                    // user_id: req.user.user_id
                    user_id: 3
                }
            }
        )

        res.send(result[0]);
    } catch (err) {
        console.log('err: ', err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving questions"
        });
    }
};