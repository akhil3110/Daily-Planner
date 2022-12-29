const express = require("express")
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { genSalt } = require("bcryptjs");
var jwt = require('jsonwebtoken');
const { findOne } = require("../models/User");
const fetchuser = require("../middleware/fetchUser");

const JWT_SECERET = "Akhilisagoodb$oy"

//Route 1:create a User using: "/api/auth/createuser" dosen't require auth
router.post('/createuser', [
    body('name',"Enter a valid name").isLength({ min: 3 }),
    body('email',"Enater a vlaid email").isEmail(),
    body('password',"Password mustbe atleast 5 character").isLength({ min: 5 }),
], async (req,res)=>{

    // If there are errors,return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        let success = false;
        // check wether the user with this email  exists already
        let user = await User.findOne({email: req.body.email});

        if(user){
            res.status(400).json({success,error: 'Sorry a user with this Email Already Exist'})
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken= jwt.sign(data,JWT_SECERET)
        console.log(authToken)
        // res.json(user);
        success = true;
        res.json({success,authToken})

    }catch(error){
        console.log(error.message)
        res.status(500).send('Internal Server Occured')
    }
})

//Route 2: Authenticate a user a User using: "/api/auth/login" no login required  
router.post('/login', [
    body('email',"Enater a vlaid email").isEmail(),
    body('password',"Password can not be blank").exists(),
], async (req,res)=>{
     // If there are errors,return bad requests and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const {email,password} = req.body;
     
    try{
        let success = false;
        let user =await User.findOne({email})
        
        if(!user){
            return res.status(400).json({success , 'error': 'Please try to login with correct credentials'});
        }

        const passwordCompare = await bcrypt.compare(password,user.password)

        if(!passwordCompare){

            return res.status(400).json({success, 'error': 'Please try to login with correct credentials'});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken= jwt.sign(data,JWT_SECERET)
        
        // res.json(user);
        success=true;
        res.json({success,authToken})

    }
     catch(error){
        console.log(error.message)
        res.status(500).send('Internal Server Occured')
     }

})

//Route 3:Get User Detail: "/api/auth/getuser" login required 
router.post('/getuser',fetchuser, async (req,res)=>{
    try {
        const userId =req.user.id;
        const user = await User.findById(userId).select('-password')
        res.send(user);
    } catch (error) {
        console.log(error.message)
            res.status(500).send('Internal Server Occured')
    }
    
})

module.exports = router