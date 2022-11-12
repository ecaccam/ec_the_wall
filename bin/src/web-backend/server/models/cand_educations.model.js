import DatabaseModel                from "./database-query-model/lib/database.model";

/* Imports for constants */
import { DATABASE_QUERY_SETTINGS } from "../config/constants/app.constants";
import { BOOLEAN_FIELD }            from "../config/constants/shared.constants";

/**
* @class
* All method here are related to Education information of Candidates. <br>
* Last Updated Date: August 16, 2022
* @extends DatabaseModel
*/
class CandEducationsModel extends DatabaseModel{
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
    * DOCU: This is a function that get data in cand_educations table. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 17, 2022 <br>
    * @async
    * @function
    * @memberOf CandEducationsModel
    * @param {object} where_params - Requires the where_params (where condition object) - Optionals (fields_to_select)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic, Updated by: Fitz
    */
    getCandEducationData = async (where_params, fields_to_select=null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to select cand_educations record */
            let generate_select_cand_educations_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.and_conn,
                fields: fields_to_select,
                table: "cand_educations",
                query_type: DATABASE_QUERY_SETTINGS.type.selq
            }, where_params, []);

            /* Proceed if query is successfully generated */
            if(generate_select_cand_educations_query.status){
                let [cand_educations_data] = await this.executeQuery("CandEducationsModel | getCandEducationData", generate_select_cand_educations_query.result.raw_query);

                if(cand_educations_data){
                    response_data.status = true;
                    response_data.result = cand_educations_data;
                }
                else{
                    response_data.message = "No cand_educations record found."
                }
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = 'Failed to fetch cand_educations record. Refresh the page and try again.';
        }
        
        return response_data;
    }

    /**
    * DOCU: This is a function that insert new data in cand_educations table. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 16, 2022 <br>
    * @async
    * @function
    * @memberOf CandEducationsModel
    * @param {object} set_params - Requires the set_params (fields and values to be inserted)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Fitz
    */
    createCandEducationRecord = async (set_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to insert new candidate record */
            let generate_create_candidate_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn,
                fields: null,
                table: "cand_educations",
                query_type: DATABASE_QUERY_SETTINGS.type.insq
            }, set_params);

            /* Proceed if query is successfully generated */
            if(generate_create_candidate_query.status){
                let new_cand_education_data = await this.executeQuery("CandEducationsModel | createCandEducationRecord", generate_create_candidate_query.result.raw_query);

                if(new_cand_education_data.affectedRows > BOOLEAN_FIELD.zero_value){
                    response_data.status = true;
                    response_data.result.candidate_education_id = new_cand_education_data.insertId;
                }
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = 'Failed to fetch candidates record.';
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that updates data in cand_educations table. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 16, 2022 <br>
    * @async
    * @function
    * @memberOf CandEducationsModel
    * @param {object} set_params - Requires the set_params (fields to be updated)
    * @param {object} value_params - Requires the value_params (values to be passed in set_params)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Fitz
    */
    updateCandEducationRecord = async (set_params, value_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to update users record */
            let generate_update_cand_education_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn,
                fields: null,
                table: "cand_educations",
                query_type: DATABASE_QUERY_SETTINGS.type.updq,
                condition: { id: '?' }
            }, set_params, [], value_params);

            /* Proceed if query is successfully generated */
            if(generate_update_cand_education_query.status){
                let update_cand_education_result = await this.executeQuery("CandEducationsModel | updateCandEducationRecord", generate_update_cand_education_query.result.raw_query);

                response_data.status = (update_cand_education_result.affectedRows);
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to update candidate education record.";
        }

        return response_data;
    }
}

export default CandEducationsModel;