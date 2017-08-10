
let {User} = require("./../models/user");

let authenticate = (req, res, next) => {
    let token = req.header("x-auth"); //fetches the token based on a specific key

    User.findByToken(token).then((user) => {
        if (!user) { //valid token, but no user
            return Promise.reject(); //will send us down to the .catch below
        }
        //adding these properties to req instead of res, because we are saying - "Here's the data for the user that made this request". could also just set this to res, but this req is sent through to server.js
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(); //will make it so the code doesn't run in server.js
    });
};

module.exports = {authenticate};