const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// Bring in express validator (tools for validating password. Check Docs)
const { check, validationResult} = require('express-validator')


// Bring in our User.js model
const User = require('../../models/User')


// @route   POST api/users
// @desc    Test route
// @access  Public
router.post('/', [
    // Checks that name is there AND not empty, email is email, password is 6length
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6 })
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

    const { name, email, password} = req.body; 

    try{
    //See if user exists
        let user = await User.findOne({ email })

        // If user exists send back status of 400 (bad request)
        if(user) {
            return res.status(400).json( {errors: [ { msg: 'User already exists' }]})
        }
    // Get Users gravatar
        const avatar = gravatar.url(email, {
            s: '200', //Size
            r: 'pg',  //rating pg, so no innapropriate pics
            d: 'mm'  //default avatar pic
        })

        user = new User( {
            name,
            email,
            avatar,
            password
        })
    // exncrypt password using bcrypt

        // Create salt to hash new users password with. Promise from bcrypt hence await
        //ten rounds according to docs
        const salt = await bcrypt.genSalt(10)
        //user takes plain text pw and salt and hashs users pw
        user.password = await bcrypt.hash(password, salt)
        // Save user to database
        await user.save()

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