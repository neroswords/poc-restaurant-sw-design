const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect= async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({success:false, message:'Not authorize to access this route'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({success:false, message:'Not authorize to access this route'});
    }
};

exports.ensureLoggedInWithRoles=(...roles)=>{
    return (req, res, next) => {
        if(req.isAuthenticated() && !roles.includes(req.user.role)){
            if (req.user.role == 'customer'){
                return res.redirect("/");
            } else if (req.user.role == 'employee' || req.user.role == 'manager'){
                return res.redirect("/table");
            } else {
                return res.redirect("/orders");
            }
        } else if (!req.isAuthenticated()){
            return res.redirect('/login');
        }
        next();
    }
}

exports.ensureLoggedIn= async (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

exports.ensureNotLoggedIn= async (req, res, next) => {
    if(req.isAuthenticated()) {
        if (req.user.role == 'customer'){
            return res.redirect("/");
        } else if (req.user.role == 'employee' || req.user.role == 'manager'){
            return res.redirect("/table");
        } else {
            return res.redirect("/orders");
        }
    }
    next();
}