/* HACK: fix for babel issue with async functions */
import regeneratorRuntime          from "regenerator-runtime";
import MD5                         from "md5";

/* Imports for models */
import { format as mysqlFormat }   from "mysql";
import DatabaseModel               from "./database-query-model/lib/database.model";
import CandidateModel              from "./candidates.model";

/* Imports for constants */
import { CURRENT_PAGE }               from "../config/constants";
import { DATABASE_QUERY_SETTINGS }    from "../config/constants/app.constants";
import { BOOLEAN_FIELD, USER_LEVELS } from "../config/constants/shared.constants";

/** 
* @class 
* All method here are related to Users. <br>
* Last Updated Date: July 26, 2022
* @extends DatabaseModel
*/
class UsersModel extends DatabaseModel{
    #request;

    /**
    * Default constructor.
    * @param {object=} req={} - This contains the `req` values from the caller of this class.
    */
    constructor(req){
        super();
        this.#request = req;
    }


    /**
    * DOCU: This is a function that authenticate the user when he login. <br>
    * Triggered by passport.middleware <br>
    * Last updated at: August 11, 2022
    * @async
    * @function
    * @memberOf UserModel
    * @param {object} params - Requires the params (email_address and password).<br>
    * @returns response_data - { status: true/false, result: {user_data, redirect_url}, error, message }
    * @author Erick, Updated by: Fitz
    */
    authenticateUser = async (params) => {
        let response_data  = { status: false, result: {}, error: null };

        try{
            /*  Check if email address and password is present */ 
            if(params.email && params.password){
                let check_user_data = await this.getUserData({ email: params.email }, "id, password, created_at");

                if(check_user_data.status && check_user_data.result?.created_at){
                    let candidate_details = {};
                    let redirect_url = "";

                    /* Encrypt the provided password to be used in fetching the user record */ 
                    let encrypted_password = await this.__encryptPassword(params.password, check_user_data.result.created_at);

                    /* Authenticate user using id and encrpyted password. */
                    let authenticate_user_data = await this.getUserData({ id: check_user_data.result?.id, password: encrypted_password }, "id, user_level_id, first_name, last_name, email, profile_picture_url");
                    
                    /* Check if the user is a candidate then fetch the candidate record. */
                    if(authenticate_user_data.status && parseInt(authenticate_user_data.result?.user_level_id) === USER_LEVELS.candidate){
                        let candidateModel = new CandidateModel();
                        let candidate_record_data = await candidateModel.getCandidateData({user_id: authenticate_user_data.result?.id}, "id AS candidate_id, current_page_id");

                        if(candidate_record_data.status){
                            candidate_details = candidate_record_data.result;
                            redirect_url = (parseInt(candidate_details.current_page_id) !== CURRENT_PAGE.cand_profile) ? `/onboarding` : `/profile-information`;
                        }
                    }
                    else{
                        redirect_url = "/candidate-management";
                    }

                    /* Check if user exits then return needed data for sessions. */
                    if(authenticate_user_data.status){
                        response_data.status = true;
                        response_data.result = { ...authenticate_user_data.result, ...candidate_details, redirect_url };
                    }
                    else{
                        response_data.message = "The email or password you entered is incorrect.";
                    }
                }
                else{
                    response_data.message = check_user_data.message;
                }
            }
            else{
                response_data.message = "Please enter a valid email address and password.";
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Login failed. Please reload the page and try again.";       
        }

        return response_data;
    }

    /** 
    * DOCU: This is a function that fetch the specific fields in users depending on the where_params. <br>
    * This can be reusable when fetching data from users table. <br>
    * Triggered by authenticateUser, createUserRecord <br>
    * Last updated at: August 1, 2022 <br>
    * @async
    * @function
    * @memberOf UserModel
    * @param {object} where_params - Requires the where_params (where condition object) - Optionals (fields_to_select)
    * @returns response_data - { status: true/false, result: {company_user_data}, error, message }
    * @author Erick
    */
    getUserData = async (where_params, fields_to_select=null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to select user record */
            let generate_select_user_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.and_conn, 
                fields: fields_to_select, 
                table: "users", 
                query_type: DATABASE_QUERY_SETTINGS.type.selq 
            }, where_params, []);
            
            if(generate_select_user_query.status){
                let [user_data] = await this.executeQuery("UserModel | getUserData", generate_select_user_query.result.raw_query);

                if(user_data){
                    response_data.status = true;     
                    response_data.result = user_data;
                }
                else{
                    response_data.message = "No user record found."
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = 'Failed to fetch users record. Refresh the page and try again.';
        }
        
        return response_data;
    } 

