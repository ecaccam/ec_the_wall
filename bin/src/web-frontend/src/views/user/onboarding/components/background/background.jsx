/* REACT */
import React, { useState, useEffect } from "react";

/* VENDOR */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/* COMPONENT */
import ReactSearchDropdown from "../../../../global/components/react_search_dropdown/react_search_dropdown";
import ReactDatePicker from "../../../../global/components/react_date_picker/react_date_picker";
import LabelInputRadio from "../../../../global/components/label_input_radio/label_input_radio";

/* HELPER */
import { onChangeSelectedDropdown, removeSelectedItem, selectRadioItem, filterSelectedDropdownData } from "../../../../../__helpers/index";

/* CSS */
import "./background.scss";

/* JSON */
import dropdownData from "../../../../global/candidate_data.json";
import programSkills from "../../../../global/program_type_skills.json";

/* ACTION */
import { CandidateActions } from "../../../../../__action/candidate.action";

/* CONSTANTS */
import { ONBOARDING_PAGE_ID, IS_CODING_DOJO_GRADUATE } from '../../../../../__config/constants';

library.add(faXmark);

const { coding_dojo_program, education_level, years_of_experience, program_coverage } = dropdownData;

function Background({ active_onboarding_steps, set_show_modal, back_form }) {
    /* Fetch the candidate data from reducer. */
    let { candidate_data } = useSelector(state => state.candidate);

    /* This are the state hook in background step for onboarding page. */
    const [graduate_date, setGraduateDate]                      = useState("");
    const [authorize_work, setAuthorizeWork]                    = useState("");
    const [sponsorship_employment, setSponsorshipEmployment]    = useState("");
    const [is_coding_dojo_graduate, setCodingDojoGraduate]      = useState("");
    const [get_coding_dojo_program, setCodingDojoProgram]       = useState("");
    const [get_career_service_manager, setCareerServiceManager] = useState("");
    const [get_program_coverage, setProgramCoverage]            = useState("");
    const [get_highest_degree, setHighestDegree]                = useState("");
    const [get_university, setUniversity]                       = useState("");
    const [get_years_experience, getYearsExperience]            = useState("");
    const [university_list, updateUsSchoolList]                 = useState("");
    const [contact_list, updateContactList]                     = useState("");
    const [fetch_program_skills, setProgramSkills]              = useState(programSkills);

    /* This will be use to dispatch the data in reducer. */
    const dispatch                                              = useDispatch();

    /* This will be used in react hook form to submit, set value and validate the data from form. */
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, } = useForm();

    /**
    * DOCU: This will submit the background data. <br>
    * Triggered: MoreAboutYou <br>
    * Last Updated Date: August 17, 2022
    * @param {object} background_details - To get the submitted background data.
    * @author Ruelito, Updated by: Fitz
    */
    const onSubmitBackground = async (background_details) => {
        background_details.current_page_id = candidate_data.current_page;
        background_details.is_save_and_exit = candidate_data.is_save_and_exit;

        /* Call action for saving candidate_information */
        await dispatch(CandidateActions.updateOnboardingDetails(background_details));
    };

    /**
    * DOCU: This will update the coding dojo program data on change. <br>
    * Triggered: MoreAboutYou <br>
    * Last Updated Date: August 24, 2022
    * @param {object} selected_data - To get the coding dojo program data on change.
    * @author Ruelito, Updated by: Fitz
    */
    const updateCodingDojoProgramOnChange = (selected_data) => {
        (selected_data.length > 0) && setCodingDojoProgram(selected_data);

        /* If there is a selected program, update the professional skillset list */
        if(selected_data.length > 0){
            let default_professional_skills_list    = programSkills.filter(program_skill_item => program_skill_item.program_id > 4 );
            let program_skills_data_to_add          = programSkills.filter(program_skill_item => program_skill_item.program_id === selected_data[0].value );
            let new_program_skills_data             = [...program_skills_data_to_add, ...default_professional_skills_list];

            setProgramSkills(new_program_skills_data);
            setProgramCoverage([]);
        }
    }

    /**
    * DOCU: This will update the coding dojo graduate data on change. <br>
    * Triggered: MoreAboutYou <br>
    * Last Updated Date: August 24, 2022
    * @param {object} radio_input_data - To get the radio input data on change.
    * @author Ruelito
    */
    const changeRadioIsCodingDojoGraduate = (radio_input_name, radio_input_data) => {
        setCodingDojoGraduate(radio_input_data.target.value);

        /* This will check if the coding dojo gradute is no. */
        if(parseInt(radio_input_data.target.value) === 0){
            setProgramCoverage([]);
            setCodingDojoProgram([]);
            setProgramSkills(programSkills);
        }
    }

    /* Set initial values of form field values */
    useEffect(() => {
            setValue("graduate_date", graduate_date);
            setValue("authorize_work", authorize_work);
            setValue("sponsorship_employment", sponsorship_employment);
            setValue("is_coding_dojo_graduate", is_coding_dojo_graduate);
            setValue("coding_dojo_program", (get_coding_dojo_program.length > 0) && get_coding_dojo_program[0].value);
            setValue("career_service_manager", get_career_service_manager && get_career_service_manager[0].value);
            setValue("highest_degree", get_highest_degree && get_highest_degree[0].value);
            setValue("university", get_university && get_university[0].value);
            setValue("years_experience", get_years_experience && get_years_experience[0].value);
            setValue("program_coverage[all]", get_program_coverage && get_program_coverage.map(selected_item => selected_item.value));

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
            graduate_date,
            authorize_work,
            sponsorship_employment,
            is_coding_dojo_graduate,
            get_coding_dojo_program,
            get_career_service_manager,
            get_highest_degree,
            get_university,
            get_years_experience,
            get_program_coverage,
            fetch_program_skills
        ]
    );

    /* Populate form fields with candidate background data */
    useEffect(() => {
        /* Only update value for is_save_and_exit if save and exit buttong is clicked */
        (candidate_data.is_save_and_exit) && setValue("is_save_and_exit", candidate_data.is_save_and_exit);

        /* If candidate background is present in the state, set values for all form fields */
        if(candidate_data.background){
            let {
                cand_education_level_id, us_school_id, is_codingdojo_graduate, cd_graduated_at, contact_id, program_category_id, program_coverage,
                years_of_work_experience_id, is_usa_authorized, is_visa_sponsorship, university, contact_list
            } = candidate_data.background;

            /* For getting of all university and contact list coming from DB */
            updateUsSchoolList(university);
            updateContactList(contact_list);

            /* For updating values after on load using the helper function for dropdown types */
            filterSelectedDropdownData({ dropdown_list: education_level, dropdown_id: cand_education_level_id, is_country: false },{ dropdown_data: get_highest_degree, dropdown_function: setHighestDegree });
            filterSelectedDropdownData({ dropdown_list: university, dropdown_id: us_school_id, is_country: false },{ dropdown_data: get_university, dropdown_function: setUniversity });
            filterSelectedDropdownData({ dropdown_list: contact_list, dropdown_id: contact_id, is_country: false },{ dropdown_data: get_career_service_manager, dropdown_function: setCareerServiceManager });
            filterSelectedDropdownData({ dropdown_list: coding_dojo_program, dropdown_id: program_category_id, is_country: false },{ dropdown_data: get_coding_dojo_program, dropdown_function: setCodingDojoProgram });
            filterSelectedDropdownData({ dropdown_list: years_of_experience, dropdown_id: years_of_work_experience_id, is_country: false },{ dropdown_data: get_years_experience, dropdown_function: getYearsExperience });

            /* For updating values after on load using the state function for date and radio items */
            setCodingDojoGraduate(is_codingdojo_graduate && String(is_codingdojo_graduate));
            setGraduateDate((cd_graduated_at) ? new Date(cd_graduated_at) : "" );
            setAuthorizeWork(is_usa_authorized);
            setSponsorshipEmployment(is_visa_sponsorship);

            /* Block of codes to display existing programming skills on load */
            setProgramCoverage(program_coverage);

            let candidate_languages     = [];
            let candidate_technologies  = [];

            program_coverage && program_coverage.map(selected_program_item => {
                return (selected_program_item.is_language) ? candidate_languages.push(selected_program_item) : candidate_technologies.push(selected_program_item);
            });

            setValue("program_coverage[candidate_languages]", candidate_languages.map(language_item => { return language_item.value }));
            setValue("program_coverage[candidate_technologies]", candidate_technologies.map(technologies_item => { return technologies_item.value }));

            if(get_coding_dojo_program){
                let default_professional_skills_list    = programSkills.filter(program_skill_item => program_skill_item.program_id > 4);
                let program_skills_data_to_add          = programSkills.filter(program_skill_item => program_skill_item.program_id === get_coding_dojo_program[0].value);
                let new_program_skills_data             = [...program_skills_data_to_add, ...default_professional_skills_list];

                setProgramSkills(new_program_skills_data);
            }
        }
    }, [candidate_data.is_save_and_exit, candidate_data.background]);

    return (
        <div className="form_block">
            <h2>Background</h2>

            <form id="background_form" onSubmit={ handleSubmit(onSubmitBackground) } autoComplete="off">
                <div className="highest_degree_block">
                    <h3>What is the Highest Degree or Level of Education that You Have Completed?</h3>

                    <div className="highest_degree_details">
                        <input type="hidden" name="highest_degree" value={ get_highest_degree && get_highest_degree[0].value } {...register("highest_degree", { required: false })} />

                        <ReactSearchDropdown
                            placeholder="Select a degree or level of education"
                            errors={ errors }
                            is_multiple={ false }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_highest_degree, dropDropdownFunctionState: setHighestDegree }) }
                            fetch_data={ get_highest_degree }
                            fetch_data_list={ education_level }
                            class_name={ (errors.highest_degree && !get_highest_degree) ? "highest_degree input_error" : "highest_degree" } />
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
                            fetch_data_list={ university_list }
                            class_name={ (errors.university && !get_university) ? "university input_error" : "university" } />
                    </div>
                </div>

                <div className="coding_dojo_graduate_block">
                    <div className="check_box_block">
                        <h3>Are You a Coding Dojo Graduate?*</h3>
                        <input type="hidden" name="is_coding_dojo_graduate" value={ is_coding_dojo_graduate } {...register("is_coding_dojo_graduate", { required: true })} />
                        <LabelInputRadio name={ "is_coding_dojo_graduate" }  on_change={ changeRadioIsCodingDojoGraduate } custom_data={ "Currently Enrolled" } is_update={ is_coding_dojo_graduate } />
                    </div>

                    { (is_coding_dojo_graduate && is_coding_dojo_graduate !== IS_CODING_DOJO_GRADUATE.no) &&
                        <React.Fragment>
                            <div className="coding_dojo_program_block">
                                <h3>If Yes, Please Select Your Program</h3>
                                <div className="coding_dojo_program_details">
                                    <input type="hidden" name="coding_dojo_program" value={ (get_coding_dojo_program.length > 0) && get_coding_dojo_program[0].label } {...register("coding_dojo_program", { required: false })} />

                                    <ReactSearchDropdown
                                        placeholder="Select Your Coding Dojo Program"
                                        errors={ errors }
                                        is_multiple={ false }
                                        on_change_select={ updateCodingDojoProgramOnChange }
                                        fetch_data={ get_coding_dojo_program }
                                        fetch_data_list={ coding_dojo_program }
                                        class_name={ (errors.coding_dojo_program && !get_coding_dojo_program) ? "coding_dojo_program input_error" : "coding_dojo_program" } />
                                </div>
                            </div>

                            <div className="graduate_date_block">
                                <h3>When Did You Graduate from Coding Dojo?</h3>
                                <input type="hidden" name="graduate_date" value={ graduate_date } {...register("graduate_date", { required: false })} />
                                
                                <ReactDatePicker
                                    errors={ errors.graduate_date }
                                    on_change={ (selected_date) => { setGraduateDate(selected_date) } }
                                    start_date={ graduate_date } />
                            </div>

                            <div className="career_service_manager_block">
                                <h3>Coding Dojo CSM (Career Service Manager)</h3>
                                <div className="career_service_manager_details">
                                    <input type="hidden" name="career_service_manager" value={ get_career_service_manager && get_career_service_manager[0].label } {...register("career_service_manager", { required: false })} />

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
                        <input type="hidden" name="program_coverage[all]" value={ get_program_coverage && get_program_coverage.map(selected_item => selected_item.value) } {...register("program_coverage[all]", { required: true })} />
                        <input type="hidden" name="program_coverage[candidate_languages]" {...register("program_coverage[candidate_languages]", { required: false })} />
                        <input type="hidden" name="program_coverage[candidate_technologies]" {...register("program_coverage[candidate_technologies]", { required: false })} />

                        <ReactSearchDropdown
                            placeholder="Please select all that apply"
                            errors={ errors }
                            is_multiple={ true }
                            is_label={ true }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_program_coverage, dropDropdownFunctionState: setProgramCoverage }) }
                            fetch_data={ get_program_coverage }
                            fetch_data_list={ fetch_program_skills }
                            get_coding_dojo_program = { get_coding_dojo_program }
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
                    <LabelInputRadio name={ "authorize_work" } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: authorize_work, radioFunctionState: setAuthorizeWork }) } custom_data={ "no_maybe_option" } is_update={ authorize_work } />
                </div>

                <div className="check_box_block">
                    <h3>Do you now, or will you in the future, require sponsorship for employment visa status (e.g., H-1B visa status, etc.) to work legally in the United States?*</h3>
                    <input type="hidden" name="sponsorship_employment" value={ sponsorship_employment } {...register("sponsorship_employment", { required: true })} />
                    <LabelInputRadio name={ "sponsorship_employment" } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: sponsorship_employment, radioFunctionState: setSponsorshipEmployment }) } custom_data={ "no_maybe_option" } is_update={ sponsorship_employment } />
                </div>

                <div className="form_action_btn">
                    <button className="back_btn" type="button" onClick={ () => back_form(ONBOARDING_PAGE_ID.candidate_information) }>BACK</button>
                    <button className="save_exit_btn" type="button" onClick={ () => set_show_modal(true) }>SAVE AND EXIT</button>
                    <button className="submit_btn" type="submit">NEXT</button>
                </div>
            </form>
        </div>
    );
}

export default Background;