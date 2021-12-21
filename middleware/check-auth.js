const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS'){
        return next();
    }
    try{
        // Extract token from header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        } 
        const decodedToken = jwt.verify(token, 'secret_dont_share');
        req.useData = {userId: decodedToken.userId};
        next();
    } catch(err){
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
};