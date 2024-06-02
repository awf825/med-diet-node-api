const jwt = require('jsonwebtoken');

module.exports = {
    authenticateWebToken: function (req, res, next) {
        console.log('=== BEGIN AUTHENTICATION MIDDLEWARE ===')
        const authHeader = req.headers.authorization;

        // console.log('process.env @ authenticateWebToken: ', process.env)

        if (process.env.NODE_ENV === 'local') {
            jwt.verify(process.env.DUMMY_TOKEN, process.env.NODE_JWT_SECRET,  (err, user) => {
                if (err) {
                    console.log('jwt verify err LOCAL: ', err)
                    return res.sendStatus(403);
                } else if (new Date(user.exp) < Date.now()) {
                    return res.sendStatus(403);
                } else {
                    req.user = user;
                    console.log('=== END AUTHENTICATION MIDDLEWARE LOCAL ===')
                    next();
                }
            });
        } else if (authHeader) {
            const token = authHeader.split(' ')[1];

            console.log('token @ authHeader: ', token);
            console.log('token type: ', typeof token)

            jwt.verify(token, process.env.NODE_JWT_SECRET, (err, user) => {
                if (err) {
                    console.log('jwt verify err: ', err)
                    return res.sendStatus(403);
                } else if (new Date(user.exp) < Date.now()) {
                    return res.sendStatus(403);
                } else {
                    req.user = user;
                    console.log('=== END AUTHENTICATION MIDDLEWARE ===')
                    next();
                }
            });
        } else {
            console.log('=== END AUTHENTICATION MIDDLEWARE ===')
            res.sendStatus(401);
        }
    }
}