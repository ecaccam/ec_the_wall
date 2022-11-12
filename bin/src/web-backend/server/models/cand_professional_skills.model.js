import { format as mysqlFormat }   from "mysql";
import DatabaseModel               from "./database-query-model/lib/database.model";

/* Imports for constants */
import { DATABASE_QUERY_SETTINGS }    from "../config/constants/app.constants";
import { BOOLEAN_FIELD } from "../config/constants/shared.constants";

/**
* @class
* All method here are related to Candidates Professional Skills. <br>
* Last Updated Date: August 18, 2022
* @extends DatabaseModel
*/
class CandProfessionalSkillsModel extends DatabaseModel{
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
    * DOCU: This is a function that fetch all of the professional skills present in the candidate. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 22, 2022 <br>
    * @async
    * @function
    * @memberOf CandProfessionalSkillsModel
    * @param {object} candidate_id - Requires the candidate_id to fetch
    * @returns response_data - { status: true/false, result: {cand_languages_data, cand_technologies_data}, error, message }
    * @author Fitz
    */
    getProfessionalSkillsData = async (candidate_id) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to select cand_professional_skills record */
            let get_cand_professional_skills_query = mysqlFormat(
                `SELECT candidates.id AS candidate_id, JSON_OBJECT(
                    "cand_languages_json", (
                        SELECT
                        JSON_ARRAYAGG(JSON_OBJECT("id", dev_languages.id, "label", dev_languages.language_name, "is_language", true))
                        FROM cand_languages
                        LEFT JOIN dev_languages ON dev_languages.id = cand_languages.dev_language_id
                        WHERE cand_languages.candidate_id = candidates.id
                    ),
                    "cand_technologies_json", (
                        SELECT
                        JSON_ARRAYAGG(JSON_OBJECT("id", dev_technologies.id, "label", dev_technologies.title, "is_language", false))
                        FROM cand_technologies
                        LEFT JOIN dev_technologies ON dev_technologies.id = cand_technologies.dev_technology_id
                        WHERE cand_technologies.candidate_id = candidates.id
                    )
                ) AS cand_professional_skills
                FROM candidates
                WHERE candidates.id = ?`, [candidate_id]
            );

            let [cand_professional_skills] = await this.executeQuery("CandProfessionalSkillsModel | getProfessionalSkillsData", get_cand_professional_skills_query);
            cand_professional_skills.cand_professional_skills = JSON.parse(cand_professional_skills.cand_professional_skills);

            let {cand_languages_json, cand_technologies_json} = cand_professional_skills.cand_professional_skills;

            if(cand_languages_json !== null || cand_technologies_json !== null){
                response_data.status = true;
                response_data.result = cand_professional_skills;
            }
            else{
                response_data.message = "No candidate_professional_skills record for this candidate";
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch candidate_professional_skills record.";
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that create all of the new professional skills selected by the candidate. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 24, 2022 <br>
    * @async
    * @function
    * @memberOf CandProfessionalSkillsModel
    * @param {object} set_params - Requires the set_params (fields and values to be inserted for cand_languages and cand_technologies)
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Fitz
    */
    createCandProSkillData = async (set_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let {cand_languages, cand_technologies, candidate_id} = set_params;
            let insert_cand_languages_result, insert_cand_technologies_result = {};

            /* If cand_languages is present, insert to cand_languages table owned by the current candidate */
            if(cand_languages.length > 0){
                let cand_languages_to_insert = [];

                for(let index = 0; index < cand_languages.length; index++){
                    cand_languages_to_insert.push(mysqlFormat(`(?,?,NOW(),NOW())`, [candidate_id, cand_languages[index]]));
                }

                let insert_cand_languages_query = mysqlFormat(`INSERT INTO cand_languages (candidate_id, dev_language_id, created_at, updated_at) VALUES ` + cand_languages_to_insert.join(","));
                insert_cand_languages_result = await this.executeQuery("CandProfessionalSkillsModel | createCandProSkillData", insert_cand_languages_query);
            }

            /* If cand_technologies is present, insert to cand_technologies table owned by the current candidate */
            if(cand_technologies.length > 0){
                let cand_technologies_to_insert = [];

                for(let index = 0; index < cand_technologies.length; index++){
                    cand_technologies_to_insert.push(mysqlFormat(`(?,?,NOW(),NOW())`, [candidate_id, cand_technologies[index]]));
                }

                let insert_cand_technologies_query = mysqlFormat(`INSERT INTO cand_technologies (candidate_id, dev_technology_id, created_at, updated_at) VALUES ` + cand_technologies_to_insert.join(","));
                insert_cand_technologies_result = await this.executeQuery("CandProfessionalSkillsModel | createCandProSkillData", insert_cand_technologies_query);
            }

            response_data.status = (insert_cand_languages_result && Object.keys(insert_cand_languages_result).length != 0) || (insert_cand_technologies_result && Object.keys(insert_cand_technologies_result).length != 0);
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to create cand_professional_skills data.";
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that deletes the professional skills selected by the candidate. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 24, 2022 <br>
    * @async
    * @function
    * @memberOf CandProfessionalSkillsModel
    * @param {object} where_params - Requires the params (cand_languages, cand_technologies, candidate_id)
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Fitz
    */
    deleteCandProSkillData = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let { cand_languages, cand_technologies, candidate_id } = params;
            let delete_cand_languages_result, delete_cand_technologies_result = {};

            /* Delete given cand_languages of the current candidate */
            if(cand_languages.length > 0){
                let delete_cand_languages_query = mysqlFormat(`DELETE FROM cand_languages WHERE candidate_id = ? AND dev_language_id IN (?)` , [candidate_id, cand_languages]);
                delete_cand_languages_result = await this.executeQuery("CandProfessionalSkillsModel | deleteCandProSkillData", delete_cand_languages_query);
            }

            /* Delete given cand_languages of the current candidate */
            if(cand_technologies.length > 0){
                let delete_cand_technologies_query = mysqlFormat(`DELETE FROM cand_technologies WHERE candidate_id = ? AND dev_technology_id IN (?)` , [candidate_id, cand_technologies]);
                delete_cand_technologies_result = await this.executeQuery("CandProfessionalSkillsModel | deleteCandProSkillData", delete_cand_technologies_query);
            }

            response_data.status = (delete_cand_languages_result && Object.keys(delete_cand_languages_result).length != 0) || (delete_cand_technologies_result && Object.keys(delete_cand_technologies_result).length != 0);
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to delete cand_professional_skills data.";
        }

        return response_data;
    }
}

export default CandProfessionalSkillsModel;