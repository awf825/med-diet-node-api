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

        if (insertedSubmission.submission_id) {
            await Answer.bulkCreate(
                answers.map(s => {
                    return {
                        answer_score: s.answer_score,
                        question_id: s.question_id,
                        question_answer_submission_id: insertedSubmission.submission_id
                    }
                })
            )

            if (form_id === 1) {
                const ffqBaseline = await sequelize.query(
                    `select sum((qa.answer_score * fdm.grams_per_recommended_serving)) as 'sum_units', \
                    fdm.daily_question_id,  dt.amount, dt.indicator, \
                    if(dt.indicator > 0, \
                    sum((qa.answer_score * fdm.grams_per_recommended_serving)) > dt.amount, \
                    sum((qa.answer_score * fdm.grams_per_recommended_serving)) < dt.amount \
                    ) as success \
                    from question_answers qa \
                    join questions q on q.question_id = qa.question_id \
                    join ffq_daily_map fdm on fdm.ffq_question_id = q.question_id \
                    join daily_thresholds dt on dt.question_id = fdm.daily_question_id \
                    where qa.question_answer_submission_id = :submission_id \
                    group by fdm.daily_question_id  \
                    order by fdm.daily_question_id;
                    `,
                    { 
                        replacements: {
                            submission_id: insertedSubmission?.submission_id
                        }
                    }
                )
        
                const ffqScoreResults = ffqBaseline[0];
        
                const newDailySubmission = await Submission.create({
                    user_id: req.user.user_id,
                    form_id: 2,
                    score: ffqScoreResults.reduce((acc, curr) => { return acc + curr.success }, 0),
                    completed_at: db.sequelize.fn('NOW')
                })
        
                if (newDailySubmission) {
                    await Answer.bulkCreate(
                        ffqScoreResults.map(s => {
                            return {
                                answer_score: s.success,
                                question_id: s.daily_question_id,
                                question_answer_submission_id: newDailySubmission.submission_id
                            }
                        })
                    )
                } else {
                    console.error('could not create this entry for d-25')
                }
            }


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

exports.getDashboard = async (req, res) => {
    try {
        const answersByCategory = await sequelize.query(
            'select count(qa.answer_score) as answer_number, \
            SUM(qa.answer_score) as score, qc.category_display_name, qc.question_category_id, qc.display_hex_code \
            from question_answer_submissions qas \
            join question_answers qa ON qa.question_answer_submission_id = qas.submission_id \
            JOIN questions q ON q.question_id = qa.question_id \
            join question_categories qc on qc.question_category_id = q.category_id \
            where qc.question_category_id != 9 and qas.user_id = :user_id \
            group by qc.question_category_id', 
            { 
                replacements: {
                    user_id: req.user.user_id
                }
            }
        )
        
        const ffq = await Submission.findOne({
            where: {
                user_id: req.user.user_id,
                form_id: 1
            }
        })

        const submissionId = await ffq.get('submission_id')

        const ffqBaseline = await sequelize.query(
            `select sum((qa.answer_score * fdm.grams_per_recommended_serving)) as 'sum_units', \
            fdm.daily_question_id,  dt.amount, dt.indicator, dt.formula, \
            qq.question_text, qq.field_code, qc.question_category_id  \
            from question_answers qa \
            join questions q on q.question_id = qa.question_id \
            join question_categories qc on qc.question_category_id = q.category_id \
            join ffq_daily_map fdm on fdm.ffq_question_id = q.question_id \
            join questions qq on qq.question_id = fdm.daily_question_id
            join daily_thresholds dt on dt.question_id = fdm.daily_question_id \
            where qa.question_answer_submission_id = :submission_id \
            group by fdm.daily_question_id \
            order by fdm.daily_question_id;
            `,
            { 
                replacements: {
                    submission_id: submissionId
                }
            }
        )

        const ffqObjArr = ffqBaseline[0]

        const ffqResponse = ffqObjArr.map(x => {
            let evaluation;
            let success;
            const formula = x.formula;
            if (formula && formula !== 'OR') {
                replacedWithSum = formula.replace('S', String(x.sum_units))
                evaluation = eval(replacedWithSum)
            }

            if (x.indicator > 0) {
                success = evaluation ? evaluation > x.amount : x.sum_units > x.amount
            } else {
                success = evaluation ? evaluation < x.amount : x.sum_units < x.amount
            }

            return {
                ...x,
                success: success
            }
        })

        res.send({
            answersByCategory: answersByCategory[0],
            ffqResponse: ffqResponse
        });
    } catch (err) {
        console.log('err: ', err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving questions"
        });
    }
};

exports.getLatestSubmissionAndStreaks = async (req, res) => {
    const longestConsecutive = (nums) => {
        const numSet = new Set(nums);
        let longestStreak = 0;
        for (let num of numSet) {
          if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;
            while (numSet.has(currentNum + 1)) {
              currentNum += 1;
              currentStreak += 1;
            }
            longestStreak = Math.max(longestStreak, currentStreak);
          }
        }
        return longestStreak;
      };

    try {
        // let currentStreak = 0;
        let longestStreak = 0;
        let latest;
        const submissions = await Submission.findAll({
            where: {
                user_id: 1
            },
            order: [ [ 'completed_at', 'DESC' ]]
        })

        latest = submissions[0]

        const completionsDayOfEpoch = submissions.reverse().map(s => {
            // this converts unix timestamp to days, by steps of 1
            return Math.floor(+new Date(s.completed_at) / 86400000)
        })

        const completionsDayOfEpochSet = new Set(completionsDayOfEpoch)

        for (let day of completionsDayOfEpochSet) {
            if (!completionsDayOfEpochSet.has(day - 1)) {
                let currentDay = day;
                let currentStreak = 1;
                while (completionsDayOfEpochSet.has(currentDay + 1)) {
                    currentDay += 1;
                    currentStreak += 1;
                }
                longestStreak = Math.max(longestStreak, currentStreak);
            }
        }

        res.send({
            latest: latest,
            longestStreak: longestStreak
            // currentStreak: currentStreak
        })
    } catch (err) {
        res.json({ message: err.message, success: false })
    }
}