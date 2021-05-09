const jwt = require('jsonwebtoken');
const config = require('./config');
const mongoose = require('mongoose');
const usersSchema = require('../models/usersSchema');

//Checking authorizatoin from token and role
const authGard = (allowed_roles) => {
    return (req, res, next) => {
        if (!Array.isArray(allowed_roles)) {
            throw "Roles should be array";
        }
        if (req.headers.authorization) {

            /**
             * Fetching data from token
             * Returns { role, ttl }
             */
            let authData = jwt.verify(req.headers.authorization.split(" ")[1], config.token);
            var currentDate = +new Date();
            if (authData['role'] && authData['role'].length > 0 && authData['ttl'] >=  currentDate) {
                var flag = 0;
                for (let i = 0; i < authData['role'].length; i++) {

                    if (allowed_roles.indexOf(authData['role'][i]) != -1) {
                        flag = 1;
                    }

                }
                if (flag == 1) {

                    //Check if user id exists
                    var filter = {
                        _id:  authData['_id'],
                        'auth.token' : req.headers.authorization.split(" ")[1]
                    };
                    
                    usersSchema.findOne(filter, function (err, doc) {
                        if (err) {
                            res.status(401).send("Unauthorized User");
                        } else {
                            if (doc) {
                                next();
                            } else {
                                res.status(401).send("Unauthorized User");
                            }
                        }

                    });

                } else {
                    res.status(401).send("Unauthorized User");
                }
            } else {
                res.status(401).send("Unauthorized User");
            }
        } else {
            res.status(401).send("Unauthorized User");
        }
    }
}

module.exports = { authGard };