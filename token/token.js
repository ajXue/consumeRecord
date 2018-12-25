const jwt = require("jsonwebtoken");

module.exports = (username) => {
    let token = jwt.sign({username: username}, 'xue', {expiresIn: 60*60*60});
    return token;
}