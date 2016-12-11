const jwt = require('jsonwebtoken');

const validate = function(decoded, request, callback) {
    if(!people[decoded.user]) {
        return callback(null, false);
    }
    else {
        return callback(null, true);
    }
};

const createToken = function(user) {
    let token = jwt.sign({ user: user.email }, 'NeverShareYourSecret');
    return token;
}

module.exports = {
    validate: validate,
    createToken: createToken
}
