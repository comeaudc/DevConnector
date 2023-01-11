const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// Bring in express validator (tools for validating password. Check Docs)
const { check, validationResult} = require('express-validator')

// Adding middleware auth as 2nd parameter, making route PROTECTED

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) =>{
    // res.send('Auth route') // To test route works

    //finds user my importing User model and req.user.id(set on auth.js middleware) does not include pw
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   POST api/auth
// @desc    Authenicate User & Get Token
// @access  Public
router.post('/', [
    // Checks that email is email, password is 6length
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password Required').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    // If there are errors will return status or error
    if(!errors.isEmpty()){
        //sends back array of pertinent errors
        return res.status(400).json({errors: errors.array() })
    }
    // //console.log request.body testing because thats the object of data to be sent to this route
    // console.log(req.body);

    const { email, password} = req.body; 

    try{
    //See if user exists
        let user = await User.findOne({ email })

        // If user exists send back status of 400 (bad request)
        if(!user) {
            return res
            .status(400)
            .json( {errors: [ { msg: 'Invalid Credentials' }]})
        }

        //Takes in plain text password & compares to encrypted pw
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res
            .status(400)
            .json( {errors: [ { msg: 'Invalid Credentials' }]})
        }
    
        //return jsonwebtoken (allows them to be logged in)
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtToken'),
            { expiresIn:360000 }, //adds time till expires. one hour is 3600
            (err, token) => {
                if(err) throw err;
                res.json({ token})
            }) 
    // res.send('User Registered') // this was a test

    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;