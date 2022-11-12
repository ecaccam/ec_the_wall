/* HACK: fix for babel issue with async functions */
import regeneratorRuntime          from "regenerator-runtime";

/* Imports for models */
import { format as mysqlFormat }   from "mysql";
import DatabaseModel               from "./database-query-model/lib/database.model";
import UsersModel                  from "./users.model";
import CandLocationsModel          from "./cand_locations.model";
import CandJobPreferencesModel     from "./cand_job_preferences.model";
import CandEducationsModel         from "./cand_educations.model";
import CandProfessionalSkillsModel from "./cand_professional_skills.model";

/* Imports for constants */
import { DATABASE_QUERY_SETTINGS, }     from "../config/constants/app.constants";
import { CURRENT_PAGE, CANDIDATE_PROFILE_UPDATE_TYPE, ADMIN_FILTER_SETTINGS }                 from "../config/constants";
import { BOOLEAN_FIELD, US_COUNTRY_ID, US_STATES, USER_LEVELS, CONTACT_TYPE, YEARS_OF_WORK_EXPERIENCE_VALUE_DATA } from "../config/constants/shared.constants";


/* Imports for helpers */
import Moment from "moment";
import ZiptasticapiHelper from "../helpers/ziptasticapi.helper";

/* Imports for Helpers */
import FileHelper from "../helpers/file.helper.js";

