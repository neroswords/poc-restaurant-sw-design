const User = require('../models/User');

// configs/passport.js
const passport = require('passport'),LocalStrategy = require('passport-local').Strategy
const passportJWT = require("passport-jwt"),
      JWTStrategy = passportJWT.Strategy,
      ExtractJWT  = passportJWT.ExtractJwt

passport.serializeUser(function (user, done) {
    console.log('serializeUser user ', user);
    done(null, user.id);   
});

passport.deserializeUser(function (user, done) {
//If using Mongoose with MongoDB; if other you will need JS specific to that schema.
    console.log('deserializeUser ', user);
    User.findById(user)
    .then(user => {
        return done(null, user);
    })
    .catch(err => {
        return done(err);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    (email, password, done) => {        
     //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT  
     
     return User.findOne({email}).select('+password')
           .then(user => {
            console.log("LocalStrategy : ", user)
               if (!user) {
                console.log("!user")
                   return done(null, false, {success : false, message: 'Incorrect email.'})
               }
               let isMatch = user.matchPassword(password);
                if (!isMatch){
                    console.log("!isMatch")
                    return done(null, false, {success : false, message: 'Incorrect password.'})  
                }          
               return done(null, user, {success : true, message: 'Logged In Successfully'})
          })
          .catch(err => {
            console.log("err")
            done(err)})
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET || 'asdfjkl;;lkjfdsa'
},
(jwtPayload, done) => {
 //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
console.log("JWTStrategy : ", jwtPayload)
return User.findById(jwtPayload.id)
     .then(user => {
         return done(null, user);
     })
     .catch(err => {
         return done(err);
     });
}
));