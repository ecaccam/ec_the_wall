/* REACT */
import React, { useState, useMemo, useEffect } from "react";

/* COMPONENT */
import ReactSearchDropdown from "../react_search_dropdown/react_search_dropdown";
import LabelInputRadio from "../label_input_radio/label_input_radio";
import ReactDatePicker from "../react_date_picker/react_date_picker";
import CandidateDetailsModal from "../../modals/candidate_details/candidate_details.modal";

/* VENDOR */
import { useDispatch, useSelector } from "react-redux/es/exports";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen, faXmark, faEye, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import countryList from "react-select-country-list";
import { useCountryRegion } from "react-use-country-region";
import { FileUploader } from "react-drag-drop-files";
import Moment from "moment";

/* CSS */
import "./candidate_profile.scss";

/* REDUCER */
import { updateCandidateProfileData } from "../../../../__reducers/candidate_profile_information.reducer";
import { updateSelectedCandidateProfileData } from "../../../../__reducers/candidate_list.reducer";

/* HELPER */
import { onChangeSelectedDropdown, removeSelectedItem, selectRadioItem, filterSelectedDropdownData, renderMultipleDropdownValue } from "../../../../__helpers";

/* JSON */
import dropdownData from "../../../global/candidate_data.json";
import programSkills from "../../../global/program_type_skills.json";

/* ACTIONS */
import { CandidateActions } from '../../../../__action/candidate.action';

/* CONSTANTS */
import { CUSTOM_RADIO_ITEM_VALUE, RADIO_ITEM_DATA, CANDIDATE_PROFILE_UPDATE_TYPE } from "../../../../__config/constants";

/* FONT AWESOME ICON USED */
library.add(faPen, faXmark, faEye, faFloppyDisk);

const {
        current_desired_job, security_clearance, education_level, coding_dojo_program,
        years_of_experience, racial_group, vaccination_status, gender_identity
    } = dropdownData;

const resume_file_types = ["PDF"];

