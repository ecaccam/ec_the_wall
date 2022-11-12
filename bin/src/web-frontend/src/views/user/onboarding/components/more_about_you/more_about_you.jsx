/* REACT */
import React, { useState, useEffect } from "react";

/* VENDOR */
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/* COMPONENT */
import ReactSearchDropdown from "../../../../global/components/react_search_dropdown/react_search_dropdown";
import LabelInputRadio from "../../../../global/components/label_input_radio/label_input_radio";

/* HELPERS */
import { onChangeSelectedDropdown, filterSelectedDropdownData, removeSelectedItem, selectRadioItem, renderMultipleDropdownValue } from "../../../../../__helpers/index";

/* CSS */
import "./more_about_you.scss";

/* REDUCER */
import { addMoreAboutYou } from "../../../../../__reducers/candidate.reducer";

/* JSON */
import dropdownData from "../../../../global/candidate_data.json";

/* CONSTANTS */
import { ONBOARDING_PAGE_ID } from "../../../../../__config/constants";

/* ACTION */
import { CandidateActions } from "../../../../../__action/candidate.action";

/* fontawesome library */
library.add(faXmark);

/* Dropdown prototype data. */
const { vaccination_status, racial_group, gender_identity } = dropdownData;

function MoreAboutYou({ set_show_modal, back_form }) {
    /* Fetch the candidate data from reducer. */
    let { candidate_data: { more_about_you: candidate_data, is_save_and_exit } } = useSelector(state => state.candidate);

    const [is_veteran, setIsVeteran]                            = useState("");
    const [get_vaccination_status, setVaccinationStatus]        = useState("");
    const [get_racial_group, setRacialGroup]                    = useState("");
    const [get_gender_identity, setGenderIdentity]              = useState("");
    const dispatch                                              = useDispatch();

    /* This will be used in react hook form to submit, set value and validate the data from form. */
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    
    /**
    * DOCU: This will submit the more about you data. <br>
    * Triggered: MoreAboutYou <br>
    * Last Updated Date: August 15, 2022
    * @param {object} more_about_you_details - To get the submitted more about you data.
    * @author Ruelito
    */
    const onSubmitBackground = async (more_about_you_details) => {
        more_about_you_details.is_save_and_exit = is_save_and_exit;
        more_about_you_details.current_page_id  = ONBOARDING_PAGE_ID.more_about_you;

        await dispatch(CandidateActions.updateOnboardingDetails(more_about_you_details));
    };

    /* Update form_field values */
    useEffect(() => {
            /* This will set the value of inputs on change. */
            setValue("is_veteran", is_veteran);
            setValue("vaccination_status", get_vaccination_status && get_vaccination_status[0].value);
            setValue("racial_group", get_racial_group && get_racial_group.map(selected_item => selected_item.value));
            setValue("gender_identity", get_gender_identity && get_gender_identity[0].value);
        }, 
        [
            isSubmitting,
            setValue,
            is_veteran,
            get_vaccination_status,
            get_racial_group,
            get_gender_identity
        ]
    );

    /* Populate form fields with candidate data */
    useEffect(() => {
            let { vaccination_status_id, racial_group_ids, gender, is_veteran } = candidate_data || {};

            /* This will update the data from reducer for is_veteran radiobox. */
            is_veteran && setIsVeteran(is_veteran);

            /* This will fetch the selected dropdown data (vaccination status and gender) on load. */
            filterSelectedDropdownData(
                { dropdown_list: vaccination_status, dropdown_id: vaccination_status_id, is_country: false },
                { dropdown_data: get_vaccination_status, dropdown_function: setVaccinationStatus 
            });

            filterSelectedDropdownData(
                { dropdown_list: gender_identity, dropdown_id: gender, is_country: false },
                { dropdown_data: get_gender_identity, dropdown_function: setGenderIdentity 
            });

            /* Render multiple dropdown value of racial groups on load. */
            renderMultipleDropdownValue(
                { dropdown_selected_list: racial_group_ids || 'null', dropdown_list: racial_group }, 
                { dropdownData: get_racial_group, dropdownFunctionState: setRacialGroup }
            );
        }, 
        [candidate_data]
    );

    return (
        <div className="form_block">
            <h2>More About You</h2>

            <form id="more_about_you_form" onSubmit={ handleSubmit(onSubmitBackground) } autoComplete="off">
                <div className="vaccination_status_block">
                    <h3>Have you been vaccinated for COVID-19?</h3>

                    <div className="vaccination_status_details">
                        <input type="hidden" name="vaccination_status" value={ get_vaccination_status && get_vaccination_status[0].value } {...register("vaccination_status", { required: false })} />

                        <ReactSearchDropdown
                            placeholder="Select a vaccination status"
                            errors={ errors }
                            is_multiple={ false }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_vaccination_status, dropDropdownFunctionState: setVaccinationStatus }) }
                            fetch_data={ get_vaccination_status }
                            fetch_data_list={ vaccination_status }
                            class_name={ (errors.vaccination_status && !get_vaccination_status) ? "vaccination_status input_error" : "vaccination_status" } />
                    </div>
                </div>

                <div className="racial_group_block">
                    <h3>What Racial/Ethnic Group Do You Belong To?</h3>

                    <div className="racial_group_details">
                        <input type="hidden" name="racial_group" value={ get_racial_group && get_racial_group[0].value } {...register("racial_group", { required: false })} />

                        <ReactSearchDropdown
                            placeholder="Please select"
                            errors={ errors }
                            is_multiple={ true }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_racial_group, dropDropdownFunctionState: setRacialGroup }) }
                            fetch_data={ get_racial_group }
                            fetch_data_list={ racial_group }
                            class_name={ (errors.racial_group && !get_racial_group) ? "racial_group input_error" : "racial_group" } />
                        
                        <ul className="added_item">
                            { get_racial_group.length > 0 &&
                                get_racial_group.map(selected_item => {
                                    return(
                                        <li key={ selected_item.label }>
                                            <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedItem(selected_item, {dropdown_data: get_racial_group, dropDropdownFunctionState: setRacialGroup}) }><FontAwesomeIcon icon="xmark" /></span></button>
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
                        <input type="hidden" name="gender_identity" value={ get_gender_identity && get_gender_identity[0].value } {...register("gender_identity", { required: false })} />

                        <ReactSearchDropdown
                            placeholder="Select your gender identity"
                            errors={ errors }
                            is_multiple={ false }
                            on_change_select={ (selected_dropdown_data) => onChangeSelectedDropdown(selected_dropdown_data, { dropdown_data: get_gender_identity, dropDropdownFunctionState: setGenderIdentity }) }
                            fetch_data={ get_gender_identity }
                            fetch_data_list={ gender_identity }
                            class_name={ (errors.gender_identity && !get_gender_identity) ? "gender_identity input_error" : "gender_identity" } />
                    </div>
                </div>

                <div className="check_box_block">
                    <h3>Are You a Veteran?</h3>
                    <input type="hidden" name="is_veteran" value={ is_veteran } {...register("is_veteran", { required: false })} />
                    <LabelInputRadio name={ "is_veteran" } on_change={ (selected_radio_name, selected_radio_data) => selectRadioItem(selected_radio_name, selected_radio_data, { radio_data: is_veteran, radioFunctionState: setIsVeteran }) } custom_data={ "I prefer not to say" } is_update={ candidate_data?.is_veteran || '' }/>
                </div>

                <div className="form_action_btn">
                    <button className="back_btn" type="button" onClick={ () => back_form(ONBOARDING_PAGE_ID.background) }>BACK</button>
                    <button className="save_exit_btn" type="button" onClick={ () => set_show_modal(true) }>SAVE AND EXIT</button>
                    <button className="submit_btn" type="submit">NEXT</button>
                </div>
            </form>
        </div>
    );
}

export default MoreAboutYou;