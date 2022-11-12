import { createSlice } from '@reduxjs/toolkit';
import Moment from "moment"
import { GENDER, VACCINATION_STATUS, YEARS_OF_WORK_EXPERIENCE, YEARS_OF_WORK_EXPERIENCE_VALUE_DATA, CAND_EDUCATION_LEVEL_VALUE_DATA, CANDIDATE_PROFILE_PAGE, CANDIDATE_PROFILE_UPDATE_TYPE } from '../__config/constants';
import dropdownData from "../views/global/candidate_data.json";

export const candidateProfileManagement = createSlice({
    name: "candidate_profile_information",
    initialState: {
        current_page_id: CANDIDATE_PROFILE_PAGE,
        candidate_profile_data: {
            candidate_id: null, email: null, first_name: null, last_name: null, last_update_date: null, terms_condition: false,
            candidate_information: {
                headshot_file: null,
                country: null,
                get_region: null,
                city: null,
                relocation_checkbox: "0",
                contract_checkbox: "0",
                start_date: null,
                short_bio: null,
                resume_file: null,
                get_security_clearance: "Confidential",
                get_current_desired_job: ["Mobile Developer"],
                portfolio_link_item: [""]
            },
            education: {
                highest_degree: "Associates",
                us_school_id: null,
                is_coding_dojo_graduate: "0",
                graduate_date: null,
                career_service_manager_item: "",
                coding_dojo_program_item: "",
                professional_skill: [""]
            },
            work_experience: {
                years_experience: "0-2 Years",
                authorize_work: "0",
                sponsorship_employment: "0",
            },
            more_about_you: {
                get_vaccination_status: "Yes, I am fully vaccinated",
                get_racial_group: [""],
                get_gender_identity: "Male",
                is_veteran: "0"
            },
            upload_data:{
                profile_picture_url: null,
                resume_url: null
            }
        },
        error_message: "",
        update_status: true,
        update_errors: {
            is_valid_email: true,
            is_valid_zipcode: true
        }
    },
    reducers: {
        setSuccessCandidateProfile: (state, action) => {
            let {
                candidate_id, email, first_name, last_name, cand_professional_skills,
                headshot_file, country_id, us_state_name, city_name, can_relocate, can_contract_work, available_start_date, short_bio, cand_role_types, relevant_urls, zipcode, security_clearance_id,
                cand_education_level_id, us_school_id, is_codingdojo_graduate, cd_graduated_at, program_category_id, contact_id, years_of_work_experience_id, is_usa_authorized, is_visa_sponsorship,
                vaccination_status_id, racial_group_ids, gender, is_veteran, countries_list, cand_role_types_list, university, contact_list, file_url
            } = action.payload;

            /** Store all candidate professional skills to variable, and get all names of skills for display */
            let cand_pro_skills = JSON.parse(cand_professional_skills);
            let cand_language_skills = (cand_pro_skills.cand_languages_json) ? Object.values(cand_pro_skills.cand_languages_json) : [];
            let cand_technology_skills = (cand_pro_skills.cand_technologies_json) ? Object.values(cand_pro_skills.cand_technologies_json) : [];

            let set_candidate_profile_data =
            {
                current_page_id: CANDIDATE_PROFILE_PAGE,
                candidate_id: candidate_id,
                email: email,
                first_name: first_name,
                last_name: last_name,
                terms_condition: true,
                candidate_information:
                    {
                        headshot_file: headshot_file,
                        country: country_id,
                        get_region: us_state_name,
                        city: city_name,
                        relocation_checkbox: can_relocate,
                        contract_checkbox: can_contract_work,
                        start_date: available_start_date,
                        short_bio: short_bio,
                        resume_file: file_url,
                        get_security_clearance: security_clearance_id,
                        get_current_desired_job: JSON.parse(cand_role_types),
                        portfolio_link_item: JSON.parse(relevant_urls),
                        zipcode: zipcode
                    },
                education:
                    {
                        highest_degree: cand_education_level_id,
                        us_school_id: us_school_id,
                        is_coding_dojo_graduate: is_codingdojo_graduate,
                        graduate_date: cd_graduated_at,
                        career_service_manager_item: contact_id,
                        coding_dojo_program_item: program_category_id,
                        professional_skill: cand_language_skills.concat(cand_technology_skills)
                    },
                work_experience:
                    {
                        years_experience: YEARS_OF_WORK_EXPERIENCE.find(({ value }) => value === parseInt(action.payload.years_of_work_experience_id)).label,
                        authorize_work: action.payload.is_usa_authorized,
                        sponsorship_employment: action.payload.is_visa_sponsorship,
                    },
                more_about_you:
                    {
                        get_vaccination_status: VACCINATION_STATUS.find(({ value }) => value === parseInt(vaccination_status_id)).label,
                        get_racial_group: (racial_group_ids) ? racial_group_ids : [],
                        get_gender_identity: GENDER.find(({ value }) => value === parseInt(gender)).label,
                        is_veteran: is_veteran
                    },
                upload_data: {
                    profile_picture_url: headshot_file,
                    resume_url: file_url
                },
                cand_role_types_list, countries_list,
                us_schools_list: university,
                contact_list: contact_list
            };

            state.candidate_profile_data = set_candidate_profile_data;
            state.update_status = true;
            state.update_errors = {
                is_valid_email: true,
                is_valid_zipcode: true
            };
        },
        successUpdateCandidateProfile: (state, action) => {
            let { update_type } = action.payload.result;

            // TODO: Maybe we can destructure all of the variables in here because all of it is going to be repeated in the default part of switch(update_type)
            switch(update_type){
                /* Updating of User Information Section*/
                case CANDIDATE_PROFILE_UPDATE_TYPE.user_information:
                    var { result: {first_name, last_name, email} } = action.payload;
                    
                    state.candidate_profile_data = { ...state.candidate_profile_data, first_name, last_name, email }

                    break;
                /* Updating of Education Section*/
                case CANDIDATE_PROFILE_UPDATE_TYPE.education:
                    var { highest_degree, university, is_coding_dojo_graduate, graduate_date, coding_dojo_program, career_service_manager } = action.payload.result;

                    /* Get equivalent label for years_experience */
                    highest_degree = CAND_EDUCATION_LEVEL_VALUE_DATA[highest_degree];

                    /* TODO: Initial updating of state for updating education section */
                    state.candidate_profile_data = { 
                        ...state.candidate_profile_data, education: { 
                            ...state.candidate_profile_data.education,
                            us_school_id: university,
                            career_service_manager_item: career_service_manager,
                            highest_degree, is_coding_dojo_graduate, graduate_date, coding_dojo_program
                        }
                    }

                    break;
                /* Updating of Work Experience Section*/
                case CANDIDATE_PROFILE_UPDATE_TYPE.work_experience:
                    var { years_experience, authorize_work, sponsorship_employment } = action.payload.result;

                    /* Get equivalent label for years_experience */
                    years_experience = YEARS_OF_WORK_EXPERIENCE_VALUE_DATA[years_experience].years;
                    state.candidate_profile_data = { ...state.candidate_profile_data, work_experience: { authorize_work, sponsorship_employment, years_experience }}

                    break;
                /* Updating of More About You Section*/
                case CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you:
                    var { vaccination_status_id, racial_group_ids, gender, is_veteran } = action.payload.result;

                    state.candidate_profile_data = {
                        ...state.candidate_profile_data,
                        more_about_you: {
                            get_vaccination_status: VACCINATION_STATUS.find(({ value }) => value === parseInt(vaccination_status_id)).label,
                            get_racial_group: racial_group_ids,
                            get_gender_identity: GENDER.find(({ value }) => value === parseInt(gender)).label,
                            is_veteran: is_veteran
                        }
                    }

                    break;
                case CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information:
                    var { open_relocation_checkbox, fetch_portfolio_links, current_desired_job, set_available_start_date, security_clearance_id, zipcode, city, country} = action.payload.result;

                    state.candidate_profile_data = {
                        ...state.candidate_profile_data,
                        candidate_information:{
                            ...state.candidate_profile_data.candidate_information,
                            contract_checkbox: parseInt(open_relocation_checkbox),
                            portfolio_link_item: fetch_portfolio_links,
                            relocation_checkbox: open_relocation_checkbox,
                            start_date: set_available_start_date,
                            short_bio: "short_bio",
                            resume_file: "Asdsasad",
                            get_security_clearance: security_clearance_id,
                            get_current_desired_job: current_desired_job,
                            zipcode,
                            city,
                            country
                        }
                    }

                    break;
                default:
                    var {
                        first_name, last_name, email,
                        country, get_region, city, zip_code,
                        relocation_checkbox, contract_checkbox, start_date, get_current_desired_job,
                        short_bio, get_security_clearance, portfolio_link_item,
                        highest_degree, university, is_coding_dojo_graduate, graduate_date, coding_dojo_program, career_service_manager,
                        authorize_work, sponsorship_employment, years_experience,
                        vaccination_status_id, racial_group_ids, gender, is_veteran
                    } = action.payload.result;

                    /* TODO: Remove once FE is fetching array of ids instead of array of strings */
                    let desired_job_list = dropdownData.current_desired_job.filter(current_job_list => get_current_desired_job.some(selected_desired_job => selected_desired_job === current_job_list.value));

                    /* Get equivalent label for highest_degree */
                    highest_degree = CAND_EDUCATION_LEVEL_VALUE_DATA[highest_degree];

                    /* Get equivalent label for years_experience */
                    years_experience = YEARS_OF_WORK_EXPERIENCE_VALUE_DATA[years_experience].years;

                    state.candidate_profile_data = {
                        ...state.candidate_profile_data,
                        first_name, last_name, email,
                        candidate_information: {
                            ...state.candidate_profile_data.candidate_information,
                            country, get_region, city, zipcode: zip_code,
                            relocation_checkbox, contract_checkbox, start_date, get_current_desired_job: desired_job_list.map(selected_item => selected_item.label),
                            short_bio, get_security_clearance, portfolio_link_item
                        },
                        education: {
                            ...state.candidate_profile_data.education,
                            highest_degree, is_coding_dojo_graduate, graduate_date, coding_dojo_program
                        },
                        work_experience: { authorize_work, sponsorship_employment, years_experience },
                        more_about_you: {
                            get_vaccination_status: VACCINATION_STATUS.find(({ value }) => value === parseInt(vaccination_status_id)).label,
                            get_racial_group: (racial_group_ids) ? racial_group_ids : [],
                            get_gender_identity: GENDER.find(({ value }) => value === parseInt(gender)).label,
                            is_veteran: is_veteran
                        }
                    };
            }

            state.update_status = true;
            state.update_errors = {
                is_valid_email: !(action.payload.error === "email_err"),
                is_valid_zipcode: !(action.payload.error === "zipcode_err")
            };
        },
        errorUpdateCandidateProfile: (state, action) => {
            state.update_status = false;
            state.update_errors = {
                is_valid_email: !(action.payload.error === "email_err"),
                is_valid_zipcode: !(action.payload.error === "zipcode_err")
            };
        },
        updateCandidateProfileData: (state, action) => {
            let new_set_available_start_date = Moment(action.payload.candidate_information.start_date).format();
            let new_graduate_date = Moment(action.payload.education.graduate_date).format();

            action.payload.candidate_information.start_date = new_set_available_start_date;
            action.payload.education.graduate_date = new_graduate_date;
            state.candidate_profile_data = action.payload;
        },
        successUpdateResumeLinksProfile: (state, action) => {
            state.candidate_profile_data = {
                ...state.candidate_profile_data,
                candidate_information:{
                    ...state.candidate_profile_data.candidate_information,
                    portfolio_link_item: action.payload.result.relevant_urls
                }
            }
        },
        successUploadResumeProfileInformationPage: (state, action) => {
            state.candidate_profile_data = {
                ...state.candidate_profile_data,
                upload_data:{
                    ...state.candidate_profile_data.upload_data,
                    resume_url: action.payload.result.file_url
                }
            }
            state.candidate_profile_data.upload_data.resume_url = action.payload.result.file_url;
            /* Set to false so user can proceed editing after upload */
            state.update_status = false;
        },
        successUploadHeadshotProfileInformationPage: (state, action) => {
            state.candidate_profile_data = {
                ...state.candidate_profile_data,
                upload_data:{
                    ...state.candidate_profile_data.upload_data,
                    profile_picture_url: action.payload.result.file_url
                }
            }
            state.candidate_profile_data.upload_data.resume_url = action.payload.result.file_url;
            /* Set to false so user can proceed editing after upload */
            state.update_status = false;
        }
    },
})

export const { setSuccessCandidateProfile, successUpdateCandidateProfile, errorUpdateCandidateProfile, updateCandidateProfileData, successUpdateResumeLinksProfile, successUploadResumeProfileInformationPage, successUploadHeadshotProfileInformationPage } = candidateProfileManagement.actions;
export default candidateProfileManagement.reducer;