function CandidateProfile({ selected_candidate_profile_data }) {
    /* Dispatch to set the candidate reducer data. */
    const dispatch = useDispatch();

    /* This will check the if the data is user profile or selected candidate in admin side. */
    const [fetch_selected_candidate_item, setSelectedCandidateItem] = useState((selected_candidate_profile_data) ? selected_candidate_profile_data : null);

    /* This will use for react hook form to register and handling of inputs on submit/onchange. */
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    const { candidate_profile_data, update_status, update_errors } = useSelector(state => state.candidate_profile);

    /* REDUCER */
    useEffect(() => {
        dispatch(CandidateActions.getProfile());
    }, []);

    /* Prototype data from reducer for user candidate. */
    const { first_name, last_name, email, last_update_date } = (fetch_selected_candidate_item) ? fetch_selected_candidate_item : candidate_profile_data;
    const   {
                city, contract_checkbox, country, get_current_desired_job, zipcode,
                get_region, get_security_clearance, headshot_file, portfolio_link_item,
                relocation_checkbox, resume_file, short_bio, start_date
            } = candidate_profile_data.candidate_information;

    const   {
                highest_degree, us_school_id, is_coding_dojo_graduate, graduate_date,
                career_service_manager_item, professional_skill, coding_dojo_program_item
            } = candidate_profile_data.education;

    const   { years_experience, authorize_work, sponsorship_employment } = candidate_profile_data.work_experience;
    const   { get_vaccination_status, get_racial_group, get_gender_identity, is_veteran } = candidate_profile_data.more_about_you;

    const   countries_list = candidate_profile_data.countries_list;
    const   cand_role_types_list = candidate_profile_data.cand_role_types_list;
    const   us_schools_list = candidate_profile_data.us_schools_list;
    const   contact_list = candidate_profile_data.contact_list;

    const new_portfolio_link_item = [];

    /* This will map the candidate portfolio item. */
    portfolio_link_item.map(selected_item => {
        new_portfolio_link_item.push({
            item_url: selected_item
        });
    });

    /* This is to initialize variable for Preview Candidate */
    let preview_candidate_profile = fetch_selected_candidate_item || candidate_profile_data;
    /*
        TODO: Some of useState needs to be move in props since we updated the new flow for BE side to fetch the data.
    */
    const [ user_information_edit, setUserInformationUpdate ]           = useState(false);
    const [ candidate_information_edit, setCandidateInformationUpdate ] = useState(false);
    const [ education_details, setEducationDetails ]                    = useState(false);
    const [ work_experience_details, setWorkExperienceDetails ]         = useState(false);
    const [ more_about_you_details, setMoreAboutYouDetails ]            = useState(false);
    const [fetch_country, selectedCountry]                              = useState(country);
    const [selected_region, selectedRegionList]                         = useState("");
    const [fetch_region, getRegion]                                     = useState([{label: get_region, value: get_region}]);
    const { result: selected_country }                                  = useCountryRegion(selected_region);
    const [fetch_relocation_checkbox, setRelocationDataItem]            = useState(relocation_checkbox);
    const [fetch_contract_checkbox, setContractDataItem]                = useState(contract_checkbox);
    const [fetch_start_date, setStartDate]                              = useState(new Date(start_date));
    const [fetch_current_desired_job, setCurrentDesiredJob]             = useState(current_desired_job.filter(current_job_list => get_current_desired_job.some(selected_desired_job => selected_desired_job === current_job_list.label)));
    const [fetch_security_clearance, setSecurityClearance]              = useState(get_security_clearance);
    const [fetch_resume_file, setResumeFile]                            = useState(resume_file);
    const [fetch_portfolio_link_item, setPortfolioLink]                 = useState(new_portfolio_link_item);
    const [fetch_highest_degree, setHighestDegree]                      = useState(highest_degree);
    const [get_university, setUniversity]                               = useState(us_school_id);
    const [fetch_is_coding_dojo_graduate, setCodingDojoGraduate]        = useState(is_coding_dojo_graduate);
    const [get_coding_dojo_program, setCodingDojoProgram]               = useState(coding_dojo_program_item);
    const [fetch_graduate_date, setGraduateDate]                        = useState(graduate_date ? new Date(graduate_date) : null);
    const [get_career_service_manager, setCareerServiceManager]         = useState(career_service_manager_item);
    const [get_program_coverage, setProgramCoverage]                    = useState(professional_skill);
    const [get_years_experience, getYearsExperience]                    = useState(years_of_experience.filter(selected_item => selected_item.label === years_experience));
    const [fetch_authorize_work, setauthorizeWork]                      = useState(authorize_work);
    const [fetch_sponsorship_employment, setSponsorshipEmployment]      = useState(sponsorship_employment);
    
    /* More About You Section */
    const [fetch_vaccination_status, setVaccinationStatus]              = useState(vaccination_status.filter(selected_item => selected_item.label === get_vaccination_status));
    const [fetch_gender_identity, setGenderIdentity]                    = useState(gender_identity.filter(selected_item => selected_item.label === get_gender_identity));
    const [fetch_racial_group, setRacialGroup]                          = useState(get_racial_group);
    const [fetch_is_veteran, setIsVeteran]                              = useState(is_veteran);
    
   
    const [fetch_last_update_date, setLastUpdatedDate]                  = useState(last_update_date);
    const [fetch_zipcode, setZipCode]                                   = useState("");
    const [is_show_update_all, setUpdateAll]                            = useState(false);
    const [ set_show_modal, setShowModal ]                              = useState(false);
    const handleClose                                                   = () => setShowModal(false);

    const region_list = [];

    if(selected_country){
        const new_result = selected_country.regions.map(({ name: label, shortCode: value }) => ({ label, value }));
        region_list.push(...new_result);
    }

    /**
    * DOCU: This will handle the resume data file upload. <br>
    * Triggered: CandidateProfile <br>
    * Last Updated Date: August 12, 2022
    * @param {object} resume_file_data - To get the uploaded resume file data.
    * @author Ruelito
    */
    const onChangeCountry = country => {
        if(country.length){
            selectedCountry(country);
            selectedRegionList(country[0].value);
            getRegion("");
        }
        else{
            selectedRegionList("");
        }
    }

    /**
    * DOCU: This will handle the resume data file upload. <br>
    * Triggered: CandidateProfile <br>
    * Last Updated Date: August 12, 2022
    * @param {object} resume_file_data - To get the uploaded resume file data.
    * @author Ruelito
    */
    const handleResumeFileUpload = (resume_file_data) => {
        (resume_file_data.size <= 40000000) ? dispatch(CandidateActions.uploadResume(resume_file_data)) : setResumeFile(false);
    };

    /**
    * DOCU: This will handle the input change in portforlio link. <br>
    * Triggered: CandidateProfile <br>
    * Last Updated Date: August 12, 2022
    * @param {object} event - To get the event target value and name.
    * @param {object} link_item_index - To get the index of selected link item.
    * @author Ruelito
    */
    const handleInputChangePortfolioLink = (event, link_item_index) => {
        const { name, value } = event.target;
        const list = [...fetch_portfolio_link_item];

        list[link_item_index][name] = value;
        setPortfolioLink(list);
    };

    /**
    * DOCU: This will handle to remove the portforlio link. <br>
    * Triggered: CandidateProfile <br>
    * Last Updated Date: August 12, 2022
    * @param {object} link_item_index - To get the index of selected link item.
    * @author Ruelito
    */
    const handleRemoveClickPortfolioLink = (link_item_index) => {
        const list = [...fetch_portfolio_link_item];

        list.splice(link_item_index, 1);
        setPortfolioLink(list);
    };

    /**
    * DOCU: This will handle to add the portforlio link. <br>
    * Triggered: CandidateProfile <br>
    * Last Updated Date: August 12, 2022
    * @author Ruelito
    */
    const handleAddClickPortfolioLink = () => {
        setPortfolioLink([...fetch_portfolio_link_item, { item_url: "" }]);
    };

    const updateAllCandidateProfileData = () => {
        setUserInformationUpdate(true);
        setCandidateInformationUpdate(true);
        setEducationDetails(true);
        setWorkExperienceDetails(true);
        setMoreAboutYouDetails(true);
        setUpdateAll(true);
    }

    /**
    * DOCU: This will handle to open the selected edit block except Update All edit block, and close the other open edit blocks. <br>
    * Triggered: CandidateProfile <br>
    * Last Updated Date: August 25, 2022
    * @author CE
    */
    const handleOpenEditBlock = (edit_type) => {
        setUserInformationUpdate(edit_type === CANDIDATE_PROFILE_UPDATE_TYPE.user_information);
        setCandidateInformationUpdate(edit_type === CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information);
        setEducationDetails(edit_type === CANDIDATE_PROFILE_UPDATE_TYPE.education);
        setWorkExperienceDetails(edit_type === CANDIDATE_PROFILE_UPDATE_TYPE.work_experience);
        setMoreAboutYouDetails(edit_type === CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you);
    }

    const onSubmitCandidateInformation = async (candidate_information_data) => {
        // let new_candidate_profile_data = JSON.parse(JSON.stringify(candidate_profile_data));
        // let { email, first_name, last_name } = (selected_candidate_profile_data) ? selected_candidate_profile_data : new_candidate_profile_data;
        // let { headshot_file, country, get_region, city } = (selected_candidate_profile_data) ? selected_candidate_profile_data.candidate_information : new_candidate_profile_data.candidate_information;
        let form_values = {};

        if(is_show_update_all){
            var {
                email, first_name, last_name, country_list, region_list, city, zip_code, short_bio,
                university, coding_dojo_program, graduate_date, career_service_manager
            } = candidate_information_data;

            form_values = {
            /* User Information */ 
                update_type: CANDIDATE_PROFILE_UPDATE_TYPE.all,
                email, first_name, last_name,
            /* Candidate Information */
                country: (country_list) ? country_list : country,
                city, zip_code, short_bio,
                relocation_checkbox     : fetch_relocation_checkbox,
                contract_checkbox       : fetch_contract_checkbox,
                start_date              : fetch_start_date,
                get_security_clearance  : fetch_security_clearance[0].value,
                get_current_desired_job : fetch_current_desired_job.map(selected_item => selected_item.value),
                portfolio_link_item     : fetch_portfolio_link_item.map(added_link => added_link.item_url),
            /* Education */
                university,
                highest_degree          : fetch_highest_degree[0].value,
                is_coding_dojo_graduate : fetch_is_coding_dojo_graduate,
            /* Work Experience */
                years_experience        : get_years_experience[0].value,
                authorize_work          : fetch_authorize_work,
                sponsorship_employment  : fetch_sponsorship_employment,
            /* More About You */
                get_vaccination_status  : fetch_vaccination_status[0].value,
                get_racial_group        : fetch_racial_group.map(selected_item => selected_item.value),
                get_gender_identity     : fetch_gender_identity[0].value,
                is_veteran              : fetch_is_veteran,
            }

            /* Pass additional values to form_values if candidate is a coding dojo graduate */
            if(parseInt(fetch_is_coding_dojo_graduate)){
                form_values.coding_dojo_program    = coding_dojo_program;
                form_values.graduate_date          = graduate_date;
                form_values.career_service_manager = career_service_manager;
            }
        }
        else if(user_information_edit){
            form_values = {
                update_type: CANDIDATE_PROFILE_UPDATE_TYPE.user_information,
                first_name: candidate_information_data.first_name,
                last_name: candidate_information_data.last_name,
                email: candidate_information_data.email
            }
        }
        else if(education_details){
            var { university, coding_dojo_program, graduate_date, career_service_manager } = candidate_information_data;

            form_values = {
                update_type: CANDIDATE_PROFILE_UPDATE_TYPE.education,
                highest_degree: fetch_highest_degree[0].value,
                university: university,
                is_coding_dojo_graduate: fetch_is_coding_dojo_graduate
            }

            /* Pass additional values to form_values if candidate is a coding dojo graduate */
            if(parseInt(fetch_is_coding_dojo_graduate)){
                form_values.coding_dojo_program    = coding_dojo_program;
                form_values.graduate_date          = graduate_date;
                form_values.career_service_manager = career_service_manager;
            }
        }
        else if(work_experience_details){
            form_values = {
                update_type: CANDIDATE_PROFILE_UPDATE_TYPE.work_experience,
                years_experience: get_years_experience[0].value,
                authorize_work: fetch_authorize_work,
                sponsorship_employment: fetch_sponsorship_employment
            }
        }
        else if(more_about_you_details){
            form_values = {
                update_type: CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you,
                get_vaccination_status: fetch_vaccination_status[0].value,
                get_racial_group: (fetch_racial_group) ? fetch_racial_group.map(selected_item => selected_item.value) : null,
                get_gender_identity: fetch_gender_identity[0].value,
                is_veteran: fetch_is_veteran,
            }
        }
        else if(candidate_information_edit){
            let { short_bio, fetch_portfolio_links, open_contract_checkbox, open_relocation_checkbox, set_available_start_date, security_clearance_list, country_list, region_list, city, zip_code  } = candidate_information_data;

            form_values = {
                update_type: CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information,
                short_bio,
                fetch_portfolio_links,
                open_contract_checkbox,
                open_relocation_checkbox,
                set_available_start_date: Moment(set_available_start_date).format("YYYY-MM-DD  HH:mm:ss.000"),
                country_id: country_list,
                region_list,
                city,
                zip_code,
                current_desired_job: fetch_current_desired_job.map(selected_item => selected_item.value),
                security_clearance_id: security_clearance_list
            };
        }

        /* TODO: Comment for now. Might need it later */
        // let new_profile_data = {
        //     current_page_id : candidate_profile_data.current_page_id,
        //     update_type     : candidate_information_data.update_type,
        //     candidate_id    : (selected_candidate_profile_data) ? selected_candidate_profile_data.candidate_id : 1,
        //     email           : (candidate_information_data.email) ? candidate_information_data.email : email,
        //     first_name      : (candidate_information_data.first_name) ? candidate_information_data.first_name : first_name,
        //     last_name       : (candidate_information_data.last_name) ? candidate_information_data.last_name : last_name,
        //     terms_condition : true,
        //     candidate_information: {
        //         headshot_file           : (candidate_information_data.headshot_file) ? candidate_information_data.headshot_file : headshot_file,
        //         country                 : (candidate_information_data.country_list) ? candidate_information_data.country_list : country,
        //         get_region              : (candidate_information_data.region_list) ? candidate_information_data.region_list : get_region,
        //         city                    : (candidate_information_data.city) ? candidate_information_data.city : city,
        //         relocation_checkbox     : fetch_relocation_checkbox,
        //         contract_checkbox       : fetch_contract_checkbox,
        //         start_date              : fetch_start_date,
        //         short_bio               : (candidate_information_data.short_bio) ? candidate_information_data.short_bio : short_bio,
        //         resume_file             : (candidate_information_data.resume_file) ? candidate_information_data.resume_file : resume_file,
        //         get_security_clearance  : fetch_security_clearance[0].label,
        //         get_current_desired_job : fetch_current_desired_job.map(selected_item => selected_item.label),
        //         portfolio_link_item     : fetch_portfolio_link_item.map(added_link => added_link.item_url)
        //         },
        //     education: {
        //         highest_degree              : fetch_highest_degree[0].label,
        //         university_name             : get_university[0].label,
        //         is_coding_dojo_graduate     : fetch_is_coding_dojo_graduate,
        //         graduate_date               : fetch_graduate_date,
        //         career_service_manager_item : get_career_service_manager.map(selected_item => selected_item.label),
        //         coding_dojo_program_item    : get_coding_dojo_program.map(selected_item => selected_item.label),
        //         professional_skill          : get_program_coverage.map(selected_item => selected_item.label)
        //     },
        //     work_experience: {
        //         years_experience        : get_years_experience[0].value,
        //         authorize_work          : fetch_authorize_work,
        //         sponsorship_employment  : fetch_sponsorship_employment
        //     },
        //     more_about_you: {
        //         get_vaccination_status  : fetch_vaccination_status[0].label,
        //         get_racial_group        : fetch_racial_group.map(selected_item => selected_item.label),
        //         get_gender_identity     : fetch_gender_identity[0].label,
        //         is_veteran              : fetch_is_veteran,
        //     }
        // }

        /* dispatch to Action */
        await dispatch(CandidateActions.updateCandidateProfileDetails(form_values));
        // setUserInformationUpdate( !(error_message) );
    };

    /** For updating */
    useEffect(() => {
            setValue("country_list", fetch_country && fetch_country[0].id);
            setValue("region_list", fetch_region && fetch_region[0].label);
            setValue("open_relocation_checkbox", fetch_relocation_checkbox);
            setValue("open_contract_checkbox", fetch_contract_checkbox);
            setValue("set_available_start_date", fetch_start_date);
            setValue("security_clearance_list", fetch_security_clearance && fetch_security_clearance[0].value);
            setValue("resume_file", fetch_resume_file);
            setValue("fetch_portfolio_links", fetch_portfolio_link_item[0].item_url && fetch_portfolio_link_item.map(added_link => added_link.item_url));
            setValue("highest_degree", fetch_highest_degree && fetch_highest_degree[0].value);
            setValue("university", get_university && get_university[0].value);
            setValue("is_coding_dojo_graduate", fetch_is_coding_dojo_graduate);
            setValue("coding_dojo_program", get_coding_dojo_program && get_coding_dojo_program[0].value);
            setValue("graduate_date", fetch_graduate_date);
            setValue("career_service_manager", get_career_service_manager && get_career_service_manager[0].value);
            setValue("years_experience", get_years_experience && get_years_experience[0].value);
            setValue("authorize_work", fetch_authorize_work);
            setValue("sponsorship_employment", fetch_sponsorship_employment);

            /* More About You Section */
            setValue("vaccination_status", fetch_vaccination_status && fetch_vaccination_status[0].label);
            setValue("racial_group", fetch_racial_group && fetch_racial_group.map(selected_item => selected_item.value));
            setValue("gender_identity", fetch_gender_identity && fetch_gender_identity[0].label);
            setValue("is_veteran", fetch_is_veteran);

            setValue("current_desired_job_list", fetch_current_desired_job && fetch_current_desired_job.map(selected_item => selected_item.value))

            /* Blocks of codes to set values in form of professional skills */
            let candidate_languages     = [];
            let candidate_technologies  = [];

            get_program_coverage && get_program_coverage.map(selected_program_item => {
                return (selected_program_item.is_language) ? candidate_languages.push(selected_program_item) : candidate_technologies.push(selected_program_item);
            });

            setValue("program_coverage[candidate_languages]", candidate_languages.map(language_item => { return language_item.value }));
            setValue("program_coverage[candidate_technologies]", candidate_technologies.map(technologies_item => { return technologies_item.value }));
        }, 
        [
            isSubmitting,
            setValue,
            fetch_country,
            fetch_region,
            get_region,
            country,
            fetch_relocation_checkbox,
            fetch_contract_checkbox,
            fetch_security_clearance,
            fetch_resume_file,
            fetch_portfolio_link_item,
            fetch_highest_degree,
            get_university,
            fetch_is_coding_dojo_graduate,
            get_coding_dojo_program,
            fetch_graduate_date,
            get_career_service_manager,
            get_program_coverage,
            get_years_experience,
            fetch_authorize_work,
            fetch_sponsorship_employment,
            fetch_vaccination_status,
            fetch_gender_identity,
            fetch_is_veteran,
            fetch_start_date,
            fetch_current_desired_job,
        ]
    );

    /** For load */
    useEffect(() => {
            /* Only update form fields if update is successful. This prevents form values to reset back to its state values after submitting form */
            if(update_status){
                filterSelectedDropdownData({ dropdown_list: countries_list, dropdown_id: country, is_country: true }, { dropdown_data: fetch_country, dropdown_function: selectedCountry });
                getRegion([{label: get_region, value: get_region}]);
                setRelocationDataItem(relocation_checkbox);
                setContractDataItem(contract_checkbox);
                setStartDate(fetch_start_date);
                setCurrentDesiredJob(current_desired_job.filter(current_job_list => get_current_desired_job.some(selected_desired_job => selected_desired_job === current_job_list.label)));
                filterSelectedDropdownData({ dropdown_list: security_clearance, dropdown_id: get_security_clearance, is_country: false },{ dropdown_data: fetch_security_clearance, dropdown_function: setSecurityClearance });
                setResumeFile(resume_file);
                setPortfolioLink(new_portfolio_link_item);
                filterSelectedDropdownData({ dropdown_list: education_level, dropdown_id: highest_degree, is_country: false },{ dropdown_data: fetch_highest_degree, dropdown_function: setHighestDegree });
                filterSelectedDropdownData({ dropdown_list: us_schools_list, dropdown_id: us_school_id, is_country: false },{ dropdown_data: get_university, dropdown_function: setUniversity });
                setCodingDojoGraduate(is_coding_dojo_graduate);
                filterSelectedDropdownData({ dropdown_list: coding_dojo_program, dropdown_id: coding_dojo_program_item, is_country: false },{ dropdown_data: get_coding_dojo_program, dropdown_function: setCodingDojoProgram });
                setGraduateDate(fetch_graduate_date);
                filterSelectedDropdownData({ dropdown_list: contact_list, dropdown_id: career_service_manager_item, is_country: false },{ dropdown_data: get_career_service_manager, dropdown_function: setCareerServiceManager });

                /* Block of codes to display existing programming skills on load */
                setProgramCoverage(professional_skill);

                let candidate_languages     = [];
                let candidate_technologies  = [];

                professional_skill && professional_skill.map(selected_program_item => {
                    return (selected_program_item.is_language) ? candidate_languages.push(selected_program_item) : candidate_technologies.push(selected_program_item);
                });

                setValue("program_coverage[candidate_languages]", candidate_languages.map(language_item => { return language_item.value }));
                setValue("program_coverage[candidate_technologies]", candidate_technologies.map(technologies_item => { return technologies_item.value }));

                getYearsExperience(years_of_experience.filter(selected_item => selected_item.label === years_experience));
                setauthorizeWork(authorize_work);
                setSponsorshipEmployment(sponsorship_employment);
                
                /* More About You Section */
                setVaccinationStatus(vaccination_status.filter(selected_item => selected_item.label === get_vaccination_status));
                setRacialGroup(get_racial_group && racial_group.filter(selected_item => get_racial_group.includes(selected_item.value)));
                setGenderIdentity(gender_identity.filter(selected_item => selected_item.label === get_gender_identity));
                setIsVeteran(is_veteran);

                setLastUpdatedDate(last_update_date);
                setZipCode(zipcode);
                setStartDate(new Date(start_date));

                setUserInformationUpdate(false);
                setCandidateInformationUpdate(false);
                setEducationDetails(false);
                setWorkExperienceDetails(false);
                setMoreAboutYouDetails(false);
                setUpdateAll(false);
            }
        },
        [ candidate_profile_data ]
    );

    /* For setting up data for Preview Candidate Profile after all updates */
    preview_candidate_profile = {
        first_name: first_name,
        last_name: last_name,
        profile_picture_url: headshot_file,
        candidate_information: {
            country: fetch_country && fetch_country[0].label,
            city: city,
            region: get_region,
            short_bio: short_bio,
            resume_file: resume_file,
            project_urls: portfolio_link_item
        },
        education: {
            highest_degree: fetch_highest_degree && fetch_highest_degree[0].label,
            university_name: get_university && get_university[0].label,
            coding_dojo_program_item: get_coding_dojo_program && get_coding_dojo_program[0].label,
            professional_skills: professional_skill && professional_skill.map(selected_program_item => selected_program_item.label)
        },
        work_experience: {
            years_experience: years_experience,
            sponsorship_employment: (sponsorship_employment && authorize_work)
        }
    };

    return (
        <div id="candidate_profile_block">
            <div className="header_update_information">
                <span className="last_modified">Last modified {Moment(fetch_last_update_date).format("MMM DD, YYYY")} </span>
                <button type="button" className="show_candidate_profile" onClick={ (set_modal_show_data) => setShowModal(set_modal_show_data) }><FontAwesomeIcon icon="eye" /> PREVIEW</button>
                <button type="button" className={ !is_show_update_all ? "update_all_candidate_information" : "hidden" } onClick={ updateAllCandidateProfileData }><FontAwesomeIcon icon="pen" /> EDIT</button>
                { is_show_update_all && <button type="submit" form="candidate_profile_information_form" className="update_all_candidate_information"><FontAwesomeIcon icon="floppy-disk" /> SAVE</button> }
            </div>

            <form id="candidate_profile_information_form" onSubmit={ handleSubmit(onSubmitCandidateInformation) } >
                <div className="user_information">
                    <img src={ candidate_profile_data.upload_data.profile_picture_url } alt="user profile" />

                    { user_information_edit ?
                        <React.Fragment>
                            <div className="details_block">
                                { !is_show_update_all && 
                                    <>
                                        <button className="submit_details_btn" type="submit">SAVE CHANGES</button>
                                        <input type="hidden" name="update_type" value={CANDIDATE_PROFILE_UPDATE_TYPE.user_information} {...register("update_type", { required: true })}/>
                                    </>
                                }
                                <div className="update_details">
                                    <label htmlFor="first_name">
                                        <input type="text" name="first_name" id="first_name" defaultValue={ first_name } className={ errors.first_name && "input_error" } {...register("first_name", { required: true })} placeholder="First Name"/>
                                        <span className="input_title">First Name*</span>
                                        { errors.first_name && <span className="message_error">This field is required</span> }
                                    </label>

                                    <label htmlFor="last_name">
                                        <input type="text" name="last_name" id="last_name" defaultValue={ last_name } className={ errors.last_name && "input_error" } {...register("last_name", { required: true })} placeholder="Last Name"/>
                                        <span className="input_title">Last Name*</span>
                                        { errors.last_name && <span className="message_error">This field is required</span> }
                                    </label>

                                    <label htmlFor="email">
                                        <input type="email" name="email" id="email" defaultValue={ email } className={ errors.email && "input_error" } {...register("email", { 
                                            required: "Please enter your email address",
                                            pattern: {
                                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                message: "Invalid email address"
                                            }
                                        } )} placeholder="Email Address"/>
                                        <span className="input_title">Email*</span>
                                        { errors.email && <span className="message_error">{ errors.email?.message }</span> }
                                        { (!update_errors.is_valid_email) && <span className="message_error">Email is already registed to another account!</span> }
                                    </label>
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="show_details">
                                <span>{ first_name } { last_name }</span>
                                <span>Software Engineer</span>
                                <span>{ email }</span>
                            </div>
                            <button type="button" className="update_details_icon_btn" onClick={ () => { handleOpenEditBlock(CANDIDATE_PROFILE_UPDATE_TYPE.user_information) } }><FontAwesomeIcon icon="pen" /></button>
                        </React.Fragment>
                    }
                </div>
                <div className="candidate_information details_wrapper">
                    { candidate_information_edit ?
                            <React.Fragment>
                                <div className="details_block">
                                    { !is_show_update_all && <button className="submit_details_btn" type="submit">SAVE CHANGES</button> }
                                    <div className="location_block">
                                        <h3>Location*</h3>

                                        <div className="location_input_details">
                                            <input type="hidden" name="country_list" value={ fetch_country && fetch_country[0].id } {...register("country_list", { required: true })} />
                                            
                                            <ReactSearchDropdown
                                                placeholder="Country"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ onChangeCountry }
                                                fetch_data={ fetch_country }
                                                fetch_data_list={ countries_list }
                                                class_name={ (errors.country_list && !fetch_country) ? "country_list input_error" : "country_list" } />

                                            { (fetch_country[0]?.label === "United States") &&
                                                <label htmlFor="zip_code">
                                                    <input type="number" name="zip_code" id="zip_code"  defaultValue={ fetch_zipcode } className={ errors.zip_code && "input_error" } {...register("zip_code", { required: (fetch_country[0].label === "United States") ? true : false })} placeholder="Zipcode"/>
                                                    <span className="input_title">Zipcode*</span>
                                                    { errors.zip_code && <span className="message_error">This field is required</span> }
                                                    { (!update_errors.is_valid_zipcode) && <span className="message_error">Zip Code not found!</span> }
                                                </label>
                                            }

                                            { (fetch_country[0].label !== "United States") &&
                                                <label htmlFor="city">
                                                    <input type="text" name="city" id="city" defaultValue={ (fetch_zipcode) ? null : city } className={ errors.city && "input_error" } {...register("city", { required: (fetch_country[0].label !== "United States") ? true : false })} placeholder="City"/>
                                                    <span className="input_title">City*</span>
                                                    { errors.city && <span className="message_error">This field is required</span> }
                                                </label>
                                            }
                                        </div>
                                    </div>

                                    <div className="check_box_block">
                                        <h3>Are You Open to Relocation?*</h3>
                                        <input type="hidden" name="open_relocation_checkbox" value={ relocation_checkbox } {...register("open_relocation_checkbox", { required: true })} />
                                        <LabelInputRadio name={ "open_relocation_checkbox" } is_update={ relocation_checkbox } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: fetch_relocation_checkbox, radioFunctionState: setRelocationDataItem }) } />
                                    </div>

                                    <div className="check_box_block">
                                        <h3>Would You Be Open to Contract Work?*</h3>
                                        <input type="hidden" name="open_contract_checkbox" value={ contract_checkbox } {...register("open_contract_checkbox", { required: true })} />
                                        <LabelInputRadio name={ "open_contract_checkbox" } is_update={ contract_checkbox } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: fetch_contract_checkbox, radioFunctionState: setContractDataItem }) } />
                                    </div>

                                    <div className="available_start_date_block">
                                        <h3>Available Start Date</h3>
                                        <input type="hidden" name="set_available_start_date" value={ new Date(fetch_start_date) } {...register("set_available_start_date", { required: true })} />
                                        
                                        <ReactDatePicker
                                            errors={ errors.set_available_start_date }
                                            on_change={ (set_start_date_data) => { setStartDate(set_start_date_data) } }
                                            start_date={ new Date(fetch_start_date) } />
                                    </div>

                                    <div className="short_bio_block">
                                        <h3>Short Bio.</h3>

                                        {/* Candidate Last Name */}
                                        <label htmlFor="short_bio">
                                            <textarea type="text" name="short_bio" defaultValue={ short_bio } className={ (errors.short_bio) ? "short_bio input_error" : "short_bio" } {...register("short_bio", { required: true })} placeholder="Briefly tell us about yourself"/>
                                            <span className="input_title">Last Name*</span>
                                            { errors.short_bio && <span className="message_error">This field is required</span> }
                                        </label>
                                    </div>

                                    <div className="current_desired_job_block">
                                        <h3>Current or Desired Job Title*</h3>
                                        <div className="current_desired_job_details">
                                            <input type="hidden" name="current_desired_job_list" value={ fetch_current_desired_job && fetch_current_desired_job[0]?.label } {...register("current_desired_job_list", { required: true })} />

                                            <ReactSearchDropdown
                                                placeholder="Select all that apply"
                                                errors={ errors }
                                                is_multiple={ true }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: fetch_current_desired_job, dropDropdownFunctionState: setCurrentDesiredJob }) }
                                                fetch_data={ fetch_current_desired_job }
                                                fetch_data_list={ current_desired_job }
                                                class_name={ (errors.current_desired_job_list && !fetch_current_desired_job) ? "current_desired_job_list input_error" : "current_desired_job_list" } />
                                        </div>

                                        <ul className="added_item">
                                            { fetch_current_desired_job.length > 0 &&
                                                fetch_current_desired_job.map(selected_item => {
                                                    return(
                                                        <li key={ selected_item.label }>
                                                            <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedItem(selected_item, {dropdown_data: fetch_current_desired_job, dropDropdownFunctionState: setCurrentDesiredJob}) }><FontAwesomeIcon icon="xmark" /></span></button>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                    <div className="security_clearance_block">
                                        <h3>Do You Have a Security Clearance?*</h3>

                                        <div className="security_clearance_details">
                                            <input type="hidden" name="security_clearance_list" value={ fetch_security_clearance && fetch_security_clearance[0].value } {...register("security_clearance_list", { required: true })} />

                                            <ReactSearchDropdown
                                                placeholder="Select your security clearance"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: fetch_security_clearance, dropDropdownFunctionState: setSecurityClearance }) }
                                                fetch_data={ fetch_security_clearance }
                                                fetch_data_list={ security_clearance }
                                                class_name={ (errors.security_clearance_list && !fetch_security_clearance) ? "security_clearance_list input_error" : "security_clearance_list" } />
                                        </div>
                                    </div>

                                    <div className={ "resume_file upload_block " + ((fetch_resume_file === false || (errors.resume_file && !fetch_resume_file)) ? "upload_error" : "") }>
                                        <h3>Attach Your Résumé/CV</h3>
                                        <input type="hidden" name="resume_file" value={ candidate_profile_data.upload_data.resume_url ? candidate_profile_data.upload_data.resume_url : fetch_resume_file } {...register("resume_file", { required: false })} />
                                        <FileUploader handleChange={ handleResumeFileUpload } children={ <p className={ (candidate_profile_data.upload_data.resume_url) ? "" : "placeholder_file_upload" }>{  (candidate_profile_data.upload_data.resume_url) ? candidate_profile_data.upload_data.resume_url.substring(candidate_profile_data.upload_data.resume_url.lastIndexOf('/')+1) : "Select or drag a file" }</p> } name="resume_file" types={ resume_file_types } refs={ register("resume_file", { required: "Please check the file uploaded." }) } />
                                        <p>Please upload a .pdf file that does not exceed 40mb</p>
                                    </div>

                                    <div className="portfolio_links">
                                        <h3>Add Any Relevant Links to Your Portfolio, Projects, or GitHub</h3>
                                        <input type="hidden" name="fetch_portfolio_links" value={ fetch_portfolio_link_item[0].item_url ? fetch_portfolio_link_item.map(added_link => added_link.item_url) : "" } {...register("fetch_portfolio_links", { required: true })} />
                                        {fetch_portfolio_link_item.map((link_item, link_item_index) => {
                                            return (
                                                <div className="porfolio_link_block" key={ link_item_index }>
                                                    <input
                                                        type="text"
                                                        name="item_url"
                                                        className={ (!fetch_portfolio_link_item[0].item_url && errors.fetch_portfolio_links) ? "input_error" : "" }
                                                        placeholder="URL"
                                                        value={ link_item.item_url }
                                                        onChange={ event => handleInputChangePortfolioLink(event, link_item_index) }
                                                    />
                                                    <div className="action_button">
                                                        { (fetch_portfolio_link_item && fetch_portfolio_link_item.length !== 1) &&
                                                            <button type="button" className="remove_url" onClick={ () => handleRemoveClickPortfolioLink(link_item_index) }></button>
                                                        }
                                                        { (fetch_portfolio_link_item && fetch_portfolio_link_item.length - 1 === link_item_index) &&
                                                            <button type="button" className={ (link_item.item_url) ? "add_url" : "add_url no_data" } onClick={ handleAddClickPortfolioLink }>Add</button>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        { (!portfolio_link_item[0].item_url && errors.fetch_portfolio_links) && <span className="message_error">This field is required</span> }
                                    </div>
                                </div>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <div className="show_details">
                                    <h2>Candidate Information</h2>
                                    
                                    <div className="show_details_block">
                                        <h3>Location*</h3>
                                        <span>{ (get_region) && `${get_region},` } { city }, { fetch_country && fetch_country[0].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Are You Open to Relocation?*</h3>
                                        <span>{ RADIO_ITEM_DATA[parseInt(relocation_checkbox)].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Would You Be Open to Contract Work?*</h3>
                                        <span>{ RADIO_ITEM_DATA[parseInt(contract_checkbox)].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Available Start Date</h3>
                                        <span>{ Moment(start_date).format("MM/DD/YY") }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Short Bio.</h3>
                                        <span>{ short_bio }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Current or Desired Job Title*</h3>
                                        <ul className="added_item">
                                            { fetch_current_desired_job.length > 0 &&
                                                fetch_current_desired_job.map(selected_item => {
                                                    return(
                                                        <li key={ selected_item.label }>
                                                            <button type="button">
                                                                <span>{ selected_item.label }</span>
                                                            </button>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Do You Have a Security Clearance?</h3>
                                        <span>{ fetch_security_clearance && fetch_security_clearance[0].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Résumé/CV*</h3>
                                        <a href={ candidate_profile_data.upload_data.resume_url } download="resume.pdf" target="_blank">{  (candidate_profile_data.upload_data.resume_url) ? candidate_profile_data.upload_data.resume_url.substring(candidate_profile_data.upload_data.resume_url.lastIndexOf('/')+1) : "" }</a>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Add Any Relevant Links to Your Portfolio, Projects, or GitHub</h3>
                                        <ul className="portfolio_list">
                                            { portfolio_link_item.length > 0 &&
                                                portfolio_link_item.map(portfolio_item => {
                                                    return (
                                                        <li key={ portfolio_item }>{ portfolio_item }</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <button type="button" className="update_details_icon_btn" onClick={ () => { handleOpenEditBlock(CANDIDATE_PROFILE_UPDATE_TYPE.candidate_information) } }><FontAwesomeIcon icon="pen" /></button>
                            </React.Fragment>
                    }
                </div>
                <div className="education details_wrapper">
                    { education_details ?
                            <React.Fragment>
                                <div className="details_block">
                                    { !is_show_update_all && <button className="submit_details_btn" type="submit">SAVE CHANGES</button> }
                                    <div className="highest_degree_block">
                                        <h3>What is the Highest Degree or Level of Education that You Have Completed?</h3>

                                        <div className="highest_degree_details">
                                            <input type="hidden" name="highest_degree" value={ fetch_highest_degree && fetch_highest_degree[0].value } {...register("highest_degree", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="Select a degree or level of education"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: fetch_highest_degree, dropDropdownFunctionState: setHighestDegree }) }
                                                fetch_data={ fetch_highest_degree }
                                                fetch_data_list={ education_level }
                                                class_name={ (errors.highest_degree && !fetch_highest_degree) ? "highest_degree input_error" : "highest_degree" } />
                                        </div>
                                    </div>

                                    <div className="university_block">
                                        <h3>What College or University Did You Attend?</h3>

                                        <div className="university_details">
                                            <input type="hidden" name="university" value={ get_university && get_university[0].value } {...register("university", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="Select a school"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_university, dropDropdownFunctionState: setUniversity }) }
                                                fetch_data={ get_university }
                                                fetch_data_list={ us_schools_list }  da
                                                class_name={ (errors.university && !get_university) ? "university input_error" : "university" } />
                                        </div>
                                    </div>

                                    <div className="coding_dojo_graduate_block">
                                        <div className="check_box_block">
                                            <h3>Are You a Coding Dojo Graduate?*</h3>
                                            <input type="hidden" name="is_coding_dojo_graduate" value={ fetch_is_coding_dojo_graduate } {...register("is_coding_dojo_graduate", { required: true })} />
                                            <LabelInputRadio name={ "is_coding_dojo_graduate" } is_update={ fetch_is_coding_dojo_graduate } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: fetch_is_coding_dojo_graduate, radioFunctionState: setCodingDojoGraduate }) } custom_data={ "Currently Enrolled" } />
                                        </div>

                                        { (parseInt(fetch_is_coding_dojo_graduate) !== 0) &&
                                            <React.Fragment>
                                                <div className="coding_dojo_program_block">
                                                    <h3>Program You Graduated From</h3>
                                                    <div className="coding_dojo_program_details">
                                                        <input type="hidden" name="coding_dojo_program" value={ get_coding_dojo_program && get_coding_dojo_program[0].value } {...register("coding_dojo_program", { required: false })} />

                                                        <ReactSearchDropdown
                                                            placeholder="Select Your Coding Dojo Program"
                                                            errors={ errors }
                                                            is_multiple={ false }
                                                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_coding_dojo_program, dropDropdownFunctionState: setCodingDojoProgram }) }
                                                            fetch_data={ get_coding_dojo_program }
                                                            fetch_data_list={ coding_dojo_program }
                                                            class_name={ (errors.coding_dojo_program && !get_coding_dojo_program) ? "coding_dojo_program input_error" : "coding_dojo_program" } />
                                                    </div>
                                                </div>

                                                <div className="graduate_date_block">
                                                    <h3>Graduation Date</h3>
                                                    <input type="hidden" name="graduate_date" value={ fetch_graduate_date ? new Date(fetch_graduate_date) : new Date() } {...register("graduate_date", { required: false })} />
                                                    
                                                    <ReactDatePicker
                                                        errors={ errors.graduate_date }
                                                        on_change={ (selected_date) => { setGraduateDate(selected_date) } }
                                                        start_date={ (fetch_graduate_date) ? new Date(fetch_graduate_date) : new Date() } />
                                                </div>

                                                <div className="career_service_manager_block">
                                                    <h3>Coding Dojo CSM (Career Service Manager)</h3>
                                                    <div className="career_service_manager_details">
                                                        <input type="hidden" name="career_service_manager" value={ get_career_service_manager && get_career_service_manager[0].value } {...register("career_service_manager", { required: false })} />

                                                        <ReactSearchDropdown
                                                            placeholder="Please Select Your Career Service Manager"
                                                            errors={ errors }
                                                            is_multiple={ false }
                                                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_career_service_manager, dropDropdownFunctionState: setCareerServiceManager }) }
                                                            fetch_data={ get_career_service_manager }
                                                            fetch_data_list={ contact_list }
                                                            class_name={ (errors.career_service_manager && !get_career_service_manager) ? "career_service_manager input_error" : "career_service_manager" } />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>

                                    <div className="program_coverage_block">
                                        <h3>Professional Skills*</h3>
                                        <div className="program_coverage_details">
                                            <input type="hidden" name="program_coverage[candidate_languages]" {...register("program_coverage[candidate_languages]", { required: false })} />
                                            <input type="hidden" name="program_coverage[candidate_technologies]" {...register("program_coverage[candidate_technologies]", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="Please select all that apply"
                                                errors={ errors }
                                                is_multiple={ true }
                                                is_label={ true }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_program_coverage, dropDropdownFunctionState: setProgramCoverage }) }
                                                fetch_data={ get_program_coverage }
                                                fetch_data_list={ programSkills }
                                                class_name={ (errors.program_coverage && !get_program_coverage) ? "program_coverage input_error" : "program_coverage" } />
                                            
                                            <ul className="added_program">
                                                { get_program_coverage.length > 0 &&
                                                    get_program_coverage.map(selected_item => {
                                                        return(
                                                            <li key={ selected_item.label }>
                                                                <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedItem(selected_item, {dropdown_data: get_program_coverage, dropDropdownFunctionState: setProgramCoverage}) }><FontAwesomeIcon icon="xmark" /></span></button>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <div className="show_details">
                                    <h2>Education</h2>
                                    
                                    <div className="show_details_block">
                                        <h3>What is the Highest Degree or Level of Education that You Have Completed?</h3>
                                        <span>{ fetch_highest_degree && fetch_highest_degree[0].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>What College or University Did You Attend?</h3>
                                        <span>{ get_university && get_university[0].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Are You a Coding Dojo Graduate?*</h3>
                                        <span>{ (parseInt(fetch_is_coding_dojo_graduate) === CUSTOM_RADIO_ITEM_VALUE.currently_enrolled) ? "Currently Enrolled" : RADIO_ITEM_DATA[parseInt(fetch_is_coding_dojo_graduate)].label }</span>
                                    </div>
                                    { parseInt(fetch_is_coding_dojo_graduate) != RADIO_ITEM_DATA[0].value ?
                                        <React.Fragment>
                                            <div className="show_details_block">
                                                <h3>Program You Graduated From</h3>
                                                <span>{ get_coding_dojo_program && get_coding_dojo_program[0].label }</span>
                                            </div>
                                            <div className="show_details_block">
                                                <h3>Graduation Date</h3>
                                                <span>{ (graduate_date) ? Moment(graduate_date).format("MM/DD/YY") : null }</span>
                                            </div>
                                            <div className="show_details_block">
                                                <h3>Coding Dojo CSM</h3>
                                                <span>{ (get_career_service_manager) && get_career_service_manager[0].label }</span>
                                            </div>
                                            <div className="show_details_block">
                                                <h3>Professional Skills*</h3>
                                                <ul className="added_item">
                                                    { professional_skill.length > 0 &&
                                                        professional_skill.map(selected_item => {
                                                            return(
                                                                <li key={ selected_item.label }>
                                                                    <button type="button">
                                                                        <span>{ selected_item.label }</span>
                                                                    </button>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </React.Fragment>
                                        :
                                        null
                                    }
                                </div>
                                <button type="button" className="update_details_icon_btn" onClick={ () => { handleOpenEditBlock(CANDIDATE_PROFILE_UPDATE_TYPE.education) } }><FontAwesomeIcon icon="pen" /></button>
                            </React.Fragment>
                    }
                </div>
                <div className="work_experience details_wrapper">
                    { work_experience_details ?
                            <React.Fragment>
                                <div className="details_block">
                                    { !is_show_update_all && <button className="submit_details_btn" type="submit">SAVE CHANGES</button> }
                                    <div className="years_experience_block">
                                        <h3>Number of Years of Relevant Work Experience</h3>

                                        <div className="years_experience_details">
                                            <input type="hidden" name="years_experience" value={ get_years_experience && get_years_experience[0].value } {...register("years_experience", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="0-2 Years"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_years_experience, dropDropdownFunctionState: getYearsExperience }) }
                                                fetch_data={ get_years_experience }
                                                fetch_data_list={ years_of_experience }
                                                class_name={ (errors.years_experience && !get_years_experience) ? "years_experience input_error" : "years_experience" } />
                                        </div>
                                    </div>

                                    <div className="check_box_block">
                                        <h3>Are You Legally Authorized to Work in the United States?*</h3>
                                        <input type="hidden" name="authorize_work" value={ authorize_work } {...register("authorize_work", { required: true })} />
                                        <LabelInputRadio name={ "authorize_work" } is_update={ authorize_work } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: fetch_authorize_work, radioFunctionState: setauthorizeWork }) } custom_data={ "no_maybe_option" } />
                                    </div>

                                    <div className="check_box_block">
                                        <h3>Do you now, or will you in the future, require sponsorship for employment visa status (e.g., H-1B visa status, etc.) to work legally in the United States?*</h3>
                                        <input type="hidden" name="sponsorship_employment" value={ sponsorship_employment } {...register("sponsorship_employment", { required: true })} />
                                        <LabelInputRadio name={ "sponsorship_employment" } is_update={ sponsorship_employment } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: fetch_sponsorship_employment, radioFunctionState: setSponsorshipEmployment }) } custom_data={ "no_maybe_option" } />
                                    </div>
                                </div>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <div className="show_details">
                                    <h2>Work Experience</h2>
                                    
                                    <div className="show_details_block">
                                        <h3>Number of Years of Relevant Work Experience</h3>
                                        <span>{ years_experience }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Are You Legally Authorized to Work in the United States?*</h3>
                                        <span>{ RADIO_ITEM_DATA[parseInt(authorize_work)].label }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Do you now, or will you in the future, require sponsorship for employment visa status (e.g., H-1B visa status, etc.) to work legally in the United States?*</h3>
                                        <span>{ RADIO_ITEM_DATA[parseInt(sponsorship_employment)].label }</span>
                                    </div>
                                </div>
                                <button type="button" className="update_details_icon_btn" onClick={ () => { handleOpenEditBlock(CANDIDATE_PROFILE_UPDATE_TYPE.work_experience) } }><FontAwesomeIcon icon="pen" /></button>
                            </React.Fragment>
                    }
                </div>
                <div className="more_about_you details_wrapper">
                    { more_about_you_details ?
                            <React.Fragment>
                                <div className="details_block">
                                    { !is_show_update_all && 
                                        <>
                                            <button className="submit_details_btn" type="submit">SAVE CHANGES</button>
                                            <input type="hidden" name="update_type" value={CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you} {...register("update_type", { required: true })}/>
                                        </>
                                    }

                                    <div className="vaccination_status_block">
                                        <h3>Have you been vaccinated for COVID-19?</h3>

                                        <div className="vaccination_status_details">
                                            <input type="hidden" name="vaccination_status" value={ fetch_vaccination_status && fetch_vaccination_status[0].value } {...register("vaccination_status", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="Select a vaccination status"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: fetch_vaccination_status, dropDropdownFunctionState: setVaccinationStatus }) }
                                                fetch_data={ fetch_vaccination_status }
                                                fetch_data_list={ vaccination_status }
                                                class_name={ (errors.vaccination_status && !fetch_vaccination_status) ? "vaccination_status input_error" : "vaccination_status" } />
                                        </div>
                                    </div>

                                    <div className="racial_group_block">
                                        <h3>What Racial/Ethnic Group Do You Belong To?</h3>

                                        <div className="racial_group_details">
                                            <input type="hidden" name="racial_group" value={ fetch_racial_group && fetch_racial_group.map(selected_item => selected_item.value) } {...register("racial_group", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="Please select"
                                                errors={ errors }
                                                is_multiple={ true }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: fetch_racial_group, dropDropdownFunctionState: setRacialGroup }) }
                                                fetch_data={ fetch_racial_group }
                                                fetch_data_list={ racial_group }
                                                class_name={ (errors.racial_group && !fetch_racial_group) ? "racial_group input_error" : "racial_group" } />
                                            
                                            <ul className="added_item">
                                                { fetch_racial_group.length > 0 &&
                                                    fetch_racial_group.map(selected_item => {
                                                        return(
                                                            <li key={ selected_item.label }>
                                                                <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedItem(selected_item, {dropdown_data: fetch_racial_group, dropDropdownFunctionState: setRacialGroup}) }><FontAwesomeIcon icon="xmark" /></span></button>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="gender_identity_block">
                                        <h3>How Do You Describe Your Gender Identity? </h3>

                                        <div className="gender_identity_details">
                                            <input type="hidden" name="gender_identity" value={ fetch_gender_identity && fetch_gender_identity[0].value } {...register("gender_identity", { required: false })} />

                                            <ReactSearchDropdown
                                                placeholder="Select your gender identity"
                                                errors={ errors }
                                                is_multiple={ false }
                                                on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: fetch_gender_identity, dropDropdownFunctionState: setGenderIdentity }) }
                                                fetch_data={ fetch_gender_identity }
                                                fetch_data_list={ gender_identity }
                                                class_name={ (errors.gender_identity && !fetch_gender_identity) ? "gender_identity input_error" : "gender_identity" } />
                                        </div>
                                    </div>

                                    <div className="check_box_block">
                                        <h3>Are You a Veteran?</h3>
                                        <input type="hidden" name="is_veteran" value={ is_veteran } {...register("is_veteran", { required: true })} />
                                        <LabelInputRadio name={ "is_veteran" } is_update={ is_veteran } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: fetch_is_veteran, radioFunctionState: setIsVeteran }) } custom_data={ "I prefer not to say" } />
                                    </div>
                                </div>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <div className="show_details">
                                    <h2>More About You</h2>
                                    
                                    <div className="show_details_block">
                                        <h3>Have you been vaccinated for COVID-19? </h3>
                                        <span>{ get_vaccination_status }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>What Racial/Ethnic Group Do You Belong To?</h3>
                                        <ul className="added_item">
                                            { fetch_racial_group.length > 0 &&
                                                fetch_racial_group.map(selected_item => {
                                                    return(
                                                        <li key={ selected_item.label }>
                                                            <button type="button">
                                                                <span>{ selected_item.label }</span>
                                                            </button>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>How Do You Describe Your Gender Identity? </h3>
                                        <span>{ get_gender_identity }</span>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Are You a Veteran?</h3>
                                        <span>{ (parseInt(is_veteran) === CUSTOM_RADIO_ITEM_VALUE.prefer_not_to_say) ? "I prefer not to say" : RADIO_ITEM_DATA[parseInt(is_veteran)].label }</span>
                                    </div>
                                </div>
                                <button type="button" className="update_details_icon_btn" onClick={ () => { handleOpenEditBlock(CANDIDATE_PROFILE_UPDATE_TYPE.more_about_you) } }><FontAwesomeIcon icon="pen" /></button>
                            </React.Fragment>
                    }
                </div>
            </form>

            <CandidateDetailsModal candidate_data={ preview_candidate_profile } set_show={ set_show_modal } set_hide={ handleClose }></CandidateDetailsModal>
        </div>
    );
}

export default CandidateProfile;