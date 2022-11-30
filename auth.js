const passport = require('passport')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'secret',
            jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt')
        },
        async (token, done) => {
            try {
                return done(null, token)
            } catch (error) {
                done(error)
            }
        }
    )
)

