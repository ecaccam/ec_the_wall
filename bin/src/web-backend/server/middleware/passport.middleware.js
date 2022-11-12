import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import regeneratorRuntime from "regenerator-runtime";
import { JWT_SECRET_KEY } from "../config/constants/app.constants";
import UserModel from "../models/users.model";

const localStrategy = passportLocal.Strategy;
const jwtStrategy   = passportJwt.Strategy;
const extractJWT    = passportJwt.ExtractJwt;

function LocalPassport(passport){
    /* USE PASSPORT-LOCAL for user login */
    passport.use('local-login', new localStrategy({usernameField: 'email_address', passwordField: 'password', passReqToCallback: true }, async (req, email, password, done) => {
        try {
            const userModel = new UserModel(undefined);
            let response    = await userModel.authenticateUser({ email, password });	

            if(response.status === true){
                req.session.user = response.result;
                req.session.save((sessErr)=>{
                    return done(null, response.result, response);
                });
            }
            else{
                return done(null, null, response);
            }
        }
        catch(error){
            return done(null, null, {status: false, error: error, message: "Something went wrong. User failed to login."});
        }
    }));

    const opts = {
        jwtFromRequest: extractJWT.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: JWT_SECRET_KEY,
    };

    passport.use('jwt', new jwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const usersModel = new UsersModel(undefined);
            let response    = await usersModel.getUserData({email_address: jwt_payload.id}, "id, user_level_id, first_name, last_name, profile_picture_url");

            if(response.status === true){
                done(null, response.result);
            }
            else{
                done(response.error, null, response);
            }
        }
        catch (error) {
            done(error);
        }
    }));


    passport.serializeUser(function(user_data, done) {
        done(null, user_data);
    });

    passport.deserializeUser(async function(user_data, done) {
        done(null, user_data);
    }); 

    return passport;
}

export default LocalPassport;