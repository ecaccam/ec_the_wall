

/* HACK: fix for babel issue with async functions */
import regeneratorRuntime from "regenerator-runtime";
import Passport           from 'passport';
import Base64Url 		  from "base64-url";
import jwt 				  from "jsonwebtoken";

/* Imports for helpers */
import { checkFields } from "../helpers/index.js";
import SessionHelper   from "../helpers/session.helper";

/* Imports for models */
import UserModel from "../models/users.model";

/** 
* @class 
* This controller is being called from the users.routes.js <br>
* All method here are related to users feature. <br>
* Last Updated Date: July 28, 2022
*/
class UserController {
    /**
    * Default constructor.
    */
    constructor(){
        
    }

    /**
    * DOCU: Function to process the login of a user. <br>
    * Triggered by api/users.routes/login <br>
    * Last updated at: July 26, 2022
    * @async
    * @function
    * @memberOf UserController
    * @param {object} req.body - Requires the req.body (email, password)
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Erick
    */
    loginUser = async (req, res, next) => {
        await this.__loginAndGenerateSessionAndToken(req, res, next);
    }

    /**
    * DOCU: Function to process the registration of a user. <br>
    * Triggered by api/users.routes/register <br>
    * Last updated at: July 26, 2022
    * @async
    * @function
    * @memberOf UserController
    * @param {object} req.body - Requires the req.body (first_name, last_name, email, password)
    * @returns response_data - { status: true/false, result: {created_user}, error, message }
    * @author Erick
    */ 
    createUser = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };
        try{
            let check_fields = checkFields(["first_name", "last_name", "email", "password"], [], req);

            if(check_fields.status){
                let userModel = new UserModel(req);
                response_data = await userModel.createUserRecord(check_fields.result.sanitized_data);
            }
            else{
                response_data.message = "Missing required fields."
            }

        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function to check if user is currently logged in or not. <br>
    * Triggered by api/users.routes/check_current_user <br>
    * Last updated at: August 2, 2022
    * @async
    * @function
    * @memberOf UserController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Erick
    */
    checkCurrentUser = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let { user: current_user } = req.session;

            /* Check if the user have current session. */ 
            if(current_user){
                response_data.status = true;
                response_data.result.redirect_url = current_user.redirect_url;
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function to sign out user. <br>
    * Triggered by api/users.routes/logout <br>
    * Last updated at: August 9, 2022
    * @async
    * @function
    * @memberOf UserController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Erick
    */
    logoutUser = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let sessionHelper = new SessionHelper();

            /* Destroy user session */
            response_data = await sessionHelper.endSession(req, true);
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }



    /**
    * DOCU: Private function to process the login of a user and generate sessions/tokens. <br>
    * Triggered by loginUser <br>
    * Last updated at: August 10, 2022
    * @async
    * @function
    * @memberOf UserController
    * @param {object} req.body - Requires the req.body (email, password)
    * @returns response_data - { auth: true/false, result: {token, user_token}, error, message }
    * @author Erick
    */
    __loginAndGenerateSessionAndToken = async (req, res, next) => {
        Passport.authenticate('local-login', async(err, current_user, info) => {
            if(err) {
                res.json({auth:false, error: err})
            }	
            else{ 
                if(current_user && current_user?.id){
                    let sessionHelper = new SessionHelper();
                    let {result: { token, details_token }} = await sessionHelper.generateSessionAndToken(current_user);
                    
                    req.login(current_user, async (loginErr) => {
                        if (loginErr) {
                            return next(loginErr);
                        }
                        
                        /* Remove users.id so that it will not be added to the session */
                        delete current_user.id
                        delete current_user.candidate_id

                        /* Triggers the saving of session. */
                        await sessionHelper.saveSession(req, current_user);
                        
                        /* Return success and tokens. */
                        return res.status(200).json({
                            auth: true,
                            token: token,		
                            user_token: details_token,				
                            message: 'User was successfully logged in!'
                        });
                    });      
                }
                else{
                    /* Return login failure. */
                    res.status(200).json({
                        auth: false,
                        message: info.message,
                        info: info
                    });
                }
            }
        })(req, res, next);        
    }
}

export default (function user(){
    return new UserController();
})();
