const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors'); // since we have index.js in the errors folder, we don't have to specify the path

const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1]; // 'Bearer token'

    try {
        const payload = jwt.verify(token, process.env.SECRET);

        // const user = User.findById(payload.id).select('-password'); // unselecting the password
        // req.user = user;
        // or
        req.user = { id: payload.id, name: payload.name } // we set the property on the request
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth;