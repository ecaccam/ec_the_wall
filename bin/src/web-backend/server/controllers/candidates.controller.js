

/* HACK: fix for babel issue with async functions */
import regeneratorRuntime from "regenerator-runtime";
import Passport           from 'passport';
import Base64Url 		  from "base64-url";
import jwt 				  from "jsonwebtoken";

/* Imports for helpers */
import { checkFields, decryptId } from "../helpers/index.js";
import SessionHelper   from "../helpers/session.helper";

/* Imports for models */
import UsersModel from "../models/users.model.js";
import CandidatesModel from "../models/candidates.model.js";
import CandidatesResumeModel from "../models/cand_resume.model.js";

/* Imports for constants */
import { CURRENT_PAGE, CANDIDATE_PROFILE_UPDATE_TYPE }  from "../config/constants";
import { US_COUNTRY_ID } from "../config/constants/shared.constants";

/** 
* @class 
* This controller is being called from the users.routes.js <br>
* All method here are related to users feature. <br>
* Last Updated Date: July 28, 2022
*/
class CandidateController {
    /**
    * Default constructor.
    */
    constructor(){

    }

    /**
    * TODO: Needs to be cleanup, move logics to models 
    * DOCU: Function for fetching candidate details based on Onboarding page. <br>
    * Triggered by api/candidates.routes/onboarding <br>
    * Last updated at: August 23, 2022
    * @async
    * @function
    * @memberOf CandidateController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Fitz, Updated by: Jovic, Adrian, Erick
    */
    getCandidateProfile = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let { current_user_id, current_candidate_id, iot } = req.session.user;

            let user_id = decryptId(current_user_id, iot);
            let candidate_id = decryptId(current_candidate_id, iot);
            
            let candidatesModel = new CandidatesModel(req);

            if(req.session.user.current_page_id === CURRENT_PAGE.cand_information){
                /* Fetch candidate details for Onboarding | Candidate Information Page */
                let get_candidate_information = await candidatesModel.getCandidateProfileDetails({ current_page_id: CURRENT_PAGE.cand_information, user_id: user_id });
                let {resume_url, profile_picture_url } = get_candidate_information.result;

                if(get_candidate_information.status === true){

                    response_data.status = true;
                    response_data.result = {
                        ...req.session.user,
                        "is_save_and_exit": false,
                        candidate_information: { ...get_candidate_information.result },
                        candidate_information_errors: {
                            is_valid_email: true,
                            is_valid_zipcode: true
                        },
                        upload_data:{
                            resume_url,
                            profile_picture_url
                        }
                    }
                }
            }
            else if(req.session.user.current_page_id === CURRENT_PAGE.background){
                let get_candidate_background = await candidatesModel.getCandidateProfileDetails({ current_page_id: CURRENT_PAGE.background, candidate_id });

                response_data.status = true;
                response_data.result = {
                    current_page_id: req.session.user.current_page_id,
                    "is_save_and_exit": false,
                    background: { ...get_candidate_background.result }
                }
            }
            else if(req.session.user.current_page_id === CURRENT_PAGE.more_about_you){
                let candidate_data = await candidatesModel.getCandidateData({id: candidate_id}, "vaccination_status_id, racial_group_ids, gender, is_veteran");

                if(candidate_data.status){
                    response_data.status = true;
                    response_data.result = {
                        ...candidate_data.result,
                        "current_page_id": req.session.user.current_page_id
                    }
                }
            }
            else{
                let candidate_profile = await candidatesModel.getCandidateProfileDetails({ candidate_id: candidate_id });

                if(candidate_profile.status){
                    response_data.status = true
                    response_data.result = candidate_profile.result;
                }
                else{
                    response_data.message = candidate_profile.message;
                }
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function for updating Onboarding records. <br>
    * Triggered by api/candidates.routes/save_onboarding <br>
    * Last updated at: August 22, 2022
    * @async
    * @function
    * @memberOf CandidateController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Jovic, Updated by: Erick, Fitz, CE
    */
    updateOnboarding = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };
       