    /** 
    * DOCU: This is a function that insert new data in users/candidates table. <br>
    * Triggered by users.controller/createUser <br>
    * Last updated at: August 1, 2022 <br>
    * @async
    * @function
    * @memberOf UserModel
    * @param {object} params - Requires the params (first_name, last_name, email, password)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Erick
    */
    createUserRecord = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let { email, first_name, last_name, password } = params;
            
            /* Check if required params exist.*/
            if(email && first_name && last_name && password){
                let check_user_data = await this.getUserData({ email: params.email }, "id, email");

                /* Check if user do not exists, then create user record. */
                if(!check_user_data.status){
                    /* Generate raw query to insert new user record */
                    let generate_create_user_query = this.generateRawQuery({
                        connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn, 
                        fields: null, 
                        table: "users", 
                        query_type: DATABASE_QUERY_SETTINGS.type.insq 
                    }, {email, first_name, last_name, user_level_id: USER_LEVELS.candidate, is_active: BOOLEAN_FIELD.active_value });

                    if(generate_create_user_query.status){
                        let new_user_data = await this.executeQuery("UserModel | createUserRecord", generate_create_user_query.result.raw_query);
                
                        if(new_user_data.affectedRows > BOOLEAN_FIELD.zero_value){
                            let check_new_user = await this.getUserData({ id: new_user_data.insertId }, "id, user_level_id, first_name, last_name, profile_picture_url, created_at");

                            if(check_new_user.result?.id && check_new_user.result?.created_at){
                                /* Updated password field with the encrpyted password. */
                                let encrypted_password = await this.__encryptPassword(password, check_new_user.result?.created_at);
                                let update_user_result = await this.updateUserRecord( {password: '?'}, [encrypted_password, check_new_user.result?.id] );
                                
                                if(update_user_result.status){
                                    let candidateModel = new CandidateModel();
                                    let create_candidate_record = await candidateModel.createCandidateRecord({user_id: check_new_user.result?.id, current_page_id: CURRENT_PAGE.cand_information });

                                    if(create_candidate_record.status){
                                        response_data.status = true;
                                    }
                                    else{
                                        response_data.message = create_candidate_record.message;
                                    }
                                }
                                else{
                                    response_data.message = update_user_result.message;
                                }
                            }
                            else{
                                response_data.message = check_new_user.message;
                            }
                        }
                        else{
                            response_data.message = "Failed to create user record.";
                        }
                    }
                    else{
                        response_data.message = generate_create_user_query.message;
                    }
                }
                else{
                    response_data.message = "Email is already used."
                }
            }
            else{
                response_data.message = "Missing required fields."
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = 'Failed to create user record. Refresh the page and try again.';
        }
        
        return response_data;
    } 

    /** 
    * DOCU: This is a function that update specific fields in users depending on the set_params and value_params. <br>
    * This can be reusable when updating data in users table. <br>
    * Triggered by createUserRecord <br>
    * Last updated at: August 1, 2022 <br>
    * @async
    * @function
    * @memberOf UserModel
    * @param {object} where_params - Requires the set_params (fields to be updated)
    * @param {object} value_params - Requires the value_params (new value to be update)
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Erick
    */
    updateUserRecord = async (set_params, value_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to update users record */
            let generate_update_users_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn, 
                fields: null, 
                table: "users", 
                query_type: DATABASE_QUERY_SETTINGS.type.updq, 
                condition: { id: '?' }
            }, set_params, [], value_params);

            if(generate_update_users_query.status){
                let update_user_result = await this.executeQuery("UserModel | generate_update_users_query", generate_update_users_query.result.raw_query);

                response_data.status = (update_user_result.affectedRows);
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to update user record.";
        }

        return response_data;
    }


    /** 
    * DOCU: This is a private function that update encrypts password of the user. <br>
    * Triggered by authenticateUser, createUserRecord <br>
    * Last updated at: August 1, 2022 <br>
    * @async
    * @function
    * @memberOf UserModel
    * @param {string} password Requires password
    * @param {string} user_created_at Requires user_created_at
    * @returns password_encryption
    * @author Erick
    */
    __encryptPassword = async (password, user_created_at) => {
        let created_at_iso = new Date(user_created_at - user_created_at.getTimezoneOffset() * 60000).toISOString();
        let password_encryption = MD5(`${MD5(`Villag388_${password}_BoomY3ah`)}________${created_at_iso}________`);
        
        return password_encryption;
    }
}

export default UsersModel;