/**
* @class
* All method here are related to Candidates. <br>
* Last Updated Date: August 11, 2022
* @extends DatabaseModel
*/
class CandidatesModel extends DatabaseModel{
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
    * DOCU: This is a function that fetch the specific fields in users depending on the where_params. <br>
    * This can be reusable when fetching data from users table. <br>
    * Triggered by authenticateUser, createUserRecord <br>
    * Last updated at: August 1, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} where_params - Requires the where_params (where condition object) - Optionals (fields_to_select)
    * @returns response_data - { status: true/false, result: {company_user_data}, error, message }
    * @author Erick
    */
    getCandidateData = async (where_params, fields_to_select=null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to select company_user record */
            let generate_select_candidate_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.and_conn,
                fields: fields_to_select,
                table: "candidates",
                query_type: DATABASE_QUERY_SETTINGS.type.selq
            }, where_params, []);

            if(generate_select_candidate_query.status){
                let [candidate_data] = await this.executeQuery("CandidateModel | getCandidateData", generate_select_candidate_query.result.raw_query);

                if(candidate_data){
                    response_data.status = true;
                    response_data.result = candidate_data;
                }
                else{
                    response_data.message = "No candidate record found."
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
    * DOCU: This is a function that insert new data in candidates table. <br>
    * Triggered by users.controller/createUser <br>
    * Last updated at: August 1, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} set_params - Requires the set_params (fields and values to be inserted)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Erick
    */
    createCandidateRecord = async (set_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to insert new candidate record */
            let generate_create_candidate_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn,
                fields: null,
                table: "candidates",
                query_type: DATABASE_QUERY_SETTINGS.type.insq
            }, set_params);

            if(generate_create_candidate_query.status){
                let new_candidate_data = await this.executeQuery("CandidateModel | createCandidateRecord", generate_create_candidate_query.result.raw_query);

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
    * DOCU: This is a function that updates candidate record. <br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 11, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} set_params - Requires the set_params (fields and values to be inserted)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    updateCandidateData = async (set_params, value_params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Generate raw query to update users record */
            let generate_update_candidate_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn, 
                fields: null, 
                table: "candidates", 
                query_type: DATABASE_QUERY_SETTINGS.type.updq, 
                condition: { id: '?' }
            }, set_params, [], value_params);

            if(generate_update_candidate_query.status){
                let update_candidate_result = await this.executeQuery("CandidateModel | updateCandidateData", generate_update_candidate_query.result.raw_query);

                response_data.status = (update_candidate_result.affectedRows);
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to update candidate record.";
        }

        return response_data;
    }

    /** 
    * DOCU: This is a function that fetches candidate-related records. <br>
    * Triggered by candidates.controller/getCandidateProfile <br>
    * Last updated at: August 24, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - Requires the params (values to be passed to models)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic, Updated by: Erick, Fitz
    */
    getCandidateProfileDetails = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Backend processes for Onboarding | Candidate Information page */
            if(params.current_page_id === CURRENT_PAGE.cand_information){
                let get_candidate_profile_query = mysqlFormat(`
                    SELECT
                        users.id AS user_id, users.first_name, users.last_name, users.email, users.profile_picture_url,
                        candidates.id AS candidate_id, candidates.short_bio, candidates.security_clearance_id, JSON_UNQUOTE(candidates.relevant_urls) AS relevant_urls,
                        cand_locations.id AS cand_location_id, cand_locations.country_id, cand_locations.city_name AS city, cand_locations.zipcode AS zip_code,
                        cand_job_preferences.id AS cand_job_preferences_id, cand_job_preferences.can_relocate, cand_job_preferences.can_contract_work,
                        cand_job_preferences.job_search_status_id, cand_job_preferences.cand_role_type_ids AS current_desired_job_list,
                        cand_job_preferences.available_start_date, cand_resumes.id AS cand_resume_id, cand_resumes.file_url AS resume_url
                    FROM users
                    INNER JOIN candidates ON candidates.user_id = users.id
                    LEFT JOIN cand_locations ON cand_locations.candidate_id = candidates.id
                    LEFT JOIN cand_job_preferences ON cand_job_preferences.candidate_id = candidates.id
                    LEFT JOIN cand_resumes ON cand_resumes.candidate_id = candidates.id
                    WHERE users.id = ?;
                `, [params.user_id]);

                var [get_candidate_profile] = await this.executeQuery("CandidateModel | getCandidateData", get_candidate_profile_query);

                /* Fetch countries, cand_role_types and append to get_candidate_profile object */
                let get_countries = await this.executeQuery("CandidateModel | getCountriesTypes", mysqlFormat(`SELECT id, name AS label, abbreviated_name AS value FROM countries ORDER BY label;`));
                let get_cand_role_types = await this.executeQuery("CandidateModel | getCandRoleTypes", mysqlFormat(`SELECT id AS value, title AS label FROM cand_role_types;`));

                get_candidate_profile.countries_list       = get_countries;
                get_candidate_profile.relevant_urls        = get_candidate_profile.relevant_urls === null ? [""] : JSON.parse(get_candidate_profile.relevant_urls);
                get_candidate_profile.cand_role_types_list = get_cand_role_types;
            }
            else if(params.current_page_id === CURRENT_PAGE.background){
                let get_candidate_background_query = mysqlFormat(`
                    SELECT
                        users.id, candidates.id AS candidated_id,
                        candidates.is_usa_authorized, candidates.is_visa_sponsorship,
                        cand_educations.id AS cand_educations_id, cand_educations.cand_education_level_id,
                        cand_educations.us_school_id, cand_educations.is_codingdojo_graduate, cand_educations.program_category_id,
                        cand_educations.cd_graduated_at, cand_educations.contact_id,
                        cand_job_preferences.id AS cand_job_preferences_id, cand_job_preferences.years_of_work_experience_id,
                        ( SELECT
                            JSON_OBJECT(
                                "cand_languages_json", (
                                    SELECT
                                    JSON_ARRAYAGG(JSON_OBJECT("value", dev_languages.id, "label", dev_languages.language_name, "is_language", true))
                                    FROM cand_languages
                                    LEFT JOIN dev_languages ON dev_languages.id = cand_languages.dev_language_id
                                    WHERE cand_languages.candidate_id = candidates.id
                                ),
                                "cand_technologies_json", (
                                    SELECT
                                    JSON_ARRAYAGG(JSON_OBJECT("value", dev_technologies.id, "label", dev_technologies.title, "is_language", false))
                                    FROM cand_technologies
                                    LEFT JOIN dev_technologies ON dev_technologies.id = cand_technologies.dev_technology_id
                                    WHERE cand_technologies.candidate_id = candidates.id
                                )
                            )
                        ) AS professional_skills_json
                    FROM candidates
                    LEFT JOIN users ON candidates.user_id = users.id
                    LEFT JOIN cand_educations ON cand_educations.candidate_id = candidates.id
                    LEFT JOIN cand_job_preferences ON cand_job_preferences.candidate_id = candidates.id
                    WHERE candidates.id = ?;`
                , [params.candidate_id]);

                var [get_candidate_profile] = await this.executeQuery("CandidateModel | getCandidateProfileDetails", get_candidate_background_query);

                /* Fetch us_schools, and contacts from CSM then append to get_candidate_profile object to include in result */
                let us_schools_list = await this.executeQuery("CandidateModel | getUSSchools", mysqlFormat(`SELECT id AS value, name AS label FROM us_schools;`));
                let contact_list    = await this.executeQuery("CandidateModel | getContactList", mysqlFormat(`SELECT id AS value, CONCAT(first_name, ' ', last_name) AS label FROM contacts WHERE contact_type_id = ?;`, [CONTACT_TYPE.csm_manager]));

                get_candidate_profile.university                = us_schools_list;
                get_candidate_profile.contact_list              = contact_list;
                get_candidate_profile.professional_skills_json  = JSON.parse(get_candidate_profile.professional_skills_json);
            }
            else{
                /* Generate raw query to fetch candidate profile record of a candidate */
                let candidate_profile_query = mysqlFormat(
                    `SELECT
                        candidates.id, users.first_name, users.last_name, users.email, users.profile_picture_url AS headshot_file,
                        cand_locations.country_id, cand_locations.city_name, us_states.name AS us_state_name, cand_locations.zipcode,
                        ( SELECT JSON_ARRAYAGG(title) FROM cand_role_types WHERE FIND_IN_SET(id, SUBSTRING(cand_job_preferences.cand_role_type_ids, 2, LENGTH(cand_job_preferences.cand_role_type_ids)-2)) ) AS cand_role_types,
                        cand_job_preferences.can_relocate, cand_job_preferences.can_remotely_work, cand_job_preferences.available_start_date, cand_job_preferences.can_contract_work,
                        candidates.short_bio, candidates.security_clearance_id, candidates.relevant_urls, cand_resumes.file_url,
                        cand_educations.cand_education_level_id, cand_educations.us_school_id, cand_educations.is_codingdojo_graduate, cand_educations.program_category_id, cand_educations.cd_graduated_at, cand_educations.contact_id,
                        cand_job_preferences.years_of_work_experience_id, candidates.is_usa_authorized, candidates.is_visa_sponsorship,
                        candidates.vaccination_status_id, candidates.racial_group_ids, candidates.gender, candidates.is_veteran, candidates.updated_at AS last_update_date,
                        ( SELECT
                            JSON_OBJECT(
                                "cand_languages_json", (
                                    SELECT
                                    JSON_ARRAYAGG(JSON_OBJECT("value", dev_languages.id, "label", dev_languages.language_name, "is_language", true))
                                    FROM cand_languages
                                    LEFT JOIN dev_languages ON dev_languages.id = cand_languages.dev_language_id
                                    WHERE cand_languages.candidate_id = candidates.id
                                ),
                                "cand_technologies_json", (
                                    SELECT
                                    JSON_ARRAYAGG(JSON_OBJECT("value", dev_technologies.id, "label", dev_technologies.title, "is_language", false))
                                    FROM cand_technologies
                                    LEFT JOIN dev_technologies ON dev_technologies.id = cand_technologies.dev_technology_id
                                    WHERE cand_technologies.candidate_id = candidates.id
                                )
                            )
                        ) AS cand_professional_skills
                    FROM candidates
                    INNER JOIN users ON users.id = candidates.user_id
                    INNER JOIN cand_locations ON cand_locations.candidate_id = candidates.id
                    INNER JOIN countries ON countries.id = cand_locations.country_id
                    LEFT JOIN us_states ON cand_locations.us_state_id = us_states.id
                    INNER JOIN cand_job_preferences ON cand_job_preferences.candidate_id = candidates.id
                    INNER JOIN cand_resumes ON cand_resumes.candidate_id = candidates.id
                    INNER JOIN cand_educations ON cand_educations.candidate_id = candidates.id
                    INNER JOIN cand_education_levels ON cand_educations.cand_education_level_id = cand_education_levels.id
                    WHERE candidates.id = ?;`, [params.candidate_id]
                );

                var [get_candidate_profile] = await this.executeQuery("CandidateModel | getCandidateProfileDetails", candidate_profile_query);

                /* Fetch dropdown lists to be used in updating candidate profile */
                let get_countries       = await this.executeQuery("CandidateModel | getCountriesTypes", mysqlFormat(`SELECT id, name AS label, abbreviated_name AS value FROM countries ORDER BY label;`));
                let get_cand_role_types = await this.executeQuery("CandidateModel | getCandRoleTypes", mysqlFormat(`SELECT id AS value, title AS label FROM cand_role_types;`));

                /* Fetch us_schools, and contacts from CSM then append to get_candidate_profile object to include in result */
                let us_schools_list = await this.executeQuery("CandidateModel | getUSSchools", mysqlFormat(`SELECT id AS value, name AS label FROM us_schools;`));
                let contact_list    = await this.executeQuery("CandidateModel | getContactList", mysqlFormat(`SELECT id AS value, CONCAT(first_name, ' ', last_name) AS label FROM contacts WHERE contact_type_id = ?;`, [CONTACT_TYPE.csm_manager]));

                get_candidate_profile.countries_list            = get_countries;
                get_candidate_profile.cand_role_types_list      = get_cand_role_types;
                get_candidate_profile.university                = us_schools_list;
                get_candidate_profile.contact_list              = contact_list;
            }

            if(get_candidate_profile){
                response_data.status = true;
                response_data.result = get_candidate_profile;
            }
            else{
                response_data.message = "No candidate profile record found."
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = 'Failed to fetch candidate record. Refresh the page and try again.';
        }

        return response_data;
    }

    /** 
    * DOCU: This is a function that updates Onboarding records. <br>
    * Triggered by candidates.controller/updateOnboarding <br>
    * Last updated at: August 24, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - Requires the params (form values to be passed in needed models)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic, Updated by: Erick, Fitz, CE
    */
    updateOnboardingDetails = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let { current_page_id, is_save_and_exit } = params;

            /* Backend processes for Onboaring | Candidate Information page */
            if(current_page_id === CURRENT_PAGE.cand_information){
                let { candidate_id, user_id, first_name, last_name, email } = params;

                /* Update values in Users table */
                let update_user_information = await this.__updateUserInformation({ user_id, first_name, last_name, email });

                if(!(update_user_information.status)){
                    response_data.error = update_user_information.error
                    throw new Error(update_user_information.message);
                }

                let { country_list, zip_code, city } = params;

                /* Check if country is US */
                if(country_list === US_COUNTRY_ID){
                    let ziptasticapiHelper = new ZiptasticapiHelper();
                    let ziptasticapi_fetch = await ziptasticapiHelper.processZiptasticapiData(zip_code);

                    if(!("error" in ziptasticapi_fetch.result)){
                        /* get us_state_id based on state_code */
                        var us_state_id = US_STATES[ziptasticapi_fetch.result.state];

                        /* set value for city (titleize city) */
                        city = ziptasticapi_fetch.result.city.toLowerCase().replace(/(?:^|\s|-)\S/g, other_char => other_char.toUpperCase());
                    }
                    else{
                        response_data.error = "zipcode_err";
                        throw new Error(ziptasticapi_fetch.result.error);
                    }
                }
                else {
                    zip_code = null;
                }

                /* Check if we need to create/update cand_location record */
                let candLocationModel  = new CandLocationsModel();
                let get_cand_locations = await candLocationModel.getCandLocationData({ candidate_id }, "id");

                if(!(get_cand_locations.status)) {
                    /* Create cand_locations record */
                    var cand_locations_process = await candLocationModel.createCandLocationRecord({ 
                        candidate_id,
                        country_id: country_list,
                        us_state_id: (us_state_id) ? us_state_id : null,
                        city_name: city,
                        zipcode: zip_code
                    });
                }
                else {
                    /* Update cand_locations record */
                    var cand_locations_process = await candLocationModel.updateCandLocationRecord(
                        { country_id: '?', us_state_id: '?', city_name: '?', zipcode: '?' }, 
                        [ country_list, (us_state_id) ? us_state_id : null, city, zip_code, get_cand_locations.result.id ]
                    );
                }
                    
                if(!(cand_locations_process.status)){
                    throw new Error(cand_locations_process.error);
                }
                else {
                    /* Store cand_location_id in variable to be used in updated candidate record */
                    var cand_location_id = (get_cand_locations.status) ? get_cand_locations.result.id : cand_locations_process.result.cand_location_id;
                }

                /* Check if we need to create/update cand_job_preferences record */
                let candJobPreferencesModel  = new CandJobPreferencesModel();
                let get_cand_job_preferences = await candJobPreferencesModel.getCandJobPreferenceData({ candidate_id }, "id");

                let { current_desired_job_list, stage_job_search_list, set_available_start_date, open_relocation_checkbox, open_contract_checkbox } = params;

                if(!(get_cand_job_preferences.status)){
                    /* Create cand_job_preferences record */
                    var cand_job_preferences_process = await candJobPreferencesModel.createCandJobPreferenceRecord({ 
                        candidate_id,
                        cand_role_type_ids: JSON.stringify(current_desired_job_list),
                        job_search_status_id: stage_job_search_list,
                        available_start_date: Moment(set_available_start_date).format("YYYY-MM-DD"),
                        can_relocate: open_relocation_checkbox,
                        can_contract_work: open_contract_checkbox
                    });
                } 
                else {
                    /* Update cand_job_preferences record */
                    var cand_job_preferences_process = await candJobPreferencesModel.updateCandJobPreferenceRecord({ 
                        cand_role_type_ids: '?',
                        job_search_status_id: '?',
                        available_start_date: '?',
                        can_relocate: '?',
                        can_contract_work: '?'
                    }, 
                    [
                        JSON.stringify(current_desired_job_list),
                        stage_job_search_list,
                        Moment(set_available_start_date).format("YYYY-MM-DD"),
                        parseInt(open_relocation_checkbox),
                        parseInt(open_contract_checkbox),
                        get_cand_job_preferences.result.id
                    ]);
                }
                
                if(!(cand_job_preferences_process.status)){
                    throw new Error(cand_job_preferences_process.error);
                }

                let { short_bio, security_clearance_list, fetch_portfolio_links } = params;

                /* Update candidate record */
                let set_params = { cand_location_id: '?', short_bio: '?', security_clearance_id: '?', relevant_urls: '?' };
                let value_params = [ cand_location_id, short_bio, security_clearance_list, JSON.stringify(fetch_portfolio_links) ];

                /* Check if candidate clicked save and exit */
                if(is_save_and_exit){
                    set_params.current_page_id = '?';
                    value_params.push(current_page_id);
                }
                else {
                    current_page_id += 1;
                }

                /* push candidate_id so it will be the last value in the array */
                value_params.push(candidate_id);

                let update_candidate = await this.updateCandidateData(set_params, value_params);

                if(!(update_candidate.status)){
                    throw new Error(update_candidate.error);
                }

                response_data.status = true;
                response_data.result = { is_save_and_exit, current_page_id }
            }
            else if(current_page_id === CURRENT_PAGE.background){
                /* Check if we need to create/update cand_educations record */
                let candEducationsModel  = new CandEducationsModel();
                let cand_educations_data = await candEducationsModel.getCandEducationData({candidate_id: params.candidate_id}, "id");

                if(cand_educations_data.status){
                    /* Update Candidate Education of the candidate */
                    var cand_educations_process = await candEducationsModel.updateCandEducationRecord(
                        {
                            cand_education_level_id: '?',
                            contact_id: '?',
                            program_category_id: "?",
                            us_school_id: '?',
                            cd_graduated_at: '?',
                            is_codingdojo_graduate: '?'
                        },[
                            params.highest_degree || null,
                            params.career_service_manager || null,
                            params.coding_dojo_program || null,
                            params.university || null,
                            (params.graduate_date) ? Moment(params.graduate_date).format("YYYY-MM-DD") : null,
                            params.is_coding_dojo_graduate,
                            cand_educations_data.result.id
                        ]
                    );
                }
                else{
                     /* Create a new cand_education record for the candidate*/
                     var cand_educations_process = await candEducationsModel.createCandEducationRecord({
                        candidate_id: params.candidate_id,
                        cand_education_level_id: params.highest_degree,
                        contact_id: params.career_service_manager,
                        program_category_id: params.coding_dojo_program,
                        us_school_id: params.university,
                        cd_graduated_at: (params.graduate_date) ? Moment(params.graduate_date).format("YYYY-MM-DD") : null,
                        is_codingdojo_graduate: params.is_coding_dojo_graduate
                    });
                }

                if(!(cand_educations_process.status)){
                    throw new Error(cand_educations_process.error);
                }

                /* Get current candidate professional skills and compare the current data to the professional skills comes from the form */
                let {candidate_languages, candidate_technologies}   = params.program_coverage;
                let candProfessionalSkillsModel                     = new CandProfessionalSkillsModel();
                let get_cand_professional_skills                    = await candProfessionalSkillsModel.getProfessionalSkillsData(params.candidate_id);

                if(get_cand_professional_skills.status){
                    /* The following blocks of code to add or delete professional skills record */
                    /* Declare variables to use */
                    let {cand_languages_json, cand_technologies_json} = get_cand_professional_skills.result.cand_professional_skills
                    let cand_languages_to_add, cand_languages_to_remove, cand_technologies_to_add, cand_technologies_to_remove = [];

                    /* TODO: For code cleanup, maybe we can move this to a private, manipulation of skills(languages, techonologies) arrays */
                    if(candidate_languages.length > 0){
                        /* Prepare data to create or delete languages skillset */
                        if(cand_languages_json){
                            cand_languages_to_remove    = cand_languages_json.filter(element => !candidate_languages.includes(element.id)).map(element => element.id);
                            cand_languages_to_add       = candidate_languages.filter(element => !cand_languages_json.map(element => element.id).includes(element));
                        }
                        else{
                            cand_languages_to_add = candidate_languages;
                        }
                    }
                    else if(candidate_languages.length <= 0 && cand_languages_json.length > 0){
                        /* Delete all existing since there are no selected candidate language skills */
                        cand_languages_to_remove = cand_languages_json.map(element => element.id);
                    }

                    if(candidate_technologies.length > 0){
                        /* Prepare data to create or delete technologies skillset */
                        if(cand_technologies_json){
                            cand_technologies_to_remove     = cand_technologies_json.filter(element => !candidate_technologies.includes(element.id)).map(element => element.id);
                            cand_technologies_to_add        = candidate_technologies.filter(element => !cand_technologies_json.map(element => element.id).includes(element));
                        }
                        else{
                            cand_technologies_to_add = candidate_technologies;
                        }
                    }
                    else if(candidate_technologies.length <= 0 && cand_technologies_json.length > 0){
                        /* Delete all existing since there are no selected candidate technologies skills */
                        cand_technologies_to_remove = cand_technologies_json.map(element => element.id);
                    }

                    /* If one of each changes is present, execute createCandProSkillData and deleteCandProSkillData functions */
                    if(cand_languages_to_add.length > 0 || cand_technologies_to_add.length > 0 || cand_languages_to_remove.length > 0 || cand_technologies_to_remove.length > 0){
                        let create_cand_professional_skills = await candProfessionalSkillsModel.createCandProSkillData({cand_languages: cand_languages_to_add, cand_technologies: cand_technologies_to_add, candidate_id: params.candidate_id});
                        let delete_cand_professional_skills = await candProfessionalSkillsModel.deleteCandProSkillData({cand_languages: cand_languages_to_remove, cand_technologies: cand_technologies_to_remove, candidate_id: params.candidate_id});

                        /* If both functions failed, raise an error */
                        if(!create_cand_professional_skills.status && !delete_cand_professional_skills.status){
                            throw new Error(create_cand_professional_skills.error || delete_cand_professional_skills.error);
                        }
                    }
                }
                else{
                    /* Add all professional skills present to candidate since there is no existing data */
                    let create_cand_professional_skills = await candProfessionalSkillsModel.createCandProSkillData({cand_languages: candidate_languages, cand_technologies: candidate_technologies, candidate_id: params.candidate_id});

                    if(!(create_cand_professional_skills.status)){
                        throw new Error(create_cand_professional_skills.error);
                    }
                }

                /* Get cand_job_preferences record of the candidate to update years of work experience record */
                let candJobPreferencesModel  = new CandJobPreferencesModel();
                let get_cand_job_preferences = await candJobPreferencesModel.getCandJobPreferenceData({ candidate_id: params.candidate_id }, "id");

                if(get_cand_job_preferences.status){
                    /* Update years of work experience record of the candidate */
                    var update_cand_job_preferences = await candJobPreferencesModel.updateCandJobPreferenceRecord(
                        { years_of_work_experience_id: '?' },
                        [params.years_experience, get_cand_job_preferences.result.id]
                    );

                    if(!(update_cand_job_preferences.status)){
                        throw new Error(update_cand_job_preferences.error);
                    }
                }
                else{
                    /* Throw error missing get_cand_job_preferences of the candidate because the record must be present */
                    throw new Error(get_cand_job_preferences.message);
                }

                /* Update is_usa_authorized and is_visa_sponsorship of the candidate. Update current_page_id of the candidate if save and exit in Background page */
                let set_params = { is_usa_authorized: '?', is_visa_sponsorship: '?' };
                let value_params = [ params.authorize_work, params.sponsorship_employment ];

                /* Check if candidate clicked save and exit */
                if(params.is_save_and_exit){
                    set_params.current_page_id = '?';
                    value_params.push(current_page_id);
                }
                else {
                    current_page_id += 1;
                }

                /* Push candidate_id so it will be the last value in the array */
                value_params.push(params.candidate_id);

                /* Update is_usa_authorized and is_visa_sponsorship of the candidate*/
                let update_candidate = await this.updateCandidateData(set_params, value_params);

                if(!(update_candidate.status)){
                    throw new Error(update_candidate.error);
                }

                response_data.status = true;
                response_data.result = {
                    "is_save_and_exit": params.is_save_and_exit,
                    "current_page_id": current_page_id
                }
            }
            else if(current_page_id === CURRENT_PAGE.more_about_you){
                let { candidate_id, current_page_id, vaccination_status, racial_group, gender_identity, is_veteran, is_save_and_exit } = params;

                let update_candidate = await this.updateCandidateData(
                    {vaccination_status_id: '?', current_page_id, racial_group_ids: '?', gender: '?', is_veteran: '?'}, 
                    [(vaccination_status.toString() || null), (is_save_and_exit ? current_page_id : CURRENT_PAGE.cand_profile), ((racial_group) ? JSON.stringify(racial_group) : null), (gender_identity || null), (is_veteran || null), candidate_id]
                );

                if(update_candidate.status){
                    response_data.status = true;
                    response_data.result = { is_save_and_exit, "current_page_id": CURRENT_PAGE.cand_profile }
                }
                else{
                    response_data.message = update_candidate.message;
                }
            }

            /** Check If response_data.status is true AND
             *      is_save_andexit
             *        OR
             *      If response_data.result.current_page_id is equal to CURRENT_PAGE.cand_profile */
            if(response_data.status && (response_data.result.is_save_and_exit || (response_data.result.current_page_id === CURRENT_PAGE.cand_profile))){
                response_data.result.redirect_url = (response_data.result.is_save_and_exit) ? "/sign-out" : "/profile-information";
            }
        }
        catch(error){
            response_data.message = error.message;
        }

        return response_data;
    }

    /** 
    * DOCU: This is a function that updates Candidate Profile records. <br>
    * Triggered by candidates.controller/updateCandidateProfile <br>
    * Last updated at: August 25, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - Requires the params (form values to be passed in needed models)
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic, Updated by: Erick, Adrian
    */
    updateCandidateProfileDetails = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            switch(parseInt(params.update_type)){
                /* Update candidate details in User Information Section */
                case CANDIDATE_PROFILE_UPDATE_TYPE.user_information:
                    response_data = await this.__updateUserInformation(params, CANDIDATE_PROFILE_UPDATE_TYPE.user_information);

                    if(!(response_data.status)){
                        throw new Error(response_data.message);
                    }

                    break;
                case CANDIDATE_PROFILE_UPDATE_TYPE.education:
                    var { highest_degree, university, is_coding_dojo_graduate, coding_dojo_program, graduate_date, career_service_manager, candidate_id } = params;

                    var candEducationsModel    = new CandEducationsModel();
                    var get_cand_educations    = await candEducationsModel.getCandEducationData({ candidate_id }, "id");
                    var set_params             = { cand_education_level_id: '?', us_school_id: '?', is_codingdojo_graduate: '?' };
                    var value_params           = [highest_degree, university, is_coding_dojo_graduate];

                    /* Pass additional values to set_params if candidate is a coding dojo graduate */
                    if(parseInt(is_coding_dojo_graduate)){
                        set_params.program_category_id = '?';
                        set_params.cd_graduated_at     = '?';
                        set_params.contact_id          = '?';

                        value_params.push(coding_dojo_program, Moment(graduate_date).format("YYYY-MM-DD"), career_service_manager);
                    }

                    /* push cand_educations.id last so it will be the last value in value_params array */
                    value_params.push(get_cand_educations.result.id);

                    var update_cand_educations = await candEducationsModel.updateCandEducationRecord(set_params, value_params);

                    /* TODO: Initial code for updating education section. Add other update queries when Education Section is done. */
                    if(update_cand_educations.status){
                        response_data.status = true;
                        response_data.result = {
                            update_type: CANDIDATE_PROFILE_UPDATE_TYPE.education,
                            graduate_date: Moment(graduate_date).format("YYYY-MM-DD"),
                            is_coding_dojo_graduate,
                            highest_degree,
                            university,
                            coding_dojo_program,
                            career_service_manager
                        }
                    }
                    else{
                        throw new Error(update_cand_educations.message);
                    }

                    break;
                /* Update candidate details in Work Experience Section */
                case CANDIDATE_PROFILE_UPDATE_TYPE.work_experience:
                    /* Update cand_job_preferences record */
                    response_data = await this.__updateWorkExperience(params, CANDIDATE_PROFILE_UPDATE_TYPE.work_experience);
                    
                    if(!response_data.status){
                        throw new Error(response_data.message);
                    }

                    break;
                /* Update candidate details in More About You Section */
                case CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you:
                    response_data = await this.__updateMoreAboutYou(params, CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you);
                    
                    if(!response_data.status){
                        throw new Error(response_data.message);
                    }

                    break;
                /* Update candidate details in Candidate Information Section */
                case CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information:
                    /* Start the transaction here */
                    let tconnection = await this.startTransaction("CandidateModel | updateCandidateProfileDetails");

                    try{
                        /* Destructure the parameters */
                        let { candidate_id, fetch_portfolio_links, short_bio, open_contract_checkbox, open_relocation_checkbox, set_available_start_date, security_clearance_id, country_id, current_desired_job, zip_code, city, us_state_id } = params;

                        /* Update the candidate records */
                        let update_candidate_record = await this.updateCandidateData({ relevant_urls: "?", short_bio: "?", security_clearance_id: "?" }, [JSON.stringify(fetch_portfolio_links), short_bio, security_clearance_id, candidate_id]);

                        if(update_candidate_record.status){
                            /* Get the cand job preference id and update it based on the candidate_id */
                            let candJobPreferencesModel = new CandJobPreferencesModel();
                            let get_cand_job_preferences    = await candJobPreferencesModel.getCandJobPreferenceData({ candidate_id }, 'id');

                            /* Declare the needed parameters in updating cand_job_preferences */
                            let cand_job_preferences_params = { cand_role_type_ids: '?', can_relocate: '?', can_contract_work: '?', available_start_date: '?' };
                            let cand_job_preferences_values = [JSON.stringify(current_desired_job), open_relocation_checkbox, open_contract_checkbox, set_available_start_date, get_cand_job_preferences.result.id];


                            let update_cand_job_preferences = await candJobPreferencesModel.updateCandJobPreferenceRecord(cand_job_preferences_params, cand_job_preferences_values);

                            if(country_id === US_COUNTRY_ID){
                                let ziptasticapiHelper = new ZiptasticapiHelper();
                                let ziptasticapi_fetch = await ziptasticapiHelper.processZiptasticapiData(zip_code);

                                if(!("error" in ziptasticapi_fetch.result)){
                                    /* get us_state_id based on state_code */
                                    us_state_id = US_STATES[ziptasticapi_fetch.result.state];

                                    /* set value for city (titleize city) */
                                    city = ziptasticapi_fetch.result.city.toLowerCase().replace(/(?:^|\s|-)\S/g, other_char => other_char.toUpperCase());
                                }
                                else{
                                    response_data.error = "zipcode_err";
                                    throw new Error(ziptasticapi_fetch.result.error);
                                }
                            }
                            else {
                                params.zip_code = null;
                            }

                            /* Update cand_locations record */
                            let candLocationModel  = new CandLocationsModel();
                            let get_cand_locations = await candLocationModel.getCandLocationData({ candidate_id: params.candidate_id }, "id");

                            let cand_locations_process = await candLocationModel.updateCandLocationRecord(
                                { country_id: '?', us_state_id: '?', city_name: '?', zipcode: '?' },
                                [ country_id, ("us_state_id" in params) ? params.us_state_id : null, city, zip_code, get_cand_locations.result.id ]
                            );

                            if(!cand_locations_process.status){
                                throw new Error("Error in updating candidate location. Please try again later");
                            }

                            if(update_cand_job_preferences.status){
                                response_data.status = true;
                                response_data.result = {
                                    update_type: CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information,
                                    fetch_portfolio_links, short_bio, open_contract_checkbox, open_relocation_checkbox, set_available_start_date, current_desired_job, us_state_id: us_state_id, zip_code, city, country: country_id
                                }

                                await this.commitTransaction(tconnection);
                            }
                            else{
                                throw new Error("Couldn't update candidate job preferences.");
                            }
                        }
                        else{
                            throw new Error("Couldn't update candidate record.");
                        }
                    }
                    catch(error){
                        console.log(error);
                        await this.cancelTransaction(undefined, tconnection);
                        response_data.error = error;
                    }

                    break;
                /* Update all candidate details */
                default:
                    /* Update User Information */
                    let update_user_information = await this.__updateUserInformation(params, CANDIDATE_PROFILE_UPDATE_TYPE.all);

                    if(!(update_user_information.status)){
                        response_data.error = update_user_information.error;
                        throw new Error(update_user_information.error);
                    }

                    /* Update Candidate Information */
                    let update_candidate_information = await this.__updateCandidateInformation(params, CANDIDATE_PROFILE_UPDATE_TYPE.all);

                    if(!(update_candidate_information.status)){
                        response_data.error = update_candidate_information.error;
                        throw new Error(update_candidate_information.error);
                    }

                    /* Update Education */
                    var { highest_degree, university, is_coding_dojo_graduate, coding_dojo_program, graduate_date, career_service_manager, candidate_id } = params;

                    var candEducationsModel = new CandEducationsModel();
                    var get_cand_educations = await candEducationsModel.getCandEducationData({ candidate_id }, "id");
                    var set_params          = { cand_education_level_id: '?', us_school_id: '?', is_codingdojo_graduate: '?' };
                    var value_params        = [highest_degree, university, is_coding_dojo_graduate];

                    /* Pass additional values to set_params if candidate is a coding dojo graduate */
                    if(parseInt(is_coding_dojo_graduate)){
                        set_params = { ...set_params, program_category_id: '?', cd_graduated_at: '?', contact_id: '?'};

                        value_params.push(coding_dojo_program, Moment(graduate_date).format("YYYY-MM-DD"), career_service_manager);
                    }

                    /* push cand_educations.id last so it will be the last value in value_params array */
                    value_params.push(get_cand_educations.result.id);

                    var update_cand_educations = await candEducationsModel.updateCandEducationRecord(set_params, value_params);

                    /* TODO: Initial code for updating education section. Add other update queries when Education Section is done. */
                    if(!update_cand_educations.status){
                        throw new Error(update_cand_educations.message);
                    }

                    /* Update Work Experience record */
                    let update_work_experience = await this.__updateWorkExperience(params);

                    if(!update_work_experience.status){
                        response_data.error = update_work_experience.error;
                        throw new Error(update_work_experience.message);
                    }

                    /* Update More About You */
                    let update_more_about_you = await this.__updateMoreAboutYou(params);

                    /* Check if updating of candidates is successful. */
                    if(!update_more_about_you.status){
                        response_data.error = update_more_about_you.error;
                        throw new Error(update_more_about_you.message);
                    }

                    response_data.status = true;
                    response_data.result = {
                        ...update_user_information.result,
                        ...update_candidate_information.result,
                        ...update_work_experience.result,
                        ...update_more_about_you.result,
                        update_type: CANDIDATE_PROFILE_UPDATE_TYPE.all, graduate_date: Moment(graduate_date).format("YYYY-MM-DD"),
                        is_coding_dojo_graduate, highest_degree, university, coding_dojo_program, career_service_manager,
                    }
            }
        }
        catch(error){
            response_data.message = error.message;
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that insert new data in candidates table. <br>
    * Triggered by users.controller/createUser <br>
    * Last updated at: August 15, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - Requires file and user_id
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Adrian
    */
    updateUserHeadshot = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Fetch if the candidate is existing */
            let userModel  = new UsersModel();
            let user_record = await userModel.getUserData({id: params.user_id}, "*");

            if(user_record.status){
                let fileHelper = new FileHelper();

                /* TODO: Will have constant for upload type */
                /* upload the file to s3*/
                let upload_file_to_s3 = await fileHelper.uploadToS3(params.file, "headshot", params.user_id);

                if(upload_file_to_s3.status){
                    /* Update the user record */
                    let update_user_record = await userModel.updateUserRecord({profile_picture_url: '?'}, [upload_file_to_s3.file_url, params.user_id]);

                    if(update_user_record.status){
                        /* delete the previous headshot if existing */
                        if(user_record.result.profile_picture_url !== null){
                            fileHelper.deleteFileFromS3(user_record.result.profile_picture_url);
                        }

                        response_data.status = true;
                        response_data.result.file_url = upload_file_to_s3.file_url;
                    }
                    else{
                        throw new Error("Error in update_user_record, Please try again later");
                    }
                }
                else{
                    throw new Error(upload_file_to_s3.error);
                }
            }
            else{
                throw new Error(user_record.error);
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that update specific fields in candidates depending on the set_params and value_params. <br>
    * This can be reusable when updating data in candidates table. <br>
    * Triggered by uploadUserResume <br>
    * Last updated at: August 11, 2022 <br>
    * @async
    * @function
    * @memberOf CandidatesModel
    * @param {object} where_params - Requires the set_params (fields to be updated)
    * @param {object} value_params - Requires the value_params (new value to be update)
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Adrian
    */
    updateCandidateData = async (set_params, value_params) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            /* Generate raw query to update users record */
            let generate_update_users_query = this.generateRawQuery({
                connector: DATABASE_QUERY_SETTINGS.connectors.ins_upd_conn,
                fields: null,
                table: "candidates",
                query_type: DATABASE_QUERY_SETTINGS.type.updq,
                condition: { id: '?' }
            }, set_params, [], value_params);

            if (generate_update_users_query.status) {
                let update_user_result = await this.executeQuery("CandidatesModel | updateCandidateData", generate_update_users_query.result.raw_query);

                response_data.status = (update_user_result.affectedRows);
            }
        }
        catch (error) {
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to update user record.";
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that insert new data in candidates table. <br>
    * Triggered by users.controller/createUser <br>
    * Last updated at: August 15, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - Requires file and user_id
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Adrian
    */
    updateCandidateRelevantLinks = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let update_candidate_record = await this.updateCandidateData({ relevant_urls: "?" }, [JSON.stringify(params.portfolio_links), params.candidate_id])

            if (update_candidate_record.status){
                response_data.status = true;
                response_data.result.relevant_urls = params.portfolio_links;
            }
            else{
                throw new Error("Error in updating candidate data, Please try again later.")
            }
        }
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that fetches the candidates.<br>
    * Triggered by admins.controller/searchCandidates <br>
    * Last updated at: August 23, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - search_keyword, sort_order, page_limit
    * @returns response_data - { status: true/false, result: [search_candidates],  error, message }
    * @author Adrian, Updated by: Erick, CE
    */
    getCandidates = async (params) => {
        let response_data = { status: false, result: [], error: null };

        try {
            let { is_export, search_keyword, sort_order, page_limit } = params || {};

            let get_candidates_query = mysqlFormat(`
                SELECT
                    users.id AS user_id, first_name, last_name, CONCAT(first_name, " ", last_name) AS full_name, email, is_active, users.profile_picture_url,
                    (CASE
                        WHEN cand_locations.country_id = ${US_COUNTRY_ID} THEN CONCAT(cand_locations.city_name,  ", ", us_states.name, " " , countries.name)
                        ELSE CONCAT(cand_locations.city_name, ", " , countries.name) END
                    ) AS cand_location,
                    DATE_FORMAT(cd_graduated_at, '%b %d %Y') AS cd_graduated_at, 
                    DATE_FORMAT(candidates.updated_at, '%b %d %Y') AS last_modified_at,
                    cand_job_preferences.years_of_work_experience_id AS experience_level
                    ${ (is_export) ? ', candidate_language_skills.skill_languages, candidate_technologies_skills.skill_technologies' : '' }
                FROM users
                INNER JOIN candidates ON candidates.user_id = users.id
                LEFT JOIN cand_locations ON candidates.id = cand_locations.candidate_id
                LEFT JOIN countries ON countries.id = cand_locations.country_id
                LEFT JOIN cand_job_preferences ON cand_job_preferences.candidate_id = candidates.id
                LEFT JOIN cand_educations ON cand_educations.candidate_id = candidates.id
                LEFT JOIN us_states ON us_states.id = cand_locations.us_state_id
                ${ (is_export) ? 
                `LEFT JOIN (
                    SELECT candidate_id, JSON_ARRAYAGG(dev_languages.language_name) AS skill_languages
                    FROM cand_languages
                    INNER JOIN dev_languages ON dev_languages.id = cand_languages.dev_language_id
                    GROUP BY candidate_id
                ) candidate_language_skills ON candidate_language_skills.candidate_id = candidates.id
                LEFT JOIN (
                    SELECT candidate_id, JSON_ARRAYAGG(dev_technologies.title) AS skill_technologies
                    FROM cand_technologies
                    INNER JOIN dev_technologies ON dev_technologies.id = cand_technologies.dev_technology_id
                    GROUP BY candidate_id
                ) candidate_technologies_skills ON candidate_technologies_skills.candidate_id = candidates.id` : ``}
                WHERE users.user_level_id = ?
                ${ search_keyword ? `AND (first_name LIKE '%${search_keyword}%' OR last_name LIKE '%${search_keyword}%' OR email LIKE '%${search_keyword}%')` : '' }
                GROUP BY users.id
                ${ADMIN_FILTER_SETTINGS.sort_order[(sort_order ?? 0).toString()]}
                ${page_limit ? `LIMIT ${page_limit}` : ''}
            `, [USER_LEVELS.candidate]);

            let search_candidates = await this.executeQuery("CandidateModel | get_candidates", get_candidates_query);

            if(search_candidates){
                /* Check if the admin is exporting the candidate result. */
                if(is_export){
                    /* Loop thru candidates to manipulate the data for technical skills and work experience level */
                    search_candidates.map((candidate, index) => {
                        let cand_languages    = (candidate.skill_languages) ? JSON.parse(candidate.skill_languages) : [];
                        let cand_technologies = (candidate.skill_technologies) ? JSON.parse(candidate.skill_technologies) : [];
                        
                        search_candidates[index].technical_skills = cand_technologies.concat(cand_languages).join(", ");
                        search_candidates[index].experience_level = (candidate.experience_level) ? YEARS_OF_WORK_EXPERIENCE_VALUE_DATA[candidate.experience_level.toString()].label : "";
                    })
                }

                response_data.status = true;
                response_data.result = search_candidates;
            }
            else{
                throw new Error("An error occurred while retrieving candidates.");
            }
        }
        catch (error) {
            console.log(error);
            response_data.error = error;
            response_data.message = "There was an error in retrieving candidates data.";
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that updates user information.<br>
    * Triggered by candidates.model/updateOnboardingDetails, updateCandidateProfileDetails <br>
    * Last updated at: August 22, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - user_id, first_name, last_name, email
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    __updateUserInformation = async (params, update_type = null) => {
        let response_data = { status: false, result: {}, error: null };
    
        try {
            let { user_id, first_name, last_name, email } = params;
    
            let userModel = new UsersModel();
    
            /* check if email exists if email was changed */
            let get_user = await userModel.getUserData({ email, is_active: BOOLEAN_FIELD.yes_value }, "id");
    
            if(get_user.status && get_user.result.id !== user_id){
                response_data.error = "email_err";
                throw new Error("Email is already registed to another account!");
            }
    
            /* Update values in Users table */
            response_data = await userModel.updateUserRecord({email: '?', first_name: '?', last_name: '?'}, [email, first_name, last_name, user_id]);
    
            if(!(response_data.status)){
                throw new Error(response_data.error);
            }

            response_data.result = { update_type, user_id, first_name, last_name, email };
        }
        catch (error) {
            response_data.message = error.message;
        }
        
        return response_data;
    }

    /**
    * DOCU: This is a function that updates candidate information.<br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 24, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - candidate_id, country, get_region, city, zip_code, relocation_checkbox, 
                               contract_checkbox, start_date, get_current_desired_job, short_bio, 
                               get_security_clearance, portfolio_link_item
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    __updateCandidateInformation = async (params, update_type = null) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let {
                candidate_id, country, city, zip_code, relocation_checkbox, 
                contract_checkbox, start_date, get_current_desired_job, short_bio, 
                get_security_clearance, portfolio_link_item
            } = params;

            let get_region = null;

            /* Check if country is US */
            if(country === US_COUNTRY_ID){
                let ziptasticapiHelper = new ZiptasticapiHelper();
                let ziptasticapi_fetch = await ziptasticapiHelper.processZiptasticapiData(zip_code);

                if(!("error" in ziptasticapi_fetch.result)){
                    /* get us_state_id based on state_code */
                    get_region = US_STATES[ziptasticapi_fetch.result.state];

                    /* set value for city (titleize city) */
                    city = ziptasticapi_fetch.result.city.toLowerCase().replace(/(?:^|\s|-)\S/g, other_char => other_char.toUpperCase());

                    /* fetch city and state_name for displaying in FE */
                    var [get_state] = await this.executeQuery("CandidateModel | getState", mysqlFormat(`SELECT name FROM us_states WHERE id = ?;`, [get_region]));
                }
                else{
                    response_data.error = "zipcode_err";
                    throw new Error(ziptasticapi_fetch.result.error);
                }
            }
            else {
                zip_code = null;
            }

            let candLocationModel = new CandLocationsModel();

            /* Update cand_locations record */
            let get_cand_locations = await candLocationModel.getCandLocationData({ candidate_id }, "id");
            let update_cand_locations = await candLocationModel.updateCandLocationRecord(
                { country_id: '?', us_state_id: '?', city_name: '?', zipcode: '?' }, 
                [ country, get_region, city, zip_code, get_cand_locations.result.id ]
            );

            if(!(update_cand_locations.status)){
                response_data.error = update_cand_locations.error;
                throw new Error(response_data.error);
            }

            let candJobPreferencesModel = new CandJobPreferencesModel();
            let get_cand_job_preferences = await candJobPreferencesModel.getCandJobPreferenceData({ candidate_id: params.candidate_id }, "id");
            
            /* Update cand_job_preferences record */
            let update_cand_job_preferences = await candJobPreferencesModel.updateCandJobPreferenceRecord(
                { cand_role_type_ids: '?',  available_start_date: '?', can_relocate: '?', can_contract_work: '?' }, 
                [ JSON.stringify(get_current_desired_job), Moment(start_date).format("YYYY-MM-DD"), parseInt(relocation_checkbox), parseInt(contract_checkbox), get_cand_job_preferences.result.id ]
            );

            if(!(update_cand_job_preferences.status)){
                response_data.error = update_cand_job_preferences.error;
                throw new Error(update_cand_job_preferences.error);
            }

            /* Update candidate record */
            let update_candidate = await this.updateCandidateData(
                { short_bio: '?', security_clearance_id: '?', relevant_urls: '?' },
                [ short_bio, get_security_clearance, JSON.stringify(portfolio_link_item), candidate_id]
            );

            if(!(update_candidate.status)){
                response_data.error = update_candidate.error;
                throw new Error(update_candidate.error);
            }

            response_data.status = true;
            response_data.result = {
                get_region: (get_state) ? get_state.name : "",
                update_type, country, city, zip_code, get_current_desired_job, start_date,
                relocation_checkbox, contract_checkbox, short_bio, get_security_clearance, portfolio_link_item
            }
        }
        catch (error) {
            response_data.message = error.message;
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that updates work experience.<br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 22, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - years_experience, authorize_work, sponsorship_employment, candidate_id
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    __updateWorkExperience = async (params, update_type = CANDIDATE_PROFILE_UPDATE_TYPE.all) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { years_experience, authorize_work, sponsorship_employment, candidate_id } = params;

            let candJobPreferencesModel     = new CandJobPreferencesModel();
            let get_cand_job_preferences    = await candJobPreferencesModel.getCandJobPreferenceData({ candidate_id }, "id");
            let update_cand_job_preferences = await candJobPreferencesModel.updateCandJobPreferenceRecord({years_of_work_experience_id: '?'}, [years_experience, get_cand_job_preferences.result.id]);
            
            /* Continue updating other records in another table */
            if(update_cand_job_preferences.status){
                
                let update_candidate = await this.updateCandidateData({ is_usa_authorized: '?', is_visa_sponsorship: '?' }, [authorize_work, sponsorship_employment, candidate_id])

                if(update_candidate.status){
                    response_data.status = true;
                    response_data.result = { update_type, authorize_work, sponsorship_employment, years_experience };
                }
                else{
                    throw new Error(update_candidate.message);
                }
            }
            else{
                throw new Error(update_cand_job_preferences.message);
            }
        }
        catch (error) {
            response_data.message = error.message;
        }

        return response_data;
    }

    /**
    * DOCU: This is a function that updates more about you.<br>
    * Triggered by candidates.model/updateCandidateProfileDetails <br>
    * Last updated at: August 22, 2022 <br>
    * @async
    * @function
    * @memberOf CandidateModel
    * @param {object} params - get_vaccination_status, get_racial_group, get_gender_identity, is_veteran
    * @returns response_data - { status: true/false, result: {object} error, message }
    * @author Jovic
    */
    __updateMoreAboutYou = async (params, update_type = CANDIDATE_PROFILE_UPDATE_TYPE.all) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { get_vaccination_status, get_racial_group, get_gender_identity, is_veteran } = params;
                    
            let update_candidate = await this.updateCandidateData(
                {vaccination_status_id: '?', racial_group_ids: '?', gender: '?', is_veteran: '?'}, 
                [(get_vaccination_status.toString() || null), ((get_racial_group) ? JSON.stringify(get_racial_group) : null), (get_gender_identity || null), (is_veteran), params.candidate_id]
            );

            /* Check if updating of candidates is successful. */
            if(update_candidate.status){
                response_data.status = true;
                response_data.result = {
                    update_type,
                    vaccination_status_id: get_vaccination_status,
                    racial_group_ids: get_racial_group,
                    gender: get_gender_identity,
                    is_veteran
                }
            }
            else{
                throw new Error(update_candidate.message);
            }
        }
        catch (error) {
            response_data.message = error.message;
        }

        return response_data;
    }
}

export default CandidatesModel;