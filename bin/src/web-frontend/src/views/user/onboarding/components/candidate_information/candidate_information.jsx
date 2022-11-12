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
import { FileUploader } from "react-drag-drop-files";

/* HELPER */
import {
            filterSelectedDropdownData, onChangeSelectedDropdown, removeSelectedItem,
            selectRadioItem, renderRelevantUrls, renderMultipleDropdownValue
        } from "../../../../../__helpers";

/* ACTION */
import { CandidateActions } from "../../../../../__action/candidate.action";

/* REDUCER */

/* JSON */
import dropdownData from "../../../../global/candidate_data.json";

library.add(faXmark);

const { stage_job_search, security_clearance, portfolio_link } = dropdownData;
const head_file_types = ["JPG", "PNG"];
const resume_file_types = ["PDF"];

function CandidateInformation({ active_onboarding_steps, set_show_modal}) {
    /* Fetch the candidate data from reducer. */
    let { candidate_data } = useSelector(state => state.candidate);

    /* To store the state for FE UX. */
    const [country, selectedCountry]                      = useState("");
    const [get_stage_job_search, getStageJobSearchData]   = useState("");
    const [start_date, setStartDate]                      = useState("");
    const [relocation_checkbox, setRelocationDataItem]    = useState("1");
    const [contract_checkbox, setContractDataItem]        = useState("1");
    const [get_current_desired_job, setCurrentDesiredJob] = useState("");
    const [get_security_clearance, setSecurityClearance]  = useState("");
    const [headshot_file, setHeadShotFile]                = useState(null);
    const [resume_file, setResumeFile]                    = useState(null);
    const [portfolio_link_item, setPortfolioLink]         = useState(portfolio_link);
    const {upload_data: {profile_picture_url, resume_url}} = candidate_data;

    /* This will e use to dispatch the data in reducer. */
    const dispatch = useDispatch();
    
    /**
    * DOCU: This will handle the input change in portforlio link. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 11, 2022
    * @param {object} event - To get the event target value and name.
    * @param {object} link_item_index - To get the index of selected link item.
    * @author Ruelito
    */
    const handleInputChangePortfolioLink = (event, link_item_index) => {
        const { name, value } = event.target;
        const list = [...portfolio_link_item];

        list[link_item_index][name] = value;
        setPortfolioLink(list);
    };

    /**
    * DOCU: This will handle to remove the portforlio link. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 11, 2022
    * @param {object} link_item_index - To get the index of selected link item.
    * @author Ruelito
    */
    const handleRemoveClickPortfolioLink = (link_item_index) => {
        const list = [...portfolio_link_item];

        list.splice(link_item_index, 1);
        setPortfolioLink(list);
    };

    /**
    * DOCU: This will handle to add the portforlio link. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 11, 2022
    * @author Ruelito
    */
    const handleAddClickPortfolioLink = () => {
        setPortfolioLink([...portfolio_link_item, { item_url: "" }]);
    };

    /**
    * DOCU: This will handle the headshot file upload. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 16, 2022
    * @param {object} headshot_file_data - To get the uploaded headshot file raw data.
    * @author Ruelito, Updated by: Adrian
    */
     const handleHeadshotFileUpload = async (headshot_file_data) => {
        const new_image = new Image();
        let file_reader = new FileReader();

        file_reader.onload = function() {
            if (file_reader !== null && typeof file_reader.result == "string") {
                new_image.src = file_reader.result;
            }
        };

        dispatch(CandidateActions.uploadHeadshot(headshot_file_data));
    };

    /**
    * DOCU: This will handle the resume data file upload. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 16, 2022
    * @param {object} resume_file_data - To get the uploaded resume file data.
    * @author Ruelito, Updated by: Adrian
    */
    const handleResumeFileUpload = (resume_file_data) => {
        (resume_file_data.size <= 40000000) ? dispatch(CandidateActions.uploadResume(resume_file_data)) : setResumeFile(false);
    };

    /**
    * DOCU: This will handle the resume data file upload. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 11, 2022
    * @param {object} resume_file_data - To get the uploaded resume file data.
    * @author Ruelito
    */
    const onChangeCountry = (country) => {
        /* Check if the theres a selected country to update the state. */
        if(country.length){
            selectedCountry(country);
        }
    }

    /* This will be used in react hook form to submit, set value and validate the data from form. */
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, } = useForm();

    /**
    * DOCU: This will submit the candidate information data. <br>
    * Triggered: CandidateInformation <br>
    * Last Updated Date: August 11, 2022
    * @param {object} candidate_information - To get the submitted candidate information data.
    * @author Ruelito
    */
    const onSubmitCandidateInformation = async (candidate_information) => {
        /* Add key-value pairs to candidate_information object */
        candidate_information.current_page_id         = candidate_data.current_page;
        candidate_information.cand_location_id        = candidate_data.candidate_information.cand_location_id;
        candidate_information.cand_job_preferences_id = candidate_data.candidate_information.cand_job_preferences_id;
        
        /* Call action for saving candidate_information */
        dispatch(CandidateActions.updateOnboardingDetails(candidate_information));
    };

    /* update form_field values */
    useEffect(() => {
            /* This will set the value of inputs on change. */
            setValue("country_list", country && country[0].id);
            setValue("stage_job_search_list", get_stage_job_search && get_stage_job_search[0].value);
            setValue("set_available_start_date", start_date);
            setValue("open_relocation_checkbox", relocation_checkbox);
            setValue("open_contract_checkbox", contract_checkbox);
            setValue("current_desired_job_list", get_current_desired_job && get_current_desired_job.map(selected_item => selected_item.value));
            setValue("security_clearance_list", get_security_clearance && get_security_clearance[0].value);
            setValue("fetch_portfolio_links", portfolio_link_item[0].item_url && portfolio_link_item.map(added_link => added_link.item_url));
        }, 
        [
            isSubmitting,
            setValue,
            country,
            get_stage_job_search,
            start_date,
            relocation_checkbox,
            contract_checkbox,
            get_current_desired_job,
            get_security_clearance,
            portfolio_link_item
        ]
    );

    /* Populate form fields with candidate data */
    useEffect(() => {
        /* Only update value for is_save_and_exit if save and exit buttong is clicked */
        (candidate_data.is_save_and_exit) && setValue("is_save_and_exit", candidate_data.is_save_and_exit);

        /* If candidate_information is present in the state, set values for all form fields */
        if(candidate_data.candidate_information){
            let {
                can_relocate, can_contract_work, available_start_date, job_search_status_id,
                security_clearance_id, country_id, countries_list, city, zip_code, short_bio, 
                relevant_urls, current_desired_job_list, cand_role_types_list
            } = candidate_data.candidate_information;
            
            /* This will update the data from reducer for relocation and contract checkbox. */
            setRelocationDataItem(can_relocate);
            setContractDataItem(can_contract_work);
            setStartDate((available_start_date) && new Date(available_start_date));
            
            /* This will assign values for input fields that doesn't need a helper function */
            setValue("is_save_and_exit", candidate_data.is_save_and_exit);
            setValue("first_name", candidate_data.first_name);
            setValue("last_name", candidate_data.last_name);
            setValue("email", candidate_data.email);
            setValue("stage_job_search_list", job_search_status_id);
            setValue("short_bio", short_bio);
            (zip_code) ? setValue("zip_code", zip_code) : setValue("city", city);
            
            /* This will fetch the selected dropdown data on load. */
            filterSelectedDropdownData({ dropdown_list: stage_job_search, dropdown_id: job_search_status_id, is_country: false },{ dropdown_data: get_stage_job_search, dropdown_function: getStageJobSearchData });
            filterSelectedDropdownData({ dropdown_list: security_clearance, dropdown_id: security_clearance_id, is_country: false },{ dropdown_data: get_security_clearance, dropdown_function: setSecurityClearance });
            filterSelectedDropdownData({ dropdown_list: countries_list, dropdown_id: country_id, is_country: true }, { dropdown_data: country, dropdown_function: selectedCountry });
            
            /* Render relevant item URLs. */
            renderRelevantUrls(relevant_urls, { portfolio_link_item, setPortfolioLink });
            
            /* Render multiple dropdown value */
            renderMultipleDropdownValue({ dropdown_selected_list: current_desired_job_list, dropdown_list: cand_role_types_list }, { dropdownData: get_current_desired_job, dropdownFunctionState: setCurrentDesiredJob });
        }
    }, [candidate_data.is_save_and_exit, candidate_data.candidate_information]);

    return (
        <div className="form_block">
            <h2>Candidate Information</h2>

            <form id="candidate_information_form" onSubmit={ handleSubmit(onSubmitCandidateInformation) } autoComplete="off">
                <input type="hidden" name="is_save_and_exit" defaultValue={ candidate_data.is_save_and_exit } {...register("is_save_and_exit", { required: false })} />
                <div className="user_information">
                    {/* Candidate First Name */}
                    <label htmlFor="first_name">
                        <input type="text" name="first_name" id="first_name" className={ errors.first_name && "input_error" } {...register("first_name", { required: true })} placeholder="First Name" defaultValue={ candidate_data.first_name } />
                        <span className="input_title">First Name*</span>
                        { errors.first_name && <span className="message_error">This field is required</span> }
                    </label>

                    {/* Candidate Last Name */}
                    <label htmlFor="last_name">
                        <input type="text" name="last_name" id="last_name" className={ errors.last_name && "input_error" } {...register("last_name", { required: true })} placeholder="Last Name" defaultValue={ candidate_data.last_name } />
                        <span className="input_title">Last Name*</span>
                        { errors.last_name && <span className="message_error">This field is required</span> }
                    </label>

                    {/* Candidate Email */}
                    <label htmlFor="email">
                        <input type="email" name="email" id="email" className={ errors.email && "input_error" } {...register("email", { 
                            required: "Please enter your email address",
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address"
                            }
                        } )} placeholder="Email Address" defaultValue={ candidate_data.email } />
                        <span className="input_title">Email*</span>
                        { (errors.email ) && <span className="message_error">{ errors.email?.message }</span> }
                        { (!candidate_data.candidate_information_errors.is_valid_email) && <span className="message_error">Email is already registed to another account!</span> }
                    </label>
                </div>

                <div className="location_block">
                    <h3>Location*</h3>

                    <div className="location_input_details">
                        <input type="hidden" name="country_list" value={ country && country[0].id } {...register("country_list", { required: true })} />
                        
                        <ReactSearchDropdown
                            placeholder="Country"
                            errors={ errors }
                            is_multiple={ false }
                            on_change_select={ onChangeCountry }
                            fetch_data={ country }
                            fetch_data_list={ candidate_data.candidate_information.countries_list }
                            class_name={ (errors.country_list && !country) ? "country_list input_error" : "country_list" } />

                        {   (country.length > 0 && country[0].value === "US") &&
                                <label htmlFor="zip_code">
                                    <input type="number" name="zip_code" id="zip_code" className={ errors.zip_code && "input_error" } {...register("zip_code", { required: (country.length && country[0].value === "US") ? true : false })} placeholder="Zipcode"/>
                                    <span className="input_title">Zipcode*</span>
                                    { errors.zip_code && <span className="message_error">This field is required</span> }
                                    { (!candidate_data.candidate_information_errors.is_valid_zipcode) && <span className="message_error">Zip Code not found!</span> }
                                </label>
                        }
                        {   (country.length > 0 && country[0].value !== "US") &&
                                <label htmlFor="city">
                                    <input type="text" name="city" id="city" className={ errors.city && "input_error" } {...register("city", { required: (country.length && country[0].value !== "US") ? true : false })} placeholder="City"/>
                                    <span className="input_title">City*</span>
                                    { errors.city && <span className="message_error">This field is required</span> }
                                </label>
                        }
                    </div>
                </div>

                <div className="check_box_block">
                    <h3>Are You Open to Relocation?*</h3>
                    <input type="hidden" name="open_relocation_checkbox" defaultValue={ relocation_checkbox } {...register("open_relocation_checkbox", { required: true })} />
                    <LabelInputRadio name={ "open_relocation_checkbox" } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: relocation_checkbox, radioFunctionState: setRelocationDataItem }) } is_update={ candidate_data.candidate_information.can_relocate } />
                </div>

                <div className="check_box_block">
                    <h3>Would You Be Open to Contract Work?*</h3>
                    <input type="hidden" name="open_contract_checkbox" defaultValue={ contract_checkbox } {...register("open_contract_checkbox", { required: true })} />
                    <LabelInputRadio name={ "open_contract_checkbox" } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: contract_checkbox, radioFunctionState: setContractDataItem }) } is_update={ candidate_data.candidate_information.can_contract_work } />
                </div>
                
                <div className="stage_job_search_block">
                    <h3>What Stage in Your Job Search Are You?*</h3>

                    <div className="stage_job_search_input_details">
                        <input type="hidden" name="stage_job_search_list" defaultValue={ get_stage_job_search && get_stage_job_search[0].value } {...register("stage_job_search_list", { required: true })} />

                        <ReactSearchDropdown
                            placeholder="Select the stage of search you are in"
                            errors={ errors }
                            is_multiple={ false }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_stage_job_search, dropDropdownFunctionState: getStageJobSearchData }) }
                            fetch_data={ get_stage_job_search }
                            fetch_data_list={ stage_job_search }
                            class_name={ (errors.stage_job_search_list && !get_stage_job_search) ? "stage_job_search_list input_error" : "stage_job_search_list" } />
                    </div>
                </div>

                <div className="available_start_date_block">
                    <h3>Available Start Date</h3>
                    <input type="hidden" name="set_available_start_date" defaultValue={ start_date } {...register("set_available_start_date", { required: false })} />
                    
                    <ReactDatePicker
                        errors={ errors.set_available_start_date }
                        on_change={ (selected_date) => setStartDate(selected_date) }
                        start_date={ start_date } />
                </div>

                <div className="short_bio_block">
                    <h3>Short Bio.</h3>

                    {/* Candidate Last Name */}
                    <label htmlFor="short_bio">
                        <textarea type="text" name="short_bio" className={ (errors.short_bio) ? "short_bio input_error" : "short_bio" } {...register("short_bio", { required: false })} placeholder="Briefly tell us about yourself"/>
                        <span className="input_title">Last Name*</span>
                        { errors.short_bio && <span className="message_error">This field is required</span> }
                    </label>
                </div>

                <div className="current_desired_job_block">
                    <h3>Current or Desired Job Title*</h3>
                    <div className="current_desired_job_details">
                        <input type="hidden" name="current_desired_job_list" value={ get_current_desired_job && get_current_desired_job[0].label } {...register("current_desired_job_list", { required: true })} />

                        <ReactSearchDropdown
                            placeholder="Select all that apply"
                            errors={ errors }
                            is_multiple={ true }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_current_desired_job, dropDropdownFunctionState: setCurrentDesiredJob }) }
                            fetch_data={ get_current_desired_job }
                            fetch_data_list={ candidate_data.candidate_information.cand_role_types_list }
                            class_name={ (errors.current_desired_job_list && !get_current_desired_job) ? "current_desired_job_list input_error" : "current_desired_job_list" } />
                    </div>

                    <ul className="added_item">
                        { get_current_desired_job.length > 0 &&
                            get_current_desired_job.map(selected_item => {
                                return(
                                    <li key={ selected_item.label }>
                                        <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedItem(selected_item, {dropdown_data: get_current_desired_job, dropDropdownFunctionState: setCurrentDesiredJob}) }><FontAwesomeIcon icon="xmark" /></span></button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className="security_clearance_block">
                    <h3>Do You Have a Security Clearance?*</h3>

                    <div className="security_clearance_details">
                        <input type="hidden" name="security_clearance_list" value={ get_security_clearance && get_security_clearance[0].label } {...register("security_clearance_list", { required: true })} />

                        <ReactSearchDropdown
                            placeholder="Select your security clearance"
                            errors={ errors }
                            is_multiple={ false }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_security_clearance, dropDropdownFunctionState: setSecurityClearance }) }
                            fetch_data={ get_security_clearance }
                            fetch_data_list={ security_clearance }
                            class_name={ (errors.security_clearance_list && !get_security_clearance) ? "security_clearance_list input_error" : "security_clearance_list" } />
                    </div>
                </div>

                <div className={ "resume_file upload_block " + ((resume_file === false || (errors.resume_file && !resume_file)) ? "upload_error" : "") }>
                    <h3>Attach Your Résumé/CV*</h3>
                    <input type="hidden" name="resume_file" value={ resume_file ? resume_file : "" } {...register("resume_file", { required: false })} />
                    <FileUploader handleChange={ handleResumeFileUpload } children={ <p className={ (resume_file) ? "" : "placeholder_file_upload" }>{ (resume_url) ? resume_url.substring(resume_url.lastIndexOf('/')+1) : "Select or drag a file" }</p> } name="resume_file" types={ resume_file_types } refs={ register("resume_file", { required: "Please check the file uploaded." }) } />
                    <p>Please upload a .pdf file that does not exceed 40mb</p>
                </div>

                <div className={ "headshot_file upload_block " + ((headshot_file === false || (errors.headshot_file && !headshot_file)) ? "upload_error" : "") }>
                    <h3>Upload a Headshot*</h3>
                    <input type="hidden" name="headshot_file" value={ headshot_file ? headshot_file : "" } {...register("headshot_file", { required: false })} />
                    <FileUploader handleChange={ handleHeadshotFileUpload } children={ <p className={ (headshot_file) ? "" : "placeholder_file_upload" }>{ (profile_picture_url) ? profile_picture_url.substring(profile_picture_url.lastIndexOf('/')+1) : "Select or drag a file" }</p> } name="headshot_file" types={ head_file_types } refs={ register("headshot_file", { required: "Please check the file uploaded." }) } />
                    <p>Minimum of 1500x1500px</p>
                </div>

                <div className="portfolio_links">
                    <h3>Add Any Relevant Links to Your Portfolio, Projects, or GitHub</h3>
                    <input type="hidden" name="fetch_portfolio_links" value={ portfolio_link_item[0].item_url ? portfolio_link_item.map(added_link => added_link.item_url) : "" } {...register("fetch_portfolio_links", { required: false })} />
                    {portfolio_link_item.map((link_item, link_item_index) => {
                        return (
                            <div className="porfolio_link_block" key={ link_item_index }>
                                <input
                                    type="text"
                                    name="item_url"
                                    className={ (!portfolio_link_item[0].item_url && errors.fetch_portfolio_links) ? "input_error" : "" }
                                    placeholder="URL"
                                    value={ link_item.item_url }
                                    onChange={ event => handleInputChangePortfolioLink(event, link_item_index) }
                                />
                                <div className="action_button">
                                    { (portfolio_link_item && portfolio_link_item.length !== 1) &&
                                        <button type="button" className="remove_url" onClick={ () => handleRemoveClickPortfolioLink(link_item_index) }></button>
                                    }
                                    { (portfolio_link_item && portfolio_link_item.length - 1 === link_item_index) &&
                                        <button type="button" className={ (link_item.item_url) ? "add_url" : "add_url no_data" } onClick={ handleAddClickPortfolioLink }>Add</button>
                                    }
                                </div>
                            </div>
                        );
                    })}

                    { (!portfolio_link_item[0].item_url && errors.fetch_portfolio_links) && <span className="message_error">This field is required</span> }
                </div>

                <div className="form_action_btn">
                    <button className="back_btn" type="button">BACK</button>
                    <button className="save_exit_btn" type="button" onClick={ () => set_show_modal(true) }>SAVE AND EXIT</button>
                    <button className="submit_btn" type="submit">NEXT</button>
                </div>
            </form>
        </div>
    );
}

export default CandidateInformation;