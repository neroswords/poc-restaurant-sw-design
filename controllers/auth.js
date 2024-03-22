const User = require("../models/User");

const jwt = require('jsonwebtoken');
const passport = require('passport');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true, 
        token
    })
}

//@desc         Register user
//@route        POST /api/v1/auth/register
//@access       Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role} = req.body;
        if (role == 'customer'){
            res.status(400).json({success:false, message : "cannot create customer"});
        }
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        sendTokenResponse(user,200,res);
    } catch (err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}

//@desc         Login user
//@route        POST /api/v1/auth/login
//@access       Public
// exports.login = async (req, res, next) => {
//     const {email, password} = req.body;

//     if(!email || !password){
//         return res.status(400).json({success:false, msg:'Please provide an email and password'});
//     }

//     const user = await User.findOne({email}).select('+password');
//     if (!user){
//         return res.status(400).json({success:false, msg:'Invalid credentails'});
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch){
//         return res.status(400).json({success:false, msg:'Invalid credentails'});       
//     }

//     // const token = user.getSignedJwtToken();
//     // res.status(200).json({success:true, token});
//     sendTokenResponse(user,200,res);
// }

exports.login = async (req, res, next) => {
    passport.authenticate('local', {session:true}, (err, user, info) => {
        if (err) {
            console.log("login err ",err);
            return next(err)
        }
        if(user) {
            const token = user.getSignedJwtToken();
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/')
            });
        } else {
            return res.status(400).json(info)
        }
    })(req, res, next);
}

//@desc         Get current Logged in user
//@route        GET /api/v1/auth/me
//@access       Private
exports.getMe= async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true,data:user});
}

exports.getLogOut = async(req, res, next) => {
	req.logout();
	req.flash("success", "Logged-out successfully")
	res.redirect("/");
};
