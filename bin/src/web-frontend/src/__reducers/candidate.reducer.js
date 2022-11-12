import { createSlice } from '@reduxjs/toolkit';
import { ONBOARDING_PAGE_ID } from '../__config/constants';
import Moment from "moment"

export const candidateManagement = createSlice({
    name: "candidate_information",
    initialState: {
        candidate_data: {
            is_save_and_exit: false,
            current_page: null,
            first_name: null,
            last_name: null,
            email: null,
            candidate_information: {
                country_id: null,
                city: null,
                zip_code: null,
                can_relocate: null,
                can_contract_work: null,
                job_search_status_id: null,
                available_start_date: null,
                short_bio: null,
                current_desired_job_list: null,
                security_clearance_id: null,
                relevant_urls: [""],
                cand_role_types_list: null,
                countries_list: null,
            },
            upload_data:{
                profile_picture_url: null,
                resume_url: null
            },
            candidate_information_errors:{
                is_valid_email: true,
                is_valid_zipcode: true
            },
            background: {
                is_usa_authorized: "0",
                contact_id: null,
                program_category_id: null,
                cd_graduated_at: null,
                cand_education_level_id: null,
                is_coding_dojo_graduate: "0",
                professional_skills_json: null,
                is_visa_sponsorship: "0",
                us_school_id: null,
                years_of_work_experience_id: null,
                university: null
            },
            more_about_you: {
                vaccination_status_id: null,
                racial_group_ids: [],
                gender: null,
                is_veteran: null
            }
        }
    },
    reducers: {
        setSaveAndExit: (state, action) => {
            state.candidate_data.is_save_and_exit = action.payload;
        },
        successBackForm: (state, action) => {
            state.candidate_data = { current_page_id: action.payload.result.current_page_id };
        },
        successGetCandidateProfile: (state, action) => {
            let { current_page_id, file_url, headshot_file, relevant_urls } = action.payload.result;

            /* Check current_page_id to identify the object that needs to be updated */
            if(current_page_id === ONBOARDING_PAGE_ID.candidate_information){
                let { is_save_and_exit, first_name, last_name, email, candidate_information, candidate_information_errors, upload_data } = action.payload.result;

                state.candidate_data                              = { is_save_and_exit, first_name, last_name, email };
                state.candidate_data.candidate_information        = candidate_information;
                state.candidate_data.candidate_information_errors = candidate_information_errors;
                state.candidate_data.upload_data                  = upload_data
            }
            else if(current_page_id === ONBOARDING_PAGE_ID.background){
                let {is_save_and_exit, background } = action.payload.result;

                /* Merge cand_languages_json and cand_technologies_json for all programming skills display */
                background.program_coverage = [...background.professional_skills_json.cand_languages_json || [], ...background.professional_skills_json.cand_technologies_json || []];

                state.candidate_data = { is_save_and_exit };
                state.candidate_data.background = background;
            }
            else if(current_page_id === ONBOARDING_PAGE_ID.more_about_you){
                delete action.payload.result.current_page_id;
                state.candidate_data.more_about_you = action.payload.result;
            }
            else{
                /* Append the resume and profile picture url */
                state.candidate_data.upload_data = {
                    resume_url: file_url,
                    profile_picture_url: headshot_file,
                }

                state.candidate_data.candidate_information = {...state.candidate_data.candidate_information, relevant_urls: JSON.parse(relevant_urls)}
            }

            state.candidate_data.current_page = current_page_id;
        },
        errorGetCandidateProfile: (state, action) => {
            state.error = action.payload.message;
        },
        successCandidateInformation: (state, action) => {
            let { is_save_and_exit, current_page_id } = action.payload.result;

            state.candidate_data.is_save_and_exit = is_save_and_exit;
            state.candidate_data.current_page = current_page_id;

            state.candidate_data.candidate_information_errors.is_valid_zipcode = true;
            state.candidate_data.candidate_information_errors.is_valid_email   = true;
        },
        errorCandidateInformation: (state, action) => {
            state.candidate_data.candidate_information_errors.is_valid_email = !(action.payload.error === "email_err");
            state.candidate_data.candidate_information_errors.is_valid_zipcode = !(action.payload.error === "zipcode_err");
        },
        addBackground: (state, action) => {
            let { is_save_and_exit, current_page_id } = action.payload.result;

            state.candidate_data.is_save_and_exit = is_save_and_exit;
            state.candidate_data.current_page = current_page_id;
        },
        errorBackground: (state, action) => {
            state.error_background = action.payload.error;
        },
        addMoreAboutYou: (state, action) => {
            localStorage.setItem("candidate_data", JSON.stringify(action.payload));
            state.candidate_data.more_about_you = action.payload;
        },
        successUploadHeadshotUser: (state, action) => {
            state.candidate_data.upload_data.profile_picture_url = action.payload.result.file_url;
        },
        errorUploadHeadshotUser: (state, action) => {
            state.error_upload_headshot_message = action.payload.message;
        },
        successUploadResumeUser: (state, action) => {
            state.candidate_data.upload_data.resume_url = action.payload.result.file_url;
        },
        errorUploadResumeUser: (state, action) => {
            state.error_upload_resume_message = action.payload.message;
        },
        successUpdateResumeLinks: (state, action) => {
            state.candidate_data.candidate_information.relevant_urls = action.payload.result.relevant_urls;
        },
        errorUpdateResumeLinks: (state, action) => {
            state.error_update_resume_links = action.payload.error;
        }
    }
})

export const { setSaveAndExit, successBackForm, successCandidateOnboarding, addCandidateInformation, successGetCandidateProfile, successCandidateInformation, errorCandidateInformation, addBackground, errorBackground, addMoreAboutYou, successUploadHeadshotUser, errorUploadHeadshotUser, successUploadResumeUser, errorUploadResumeUser, successUpdateResumeLinks, errorUpdateResumeLinks } = candidateManagement.actions;
export default candidateManagement.reducer;