const db = require("../models");
const Submission = db.question_answer_submission;
const Answer = db.question_answers;
const User = db.user;
const Op = db.Sequelize.Op;

exports.submit = async (req, res) => {
    const { answers, dob, gender } = req.body;

    try {
        const insertedSubmission = await Submission.create({
            // user_id: req.user.user_id,
            user_id: 1, // hardcoding for now as I expose these routes
            form_id: answers[0].form_id,
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

            await User.update({
                gender: gender,
                dob: new Date(dob),
                ffq_complete: 1
            }, {
                where: {
                    user_id: 1 // again, hardcoding 1 for now
                }
            })

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
    // Submission.scope('withAnswers').findAll({
    //     where: {
    //         user_id: req.user.user_id
    //     }
    // })
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