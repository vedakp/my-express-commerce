const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const usersSchema = require('../../models/usersSchema');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const middleware = require("../../config/middleware")

module.exports = router;

/**
 * Create Users 
 * Access Anonymous
 */
router.post('/create-user',(req, res) => {
    console.log("create user",req.body);

    if(!req.body['username']){
        res.status(400).send("Username Required!");
    }

    if(!req.body['first_name']){
        res.status(400).send("First name Required!");
    }

    if(!req.body['last_name']){
        res.status(400).send("Last Name Required!");
    }

    if(!req.body['phone_number']){
        res.status(400).send("Phone no. Required!");
    }

    if(!req.body['roles']){
        res.status(400).send("User Role Required!");
    }

    var date = new Date();
    date.setDate(date.getDate() + 8);

    req.body['_id'] = new mongoose.Types.ObjectId().toHexString();

    usersSchema.create(req.body).then((result)=>{

        //Update token and usr id init
        usersSchema.findByIdAndUpdate(result._id,{
            auth: {
                role: req.body['roles'],
                token: jwt.sign({ role : req.body['roles'], _id:result._id, ttl: +new Date(date)}, config.token),
                ttl: +new Date(date)            }
        },{upsert:false,useFindAndModify:true}).then((updatedResult)=>{
            result['auth']= {
                role: req.body['roles'],
                token: jwt.sign({ role : req.body['roles'], _id:result._id, ttl: +new Date(date)}, config.token),
                ttl: +new Date(date)
            }
            // console.log("oncreate user",result);
            res.send(result);
        },err=>{
            console.log(err);
            res.status(400).send(err);
        });
    },err=>{
        console.log(err);
        res.status(400).send(err);
    });
});



/**
 * Get Users 
 * Access only to admin
 */
router.get('/get-users', middleware.authGard(['admin']),function(req,res){
    usersSchema.find({}).then((result)=>{
        let response = {
            status:'success',
            data:result
        }
        res.send(response);
    })
},(req,res) => {
    let response = {
        status:'failed',
        data:[],
        message:'Failed to fetch data'
    }
    res.status(400).send(response);
})