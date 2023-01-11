const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')

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

module.exports = router;