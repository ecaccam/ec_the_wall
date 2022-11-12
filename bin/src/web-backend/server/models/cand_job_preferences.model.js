/* Imports for models */
import DatabaseModel from "./database-query-model/lib/database.model";

/* Imports for constants */
import { DATABASE_QUERY_SETTINGS, }    from "../config/constants/app.constants";
import { BOOLEAN_FIELD, ONBOARDING, US_COUNTRY_ID, US_STATES, USER_LEVELS } from "../config/constants/shared.constants";

/** 
* @class 
* All method here are related to Candidates. <br>
* Last Updated Date: August 11, 2022
* @extends DatabaseModel
*/
class CandJobPreferencesModel extends DatabaseModel{
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
    * DOCU: This is a function that fetch the specific fields in cand_job_preferences depending on the where_params. <br>
    * This can be reusable when fetching data from cand_job_preferences table. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 11, 2022 <br>
    * @async
    * @function
    * @memberOf CandJobPreferencesModel
    * @param {object} where_params - Requires the where_params (where condition object) - Optionals (fields_to_select)
    * @returns response_data - { status: true/false, result: {company_user_data}, error, message }
    * @author Jovic
    */
    getCandJobPreferenceData = async (where_params, fields_to_select=null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to select company_user record */
            let generate_select_cand_job_preferences_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.and_conn, 
                fields: fields_to_select, 
                table: "cand_job_preferences", 
                query_type: DATABASE_QUERY_SETTINGS.type.selq 
            }, where_params, []);

            /* Proceed if query is successfully generated */
            if(generate_select_cand_job_preferences_query.status){
                let [cand_job_preferences_data] = await this.executeQuery("CandJobPreferencesModel | getCandJobPreferenceData", generate_select_cand_job_preferences_query.result.raw_query);

                if(cand_job_preferences_data){
                    response_data.status = true;     
                    response_data.result = cand_job_preferences_data;
                }
                else{
                    response_data.message = "No cand_job_preferences record found."
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = 'Failed to fetch cand_job_preferences record. Refresh the page and try again.';
        }
        
        return response_data;
    }

    /** 
    * DOCU: This is a function that insert new data in cand_job_preferences table. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 17, 2022 <br>
    * @async
    * @function
    * @memberOf CandJobPreferencesModel
    * @param {object} set_params - Requires the set_params (fields and values to be inserted)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    createCandJobPreferenceRecord = async (set_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to insert new candidate record */
            let generate_create_cand_job_preferences_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn, 
                fields: null, 
                table: "cand_job_preferences", 
                query_type: DATABASE_QUERY_SETTINGS.type.insq 
            }, set_params);

            /* Proceed if query is successfully generated */
            if(generate_create_cand_job_preferences_query.status){
                let new_cand_job_preferences_data = await this.executeQuery("CandJobPreferencesModel | createCandJobPreferenceRecord", generate_create_cand_job_preferences_query.result.raw_query);
        
                if(new_cand_job_preferences_data.affectedRows > BOOLEAN_FIELD.zero_value){
                    response_data.status = true;
                    response_data.result.candidate_id = new_cand_job_preferences_data.insertId;
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = 'Failed to create candidates record.';
        }
        
        return response_data;
    }

    /** 
    * DOCU: This is a function that updates data in cand_job_preferences table. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 17, 2022 <br>
    * @async
    * @function
    * @memberOf CandJobPreferencesModel
    * @param {object} set_params - Requires the set_params (fields to be updated)
    * @param {object} value_params - Requires the value_params (values to be passed in set_params)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    updateCandJobPreferenceRecord = async (set_params, value_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to update users record */
            let generate_update_cand_job_preferences_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn, 
                fields: null, 
                table: "cand_job_preferences", 
                query_type: DATABASE_QUERY_SETTINGS.type.updq, 
                condition: { id: '?' }
            }, set_params, [], value_params);

            /* Proceed if query is successfully generated */
            if(generate_update_cand_job_preferences_query.status){
                let update_cand_job_preferences_result = await this.executeQuery("CandJobPreferencesModel | updateCandJobPreferenceRecord", generate_update_cand_job_preferences_query.result.raw_query);

                response_data.status = (update_cand_job_preferences_result.affectedRows);
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to update cand_job_preferences record.";
        }

        return response_data;
    }
}

export default CandJobPreferencesModel;