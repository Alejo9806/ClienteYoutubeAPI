const passport = require('passport')
const passport_google =require('passport-google-oauth')

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser( async(id,done)=>{
    const user = await User.findById(id);
    done(null,user);

});

passport.use(new GoogleStrategy({
    clientID: google.GOOGLE_CLIENT_ID,
    clientSecret: google.GOOGLE_CLIENT_SECRET,
    callbackURL: google.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => { 
    const user = await User.findOne({ email : profile._json.email }, async(err, user) => {
        if(err){
            return done(err, false, {message : err});
        }else {
            if (user) {
                return done(null, user, {message : "User"});
            } else {
                console.log(profile);
                const newUser = new User();
                newUser.email = profile._json.email;
                newUser.name = profile.displayName;
                await newUser.save();
                return done(null,user,{message : "User"});
            };
        };
    });
}));
