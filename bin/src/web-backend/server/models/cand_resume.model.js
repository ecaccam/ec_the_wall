/* HACK: fix for babel issue with async functions */
import regeneratorRuntime          from "regenerator-runtime";

/* Imports for models */
import { format as mysqlFormat }   from "mysql";
import DatabaseModel               from "./database-query-model/lib/database.model";
import CandidatesModel             from "./candidates.model";

/* Imports for constants */
import { DATABASE_QUERY_SETTINGS }    from "../config/constants/app.constants";
import { BOOLEAN_FIELD, USER_LEVELS } from "../config/constants/shared.constants";

/* Imports for Helpers */
import FileHelper from "../helpers/file.helper.js";

/** 
* @class 
* All method here are related to Candidate Resume. <br>
* Last Updated Date: August 15, 2022
* @extends DatabaseModel
*/
class CandResume extends DatabaseModel{
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
    * DOCU: This is the function that fetch the specific fields in cand_resumes depending on the where_params. <br>
    * Triggered by uploadUserResume <br>
    * Last updated at: August 15, 2022 <br>
    * @async
    * @function
    * @memberOf CandResumeModel
    * @param {object} where_params - Requires the where_params (where condition object) - Optionals (fields_to_select)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Adrian
    */
    getCandResumeRecord = async (where_params, fields_to_select=null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to select cand_resume record */
            let generate_select_candidate_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.and_conn,
                fields: fields_to_select,
                table: "cand_resumes",
                query_type: DATABASE_QUERY_SETTINGS.type.selq
            }, where_params, []);

            if(generate_select_candidate_query.status){
                let [candidate_data] = await this.executeQuery("CandResumeModel | getCandResumeRecord", generate_select_candidate_query.result.raw_query);

                if(candidate_data){
                    response_data.status = true;
                    response_data.result = candidate_data;
                }
                else{
                    response_data.message = "No cand_resume record found.";
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = 'Failed to fetch candidate record. Refresh the page and try again.';
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that insert new data in cand_resumes table. <br>
    * Triggered by uploadUserResume <br>
    * Last updated at: August 11, 2022 <br>
    * @async
    * @function
    * @memberOf CandResumeModel
    * @param {object} set_params - Requires the set_params (fields and values to be inserted)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Adrian
    */
    createCandResumeRecord = async (set_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to insert new candidate record */
            let generate_create_candidate_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn,
                fields: null,
                table: "cand_resumes",
                query_type: DATABASE_QUERY_SETTINGS.type.insq
            }, set_params);

            if(generate_create_candidate_query.status){
                let new_candidate_data = await this.executeQuery("CandResumeModel | createCandResumeRecord", generate_create_candidate_query.result.raw_query);

                if(new_candidate_data.affectedRows > BOOLEAN_FIELD.zero_value){
                    response_data.status = true;
                    response_data.result.candidate_id = new_candidate_data.insertId;
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = 'Failed to fetch candidates record.';
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that update specific fields in cand_resumes depending on the set_params and value_params. <br>
    * This can be reusable when updating data in cand_resumes table. <br>
    * Triggered by uploadUserResume <br>
    * Last updated at: August 11, 2022 <br>
    * @async
    * @function
    * @memberOf CandResumeModel
    * @param {object} where_params - Requires the set_params (fields to be updated)
    * @param {object} value_params - Requires the value_params (new value to be update)
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Adrian
    */
    updateCandResumeRecord = async (set_params, value_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to update users record */
            let generate_update_users_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn,
                fields: null,
                table: "cand_resumes",
                query_type: DATABASE_QUERY_SETTINGS.type.updq,
                condition: { id: '?' }
            }, set_params, [], value_params);

            if(generate_update_users_query.status){
                let update_user_result = await this.executeQuery("CandResumeModel | updateCandResumeRecord", generate_update_users_query.result.raw_query);

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
    * DOCU: This is a function that insert new data in candidates table. <br>
    * Triggered by users.controller/createUser <br>
    * Last updated at: August 25, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - Requires file and user_id
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Adrian
    */
    uploadUserResume = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Fetch if the candidate is existing */
            let candidateModel   = new CandidatesModel();
            let candidate_record = await candidateModel.getCandidateData({id: params.candidate_id}, "*");

            if(candidate_record.status){
                /* Fetch if the candidate is existing */
                let get_cand_resume_record = await this.getCandResumeRecord({candidate_id: params.candidate_id}, "*");

                /* Upload the resume to s3 */
                let fileHelper             = new FileHelper();
                let upload_file_to_s3      = await fileHelper.uploadToS3(params.file, "resume", params.user_id);

                if(upload_file_to_s3.status){
                    if(get_cand_resume_record.status){
                        /* Update existing cadidate resume record */
                        let update_cand_resume_record = await this.updateCandResumeRecord({file_url: "?"}, [upload_file_to_s3.file_url, get_cand_resume_record.result?.id]);

                        if(update_cand_resume_record.status){
                            response_data.status = true;
                            response_data.result.file_url = upload_file_to_s3.file_url;

                            /* Delete the previous resume of the user */
                            if(get_cand_resume_record.result?.file_url){
                                fileHelper.deleteFileFromS3(get_cand_resume_record.result?.file_url);
                            }
                        }
                        else{
                            /* If updating of cand_resume record fails delete the newly uploaded file from the s3 bucket */
                            fileHelper.deleteFileFromS3(upload_file_to_s3.file_url);
                            throw new Error(update_cand_resume_record.error);
                        }
                    }
                    else if(get_cand_resume_record.message === "No cand_resume record found."){
                        /* Create a new candidate resume record */
                        let create_cand_resume_record = await this.createCandResumeRecord({candidate_id: params.candidate_id, file_url: upload_file_to_s3.file_url});

                        if(create_cand_resume_record.status){
                            response_data.status          = true;
                            response_data.result.file_url = upload_file_to_s3.file_url;
                        }
                        else{
                            throw new Error("Error in creating cand_resume record, Please try again later.");
                        }
                    }
                    else{
                        throw new Error("Error in fetching cand_resume record, Please try again later.");
                    }
                }
                else{
                    throw new Error("Error in uploading resume, Please try again later.");
                }
            }
            else{
                throw new Error("Error in fetching candidate record, Please try again later.");
            }

        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

export default CandResume;