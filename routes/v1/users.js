const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const schema = require('../../models/schema');
module.exports = router;

// const UsersModel = mongoose.model('Users', usersSchema);

// const Users = new UsersModel.create({
//     username: 'pawanvedak',
//     firstname: 'Pawan',
//     lastname: 'Vedak',
//     mobile_number: 9167205669,
// });

router.post('/create-user', (req, res) => {
    console.log("create user",req.body);

    schema.usersSchema;
    res.send(req.body);
});