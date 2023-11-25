const db = require("../models");
const Submission = db.submissions;
const Answer = db.answers;
const Op = db.Sequelize.Op;

exports.submit = async (req, res) => {
    console.log('req.body: ', req.body)
    const submission = req.body;

    console.log('score: ', submission.reduce((acc, curr) => { return acc + curr.answer_score }, 0))

    try {
        const insertedSubmission = await Submission.create({
            score: submission.reduce((acc, curr) => { return acc + curr.answer_score }, 0),
            completed_at: db.sequelize.fn('NOW')
        })

        if (insertedSubmission) {
            await Answer.bulkCreate(
                submission.map(
                    s => {
                        return {
                            ...s,
                            question_answer_submission_id: insertedSubmission.submission_id
                        }
                    }
                )
            )
            res.json({
                submission: insertedSubmission,
                success: true
            })
        } else {
            throw new Error("Submission could not be created")
        }
    } catch (err) {
        res.json({ message: err.message, success: false })
    }
};

exports.getAll = async (req, res) => {
    Submission.findAll()
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