        try{
            let { current_user_id, current_candidate_id, iot } = req.session.user;

            let user_id = decryptId(current_user_id, iot);
            let candidate_id = decryptId(current_candidate_id, iot);

            /* Backend processes for Onboaring | Candidate Information page */
            if(req.body.current_page_id === CURRENT_PAGE.cand_information){
                let required_fields = [
                    "is_save_and_exit", "first_name", "last_name", "email", "country_list", "open_relocation_checkbox", 
                    "open_contract_checkbox", "stage_job_search_list", "current_desired_job_list", "security_clearance_list" 
                ]

                /* add zip code to required_fields if selected country is US */
                required_fields.push((req.body.country_list === US_COUNTRY_ID) ? "zip_code" : "city");
                    
                /* Check if form values are valid */
                let check_fields = checkFields(required_fields, ["set_available_start_date", "short_bio", "fetch_portfolio_links"], req);

                if(check_fields.status){
                    let candidateModel = new CandidatesModel(req);

                    /* Add values to req.body object */
                    check_fields.result.sanitized_data.user_id         = user_id;
                    check_fields.result.sanitized_data.candidate_id    = decryptId(req.session.user.current_candidate_id, req.session.user.iot);
                    check_fields.result.sanitized_data.current_page_id = req.body.current_page_id;
    
                    response_data = await candidateModel.updateOnboardingDetails(check_fields.result.sanitized_data);

                    if(response_data.status){
                        let { first_name, last_name, email } = check_fields.result.sanitized_data;

                        /* Update session values */
                        req.session.user.current_page_id = response_data.result.current_page_id;
                        req.session.user.first_name      = first_name;
                        req.session.user.last_name       = last_name;
                        req.session.user.email           = email;

                        req.session.save();
                    }
                }
                else{
                    response_data.message   = `Missing required fields. ${(check_fields.result?.missing_fields || []).join(",")}`;
                    response_data.error     = check_fields.error;
                }
            }
            else if(req.body.current_page_id === CURRENT_PAGE.background){
                /* Check if form values are valid */
                let check_fields = checkFields(
                    ["authorize_work", "program_coverage", "is_coding_dojo_graduate", "sponsorship_employment", "is_save_and_exit"],
                    ["career_service_manager", "coding_dojo_program", "graduate_date", "highest_degree", "university", "years_experience"]
                , req);

                if(check_fields.status){
                    let candidateModel = new CandidatesModel(req);

                    response_data = await candidateModel.updateOnboardingDetails({...check_fields.result.sanitized_data, user_id, candidate_id, current_page_id: req.body.current_page_id});

                    if(response_data.status){
                        /* Update session value of current page */
                        req.session.user.current_page_id = response_data.result.current_page_id;
                        req.session.save();
                    }
                }
                else{
                    response_data.message = "Missing required fields.";
                }
            }
            else if(req.body.current_page_id === CURRENT_PAGE.more_about_you){

                /* Check if form values are valid */
                let check_fields = checkFields(["current_page_id", "is_save_and_exit"], ["vaccination_status", "racial_group", "gender_identity", "is_veteran"], req);

                if(check_fields.status){
                    let candidateModel   = new CandidatesModel(req);
                    let update_candidate = await candidateModel.updateOnboardingDetails({...check_fields.result.sanitized_data, candidate_id});
                     
                    if(update_candidate.status){
                        response_data = { ...update_candidate };
                        
                        /* Update session value of current page */
                        req.session.user.current_page_id = response_data.result.current_page_id;
                        req.session.save();
                    }
                    else{
                        response_data.message = update_candidate.error;
                    }
                }
                else{
                    response_data.message = "Missing required fields.";
                    response_data.message = error.message;
                }
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function for updating current_page_id in session. <br>
    * Triggered by api/candidates.routes/back_onboarding <br>
    * Last updated at: August 25, 2022
    * @async
    * @function
    * @memberOf CandidateController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Jovic
    */
    backOnboarding = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { current_page_id } = req.body;
            
            req.session.user.current_page_id = current_page_id;
            req.session.save();

            response_data.status = true;
            response_data.result.current_page_id = current_page_id;
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function for updating Candidate Profile records. <br>
    * Triggered by api/candidates.routes/update_profile <br>
    * Last updated at: August 24, 2022
    * @async
    * @function
    * @memberOf CandidateController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Jovic, Updated at: Erick, Adrian
    */
    updateCandidateProfile = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { current_user_id, current_candidate_id, iot } = req.session.user;

            let user_id = decryptId(current_user_id, iot);
            let candidate_id = decryptId(current_candidate_id, iot);
            let required_fields = [];
            let optional_fields = [];

            /* Each update_type will have different required and optional fields */
            switch(parseInt(req.body.update_type)){
                /* Update fields for user information section. */
                case CANDIDATE_PROFILE_UPDATE_TYPE.user_information:
                    required_fields = ["update_type", "first_name", "last_name", "email"];
                    optional_fields = [];

                    break;
                /* Update fields for education section. */
                case CANDIDATE_PROFILE_UPDATE_TYPE.education:
                    required_fields = ["update_type", "is_coding_dojo_graduate"];
                    optional_fields = ["highest_degree", "university"];
                    
                    /* Pass additional values to optional_fields if candidate is a coding dojo graduate */
                    if(parseInt(req.body.is_coding_dojo_graduate)){
                        optional_fields.push("coding_dojo_program", "graduate_date", "career_service_manager");
                    }
                
                    break;
                /* Update fields for work experience section. */
                case CANDIDATE_PROFILE_UPDATE_TYPE.work_experience:
                    required_fields = ["update_type", "years_experience", "authorize_work", "sponsorship_employment"];
                    optional_fields = [];

                    break;
                /* Update fields for more about you section. */
                case CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you:
                    required_fields = ["update_type"];
                    optional_fields = ["get_vaccination_status", "get_racial_group", "get_gender_identity", "is_veteran"];

                    break;
                /* Update fields for Candidate Information section. */
                case CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information:
                    required_fields = ["update_type", "short_bio", "fetch_portfolio_links", "open_contract_checkbox", "open_relocation_checkbox",  "set_available_start_date", "security_clearance_id", "country_id", "current_desired_job"];
                    optional_fields = ["region_list", "zip_code", "city"];
                    break;
                default:
                    required_fields = [
                        "update_type", "first_name", "last_name", "email", "country", "relocation_checkbox", "contract_checkbox",
                        "get_current_desired_job", "get_security_clearance", "is_coding_dojo_graduate", "authorize_work", "sponsorship_employment"
                    ];

                    optional_fields = [
                        "city", "zip_code", "start_date", "short_bio", "portfolio_link_item", "highest_degree", "university",
                        "coding_dojo_program", "graduate_date", "career_service_manager", "years_experience", "get_vaccination_status",
                        "get_racial_group", "get_gender_identity", "is_veteran"
                    ];

                    break;
            }

            let check_fields = checkFields(required_fields, optional_fields, req);

            if(check_fields.status){
                let candidateModel = new CandidatesModel(req);
                response_data = await candidateModel.updateCandidateProfileDetails({...check_fields.result.sanitized_data, user_id, candidate_id});
            }
        }
        catch(error){
            response_data.message = error.message;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function to update user headshot. <br>
    * Triggered by api/users.routes/uploadHeadshot <br>
    * Last updated at: August 11, 2022
    * @async
    * @function
    * @memberOf CandidatesController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Adrian
    */
    uploadHeadshot = async (req, res) => {
        let response_data = { status: false, result: {}, error: null }

        try{
            let { current_user_id, iot } = req.session.user;

            let user_id = decryptId(current_user_id, iot);

            let candidatesModel = new CandidatesModel();
            response_data       = await candidatesModel.updateUserHeadshot({file: req.file, user_id});
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function to update user headshot. <br>
    * Triggered by api/users.routes/uploadHeadshot <br>
    * Last updated at: August 10, 2022
    * @async
    * @function
    * @memberOf CandidatesController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Adrian
    */
    uploadResume = async (req, res) => {
        let response_data = { status: false, result: {}, error: null }

        try{
            let { current_user_id, current_candidate_id, iot } = req.session.user;

            let user_id      = decryptId(current_user_id, iot);
            let candidate_id = decryptId(current_candidate_id, iot);

            let candidatesResumeModel = new CandidatesResumeModel();
            response_data             = await candidatesResumeModel.uploadUserResume({file: req.file, user_id, candidate_id});
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function to update user headshot. <br>
    * Triggered by api/users.routes/uploadHeadshot <br>
    * Last updated at: August 25, 2022
    * @async
    * @function
    * @memberOf CandidatesController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Adrian
    */
    updateCandidateLinks = async (req, res) =>{
        let response_data = { status: false, result: {}, error: null };

        try{
            let { current_candidate_id, iot } = req.session.user;
            let candidate_id                  = decryptId(current_candidate_id, iot);
            let check_candidate_fields        = checkFields(["user_portfolio_links"], [], req);

            if(check_candidate_fields.status){
                let candidatesModel = new CandidatesModel();
                response_data = await candidatesModel.updateCandidateRelevantLinks({ candidate_id, portfolio_links: req.body.user_portfolio_links});
            }
            else{
                response_data.message = "Missing required fields";
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }
}

export default (function user(){
    return new CandidateController();
})();