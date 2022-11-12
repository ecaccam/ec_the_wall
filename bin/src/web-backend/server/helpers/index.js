
import regeneratorRuntime from "regenerator-runtime";
import Base64Url 		  from "base64-url";

import { JWT_SECRET_KEY } from "../config/constants/app.constants";
/** 
* @class 
* Handles the Global Helpers. <br>
* Last Updated Date: August 1, 2022
*/
class GlobalHelper {
    /**
    * Default constructor.
    * @memberOf GlobalHelper
    */

    constructor(){
    }

    /**
    * DOCU: This is used for filtering required fields <br>
    * If a required fields are missing then it will return a status false, and returns the missing field keys
    * If all required field are given then it will return the needed data
    * Sample calling: checkFields(["id", "name"], ["is_active", "is_premium"], req);
    * Triggered by All Controllers <br>
    * Last updated at: August 11, 2022
    * @async
    * @function
    * @memberOf GlobalHelper
    * @param {object} required_fields   
    * @param {object} optional_fields
    * @author Erick
    */
    checkFields = (required_fields, optional_fields=[], req) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            if(!Array.isArray(required_fields) || !Array.isArray(optional_fields)){
                throw Error("Arguments have incorrect data types. Must pass array.");
            }

            let all_fields = required_fields.concat(optional_fields);
            let sanitized_data = {};
            let missing_fields = [];

            for(const index in all_fields){
                let selected_key = all_fields[index]; 
                let selected_value = req.body[selected_key] != undefined ? req.body[selected_key] : ""; 

                if(String(selected_value).trim() === "" && required_fields.includes(selected_key)){
                    missing_fields.push(selected_key);
                }else{
                    sanitized_data[selected_key] = selected_value;
                }
            }

            response_data.status = missing_fields.length === 0;
            response_data.result = response_data.status ? {sanitized_data} : {missing_fields}; 
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    /**
    * DOCU: Function to Decrypt id with Base64Url.<br>
    * Triggered by most of the controllers <br>
    * Last updated at: August 11, 2022
    * @async
    * @function
    * @memberOf GlobalHelper
    * @param {string} encrypted_user_id - requires the encrypted id.<br>
    * @param {integer} timestamp - requires the timestamp to decrypt the encrypted id.<br>
    * @author Erick
    */
    decryptId = (encrypted_id, timestamp) => {
        return parseInt(Base64Url.decode(encrypted_id).replace(`${timestamp}__`, "").replace(`__${JWT_SECRET_KEY}88`,""));
    }
}

let globalHelper = new GlobalHelper();

module.exports = {
    checkFields: globalHelper.checkFields,
    decryptId: globalHelper.decryptId
}