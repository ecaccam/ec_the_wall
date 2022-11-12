/** 
* @class 
* Handles the Sessions. <br>
* Last Updated Date: August 1, 2022
*/
import regeneratorRuntime from "regenerator-runtime";
import Base64Url 		  from "base64-url";
import jwt 				  from "jsonwebtoken";

import { JWT_SECRET_KEY, JWT_TOKEN_HOUR_EXPIRATION } from "../config/constants/app.constants";

class SessionHelper {
    /**
    * Default constructor.
    * @memberOf SessionHelper
    */

    constructor(){ 
        
    }

    /**
    * DOCU: Function to generate session and token.<br>
    * Triggered by UserController <br>
    * Last Updated Date: August 11, 2022
    * @async
    * @function
    * @memberOf SessionHelper
    * @param {object} current_user - Requires current user data that will be saved in session. <br>
    * @returns {object} response_data { status: true, result: {token, details_token}, error: null }. <br>
    * @author Erick
    */
    generateSessionAndToken = async (current_user) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            current_user.iot = new Date().getTime();				
            current_user.current_user_id = Base64Url.encode(`${current_user.iot}__${current_user.id}__${JWT_SECRET_KEY}88`);
            current_user.current_candidate_id = Base64Url.encode(`${current_user.iot}__${current_user.candidate_id}__${JWT_SECRET_KEY}88`);
            
            const token = await jwt.sign(Object.assign({ id: current_user.email }, {
                current_user_id: current_user.current_user_id,
                iot: current_user.iot 
            }), JWT_SECRET_KEY, {expiresIn: `${JWT_TOKEN_HOUR_EXPIRATION}h`});

            /* Will encrypt the session data */
            const details_token = await jwt.sign(Object.assign({ id: current_user.email }, current_user), JWT_SECRET_KEY, {expiresIn: `${JWT_TOKEN_HOUR_EXPIRATION}h`});

            response_data.result = { token, details_token };
        }
        catch(error){
            response_data.error = error;
            response_data.message = 'Failed to initialize tokens.';            
        }

        return response_data;
    }
    
    /**
    * DOCU: Function to save the user session. <br>
    * Triggered by UserController <br>
    * Last Updated Date: August 1, 2022
    * @async
    * @function
    * @memberOf SessionHelper
    * @param {object} req - Requires the whole data from req. <br>
    * @param {object} session_data - Requires session data that will be saved. <br>
    * @returns {object} response_data { status: true }. <br>
    * @author Erick
    */
    saveSession = async (req, session_data) => {
        return new Promise((resolve, reject) => {
            req.session.user = session_data;

            /* save session data */
            req.session.save((session_err) => {
                if(session_err){
                    reject(session_err);
                }
                else{
                    console.log('saved session');
                    resolve(true)
                }
            });        
        });
    }

    /**
    * DOCU: Function is to end the current user session. <br>
    * Triggered by UserController <br>
    * Last Updated Date: August 1, 2022
    * @async
    * @function
    * @memberOf SessionHelper
    * @param {object} req - Requires the whole data from req. <br>
    * @param {boolean} is_destroy_session - Optional. Provide if ending session via logout. <br>
    * @returns {object} response_data { status: true }. <br>
    * @author Erick
    */
    endSession = async (req, is_destroy_session = false) => {
        return new Promise(async (resolve, reject) => {
            /* check if session will be destroyed */
            if(req.session.user && is_destroy_session){
                req.session.destroy(() => {
                    req.user = undefined;
                    resolve({ status: true });
                })
            }
            /* removes user from session */
            else{
                req.session.user = undefined;
                req.user = undefined;
                resolve({ status: true })
            }
        });
    }
}

export default SessionHelper;