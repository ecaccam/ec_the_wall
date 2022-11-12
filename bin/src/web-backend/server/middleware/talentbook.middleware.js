import jwt 				    from "jsonwebtoken";
import Base64Url 			from "base64-url";
import Moment               from "moment";
import { JWT_TOKEN_HOUR_EXPIRATION, JWT_SECRET_KEY, PRODUCTION_ENVIRONMENTS }     from "../config/constants/app.constants";

/** 
* @function 
* API MIDDELWARE - custom middleware designed for Learn Platform version 3. </br>
* Check User Permissions before allowing them to acces the API URLs. </br>
* @param {object} req={} - Requires originalUrl from the `req` param.
* @param {object} res={} - Requires to return response to the client.
* @param {object} next={} - Requires the next callback to be called when permitted.
* Read more about express routing {@link https://expressjs.com/en/guide/routing.html|here}.
* Also, check out {@link https://expressjs.com/en/guide/writing-middleware.html|this} for implementing middlewares.
* Last Updated Date: July 26, 2022
* Author: Noah 
*/
function __api_middleware(req, res, next){    
    let error_response = { status: false, message: null, is_logout: false };
    
    try{
        let {user} = req.session;
        let header = req.headers['authorization'];

        if(typeof header !== 'undefined' && user){
            const bearer = header.split(' ');
            const token = bearer[1];

            let {current_user_id} = user;
            
            /* verify JWT token passed from API request */
            jwt.verify(token, JWT_SECRET_KEY, (error, authorizedData) => {
                console.log(`AUTHORIZATION ERROR: ${error}`);
                
                /* check if verifying JWT token fails or if user  logins with different session but not auto login */
                if(error || (current_user_id !== authorizedData.current_user_id)){
                    throw new Error("You don't have the right permission to access.");
                }
                else {
                    let user_id_token = Base64Url.decode(authorizedData.current_user_id);
                    let new_token_io = new Date();
                    let current_token_io = null;

                    current_token_io = new Date(authorizedData.iot);
                    authorizedData.id = parseInt(user_id_token.replace(`${authorizedData.iot}__`, "").replace(`__${JWT_SECRET_KEY}88`,""));

                    /* Auto-logout user */
                    if(isNaN(authorizedData.id)){
                        error_response.is_logout = true;
                        throw new Error("You don't have the right permission to access.");
                    }

                    if((current_token_io.getTime() + (JWT_TOKEN_HOUR_EXPIRATION*60*60*1000)) > new_token_io.getTime()){
                        req.user = req.session.user;
                        req.user.id = authorizedData.id    
                        next();
                    }
                    else{
                        throw new Error("You don't have the right permission to access.");
                    }
                }
            });      
        } 
        else{
            next();
        }      
        
    }
    catch(error){
        error_response.message = error.message;
        res.status(401).json(error_response);          
    }
}

module.exports = function () {
    let console_log = console.log;

    /* Disable console.log on Production Environments */
    console.log = function custom_console(args) {
        if(!PRODUCTION_ENVIRONMENTS.includes(process.env.NODE_ENV)){
            var timestamp = "[" + Moment().format("YYYY-MM-DD HH:mm:ss:SSS") + "] ";
            Array.prototype.unshift.call(arguments, timestamp);
            console_log.apply(this, arguments);
        }
    };

    return function (req, res, next) {
        /* DOCU: activate the API MIDDLEWARE */
        __api_middleware(req, res, next);
    }
}