const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const usersSchema = require('../../models/usersSchema');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const middleware = require("../../config/middleware");
const md5 = require('md5');

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
    
    if(!req.body['password']){
        res.status(400).send("Password Required!");
    }else{
        req.body['password'] = md5(req.body['password']);
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
    let queryparams = req.query;
    usersSchema.find(queryparams).then((result)=>{
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



/**
 * Signin 
 * Access only to all anonymous users
 */
 router.post('/signin',(req,res)=>{
    var response = {
        status:'failed',
        data:[],
        message:'Username and Password is required'
    }
    var data = req.body;
    
    if(!data['username']){
        res.status(400).send(response);
    }

    if(!data['password']){
        res.status(400).send(response);
    }else{
        data['password'] = md5(data['password']);
    }

    usersSchema.findOne({'username':data['username'], 'password':data['password']},function (err, result) {
        console.log("err",err);
        console.log("result",result);
        if(result){

            var date = new Date();
            date.setDate(date.getDate() + 8);
            console.dir(result);
            usersSchema.findByIdAndUpdate(result._id,{
                'auth.token': jwt.sign({ role : result['auth']['role'], _id:result._id, ttl: +new Date(date)}, config.token),
                'auth.ttl': +new Date(date)
            },{upsert:false,useFindAndModify:true}).then((updatedResult)=>{
                result['auth']= {
                    role: result['auth']['role'],
                    token: jwt.sign({ role : result['auth']['role'], _id:result._id, ttl: +new Date(date)}, config.token),
                    ttl: +new Date(date)
                }
                
                let response = {
                    status:'success',
                    data:result
                }
                res.send(response);
            },err=>{
                response = {
                    status:'failed',
                    data:[],
                    message:'Something went wrong!'
                }
                console.log(err);
                res.status(400).send(response);
            });
        }else{
            response = {
                status:'failed',
                data:[],
                message:'Invalid username or password!'
            }
            console.log(err);
            res.status(400).send(response);
        }

        
    })
},(err) => {
    let response = {
        status:'failed',
        data:[],
        message:'Failed to fetch data'
    }
    res.status(400).send(response);
})