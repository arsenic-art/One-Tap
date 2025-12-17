const jwt = require("jsonwebtoken");

const generateToken = (Id) => {
    return jwt.sign({ id: Id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

module.exports = generateToken;