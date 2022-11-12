import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./advanced_candidate.modal.scss";
import ReactSearchDropdown from "../../../../global/components/react_search_dropdown/react_search_dropdown";
import LabelInputRadio from "../../../../global/components/label_input_radio/label_input_radio";
import ReactDatePicker from "../../../../global/components/react_date_picker/react_date_picker";
import { useForm } from "react-hook-form";
import countryList from "react-select-country-list";
import { useCountryRegion } from "react-use-country-region";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

/* JSON */
import dropdownData from "../../../../global/candidate_data.json";

library.add(faCheck);
const { years_of_experience, program_coverage, resume_specialty, security_clearance, education_level, career_service_manager } = dropdownData;

function AdvancedCandidateModal({ set_show, set_hide }) {
    const { register, setValue, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful }, } = useForm();
    const [fetch_country, selectedCountry] = useState("");
    const [fetch_region, getRegion] = useState("");
    const [selected_region, selectedRegionList] = useState("");
    const [relocation_checkbox, setRelocationDataItem] = useState("0");
    const [contract_checkbox, setContractDataItem] = useState("0");
    const [is_allowed_to_work_us, setAllowedToWorkInUS] = useState("0");
    const [start_date, setStartDate] = useState("");
    const [get_years_experience, getYearsExperience] = useState("");
    const [get_resume_specialty, setResumeSpecialty] = useState("");
    const [get_technical_skills, setTechnicalSkills] = useState("");
    const [get_security_clearance, setSecurityClearance] = useState("");
    const [is_industry_experience, setIndustryExperience] = useState(0);
    const [is_coding_dojo_graduate, setCodingDojoGraduare] = useState(0);
    const [get_highest_degree, setHighestDegree] = useState("");
    const [graduate_date, setGraduateDate] = useState("");
    const [get_career_service_manager, setCareerServiceManager] = useState("");

    const country_list = useMemo(() => countryList().getData(), []);
    const { result: selected_country } = useCountryRegion(selected_region);
    const region_list = [];

    if(selected_country){
        const new_result = selected_country.regions.map(({ name: label, shortCode: value }) => ({ label, value }));
        region_list.push(...new_result);
    }

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

    const onChangeRegion = get_region => {
        (get_region.length) ? getRegion(get_region) : getRegion("");
    }

    const openRelocationRadio = (name, data) => {
        setRelocationDataItem(data.target.value);
    }

    const openContractRadio = (name, data) => {
        setContractDataItem(data.target.value);
    }

    const allowedToWorkInUS = (name, data) => {
        setAllowedToWorkInUS(data.target.value);
    }

    const setAvailableStartDate = (selected_date) => {
        setStartDate(selected_date);
    }

    const onChangeYearsExperience = get_years_experience => {
        (get_years_experience.length) ? getYearsExperience(get_years_experience) : getYearsExperience("");
    }

    const onChangeResumeSpecialty = (resume_specialty) => {
        (resume_specialty.length) ? setResumeSpecialty(resume_specialty) : setResumeSpecialty("");
    }

    const onChangeTechnicalSkills = (technical_skills) => {
        (technical_skills.length) ? setTechnicalSkills(technical_skills) : setTechnicalSkills("");
    }

    const removeSelectedResumeSpecialty = (selected_item) => {
        let new_selected_resume_specialty = (get_resume_specialty.length > 1) ? get_resume_specialty.filter(option_item => { return option_item.label !==  selected_item.label }) : "";
        setResumeSpecialty(new_selected_resume_specialty);
    }

    const removeSelectedTechnicalSkills = (selected_item) => {
        let new_selected_technical_skills = (get_technical_skills.length > 1) ? get_technical_skills.filter(program_item => { return program_item.label !==  selected_item.label }) : "";
        setTechnicalSkills(new_selected_technical_skills);
    }

    const onChangeSecurityClearance = (security_clearance) => {
        (security_clearance.length) ? setSecurityClearance(security_clearance) : setSecurityClearance("");
    }

    const onChangeIndustryRequiredExperience = (event) => {
        setIndustryExperience((event.target.checked) ? 1 : 0);
    }

    const onChangeCodingDojoGraduate = (event) => {
        setCodingDojoGraduare((event.target.checked) ? 1 : 0);
    }

    const onChangeHighestDegree = (highest_degree) => {
        (highest_degree.length) ? setHighestDegree(highest_degree) : setHighestDegree("");
    }

    const setChangeGraduateDate = selected_date => {
        setGraduateDate(selected_date);
    }

    const onChangeCareerServiceManager = (career_service_manager) => {
        (career_service_manager.length) ? setCareerServiceManager(career_service_manager) : setCareerServiceManager("");
    }

    const onSubmitFilterForm = (filter_data) => {
        console.log(filter_data)
    }

    const resetFilterForm = () => {
        selectedCountry("");
        selectedCountry("");
        getRegion("");
        selectedRegionList("");
        setRelocationDataItem("");
        setContractDataItem("");
        setAllowedToWorkInUS("");
        setStartDate("");
        getYearsExperience("");
        setResumeSpecialty("");
        setTechnicalSkills("");
        setSecurityClearance("");
        setIndustryExperience(0);
        setCodingDojoGraduare(0);
        setHighestDegree("");
        setGraduateDate("");
        setCareerServiceManager("");

        reset({
            city: "",
        });
    }

    useEffect(() => {
            setValue("country_list", fetch_country && fetch_country[0].label);
            setValue("region_list", fetch_region && fetch_region[0].label);
            setValue("open_relocation_checkbox", relocation_checkbox);
            setValue("open_contract_checkbox", contract_checkbox);
            setValue("is_allowed_to_work", is_allowed_to_work_us);
            setValue("set_available_start_date", start_date);
            setValue("years_experience", get_years_experience && get_years_experience[0].label);
            setValue("resume_specialty", get_resume_specialty && get_resume_specialty.map(selected_item => selected_item.label));
            setValue("technical_skills", get_technical_skills && get_technical_skills.map(selected_item => selected_item.label));
            setValue("security_clearance_list", get_security_clearance && get_security_clearance[0].label);
            setValue("highest_degree", get_highest_degree && get_highest_degree[0].label);
            setValue("graduate_date", graduate_date);
            setValue("career_service_manager", get_career_service_manager && get_career_service_manager.map(selected_item => selected_item.label));
            setValue("industry_required_experience", is_industry_experience);
            setValue("coding_dojo_graduate", is_coding_dojo_graduate);
        }, 
        [
            isSubmitSuccessful,
            isSubmitting,
            setValue,
            fetch_country,
            fetch_region,
            relocation_checkbox,
            contract_checkbox,
            is_allowed_to_work_us,
            start_date,
            get_years_experience,
            get_resume_specialty,
            get_technical_skills,
            get_security_clearance,
            get_highest_degree,
            graduate_date,
            get_career_service_manager,
            is_industry_experience,
            is_coding_dojo_graduate
        ]
    );
    return (
        <React.Fragment>
            <Modal className="advanced_filter_modal" show={ set_show } onHide={ set_hide }>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <form id="advanced_filter_form" onSubmit={ handleSubmit(onSubmitFilterForm) } autoComplete="off">
                        <div className="location_block">
                            <h3>Candidate Location</h3>

                            <div className="location_input_details">
                                <input type="hidden" name="country_list" value={ fetch_country && fetch_country[0].label } {...register("country_list", { required: false })} />
                                <input type="hidden" name="region_list" value={ fetch_region && fetch_region[0].label } {...register("region_list", { required: false })} />
                                
                                <ReactSearchDropdown
                                    placeholder="Country"
                                    errors={ errors }
                                    is_multiple={ false }
                                    on_change_select={ onChangeCountry }
                                    fetch_data={ fetch_country }
                                    fetch_data_list={ country_list }
                                    class_name={ (errors.country_list && !fetch_country) ? "country_list input_error" : "country_list" } />

                                { (fetch_country) &&
                                    <ReactSearchDropdown
                                        placeholder="State/Province"
                                        errors={ errors }
                                        is_multiple={ false }
                                        on_change_select={ onChangeRegion }
                                        fetch_data={ fetch_region }
                                        fetch_data_list={ region_list }
                                        class_name={ (errors.region_list && !fetch_region) ? "region_list input_error" : "region_list" } />
                                }

                                { (fetch_region) &&
                                    <label htmlFor="city">
                                        <input type="text" name="city" id="city" className={ errors.city && "input_error" } {...register("city", { required: false })} placeholder="City"/>
                                        <span className="input_title">City*</span>
                                        { errors.city && <span className="message_error">This field is required</span> }
                                    </label>
                                }
                            </div>
                        </div>

                        <div className="check_box_block">
                            <h3>Are You Open to Relocation?*</h3>
                            <input type="hidden" name="open_relocation_checkbox" {...register("open_relocation_checkbox", { required: false })} />
                            <LabelInputRadio name={ "open_relocation_checkbox" } on_change={ openRelocationRadio } />
                        </div>

                        <div className="check_box_block">
                            <h3>Open to Contract Work?</h3>
                            <input type="hidden" name="open_contract_checkbox" {...register("open_contract_checkbox", { required: false })} />
                            <LabelInputRadio name={ "open_contract_checkbox" } on_change={ openContractRadio } />
                        </div>

                        <div className="check_box_block">
                            <h3>Legally Allowed to Work in the United States?</h3>
                            <input type="hidden" name="is_allowed_to_work" {...register("is_allowed_to_work", { required: false })} />
                            <LabelInputRadio name={ "is_allowed_to_work" } custom_data="no_maybe_option" on_change={ allowedToWorkInUS } />
                        </div>

                        <div className="available_start_date_block">
                            <h3>Available Start Date</h3>
                            <input type="hidden" name="set_available_start_date" {...register("set_available_start_date", { required: false })} />
                            
                            <ReactDatePicker
                                errors={ errors.set_available_start_date }
                                on_change={ setAvailableStartDate }
                                start_date={ start_date } />
                        </div>

                        <div className="years_experience_block">
                            <h3>Number of Years of Relevant Work Experience</h3>

                            <div className="years_experience_details">
                                <input type="hidden" name="years_experience" value={ get_years_experience && get_years_experience[0].label } {...register("years_experience", { required: false })} />

                                <ReactSearchDropdown
                                    placeholder="0-2 Years"
                                    errors={ errors }
                                    is_multiple={ false }
                                    on_change_select={ onChangeYearsExperience }
                                    fetch_data={ get_years_experience }
                                    fetch_data_list={ years_of_experience }
                                    class_name={ (errors.years_experience && !get_years_experience) ? "years_experience input_error" : "years_experience" } />
                            </div>
                        </div>

                        <label htmlFor="industry_required_experience" className="checkbox_block_label">
                            <input type="checkbox" name="industry_required_experience" className="hidden" id="industry_required_experience" onClick={ (event) => onChangeIndustryRequiredExperience(event) } {...register("industry_required_experience", { required: false })}/>
                            <span className="checkbox_style"><FontAwesomeIcon icon="check" /></span>
                            <p>Industry Experience Required</p>
                        </label>

                        <div className="resume_specialty_block">
                            <h3>Résumé Category/Speciality</h3>
                            <div className="resume_specialty_details">
                                <input type="hidden" name="resume_specialty" value={ get_resume_specialty && get_resume_specialty.map(selected_item => selected_item.label) } {...register("resume_specialty", { required: false })} />

                                <ReactSearchDropdown
                                    placeholder="Please select all that apply"
                                    errors={ errors }
                                    is_multiple={ true }
                                    // is_label={ true }
                                    on_change_select={ onChangeResumeSpecialty }
                                    fetch_data={ get_resume_specialty }
                                    fetch_data_list={ resume_specialty }
                                    class_name={ (errors.resume_specialty && !get_resume_specialty) ? "resume_specialty input_error" : "resume_specialty" } />
                                
                                <ul className="added_item">
                                    { get_resume_specialty.length > 0 &&
                                        get_resume_specialty.map(selected_item => {
                                            return(
                                                <li key={ selected_item.label }>
                                                    <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedResumeSpecialty(selected_item) }><FontAwesomeIcon icon="xmark" /></span></button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className="technical_skills_block">
                            <h3>Résumé Category/Speciality</h3>
                            <div className="technical_skills_details">
                                <input type="hidden" name="technical_skills" value={ get_technical_skills && get_technical_skills.map(selected_item => selected_item.label) } {...register("technical_skills", { required: false })} />

                                <ReactSearchDropdown
                                    placeholder="Please select all that apply"
                                    errors={ errors }
                                    is_multiple={ true }
                                    is_label={ true }
                                    on_change_select={ onChangeTechnicalSkills }
                                    fetch_data={ get_technical_skills }
                                    fetch_data_list={ program_coverage }
                                    class_name={ (errors.technical_skills && !get_technical_skills) ? "technical_skills input_error" : "technical_skills" } />
                                
                                <ul className="added_item">
                                    { get_technical_skills.length > 0 &&
                                        get_technical_skills.map(selected_item => {
                                            return(
                                                <li key={ selected_item.label }>
                                                    <button type="button"><span>{ selected_item.label }</span> <span onClick={ () => removeSelectedTechnicalSkills(selected_item) }><FontAwesomeIcon icon="xmark" /></span></button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className="security_clearance_block">
                            <h3>Do You Have a Security Clearance?*</h3>

                            <div className="security_clearance_details">
                                <input type="hidden" name="security_clearance_list" value={ get_security_clearance && get_security_clearance[0].label } {...register("security_clearance_list", { required: false })} />

                                <ReactSearchDropdown
                                    placeholder="Select your security clearance"
                                    errors={ errors }
                                    is_multiple={ false }
                                    on_change_select={ onChangeSecurityClearance }
                                    fetch_data={ get_security_clearance }
                                    fetch_data_list={ security_clearance }
                                    class_name={ (errors.security_clearance_list && !get_security_clearance) ? "security_clearance_list input_error" : "security_clearance_list" } />
                            </div>
                        </div>

                        <div className="highest_degree_block">
                            <h3>What is the Highest Degree or Level of Education that You Have Completed?</h3>

                            <div className="highest_degree_details">
                                <input type="hidden" name="highest_degree" value={ get_highest_degree && get_highest_degree[0].label } {...register("highest_degree", { required: false })} />

                                <ReactSearchDropdown
                                    placeholder="Select a degree or level of education"
                                    errors={ errors }
                                    is_multiple={ false }
                                    on_change_select={ onChangeHighestDegree }
                                    fetch_data={ get_highest_degree }
                                    fetch_data_list={ education_level }
                                    class_name={ (errors.highest_degree && !get_highest_degree) ? "highest_degree input_error" : "highest_degree" } />
                            </div>
                        </div>

                        <label htmlFor="coding_dojo_graduate" className="checkbox_block_label">
                            <input type="checkbox" name="coding_dojo_graduate" className="hidden" id="coding_dojo_graduate" onClick={ (event) => onChangeCodingDojoGraduate(event) } {...register("coding_dojo_graduate", { required: false })}/>
                            <span className="checkbox_style"><FontAwesomeIcon icon="check" /></span>
                            <p>Coding Dojo Graduate</p>
                        </label>

                        <div className="graduate_date_block">
                            <h3>When Did You Graduate from Coding Dojo?</h3>
                            <input type="hidden" name="graduate_date" value={ graduate_date } {...register("graduate_date", { required: false })} />
                            
                            <ReactDatePicker
                                errors={ errors.graduate_date }
                                on_change={ setChangeGraduateDate }
                                start_date={ graduate_date } />
                        </div>

                        <div className="career_service_manager_block">
                            <h3>Coding Dojo CSM (Career Service Manager)</h3>
                            <div className="career_service_manager_details">
                                <input type="hidden" name="career_service_manager" value={ get_career_service_manager && get_career_service_manager[0].label } {...register("career_service_manager", { required: false })} />

                                <ReactSearchDropdown
                                    placeholder="Please Select Your Career Service Manager"
                                    errors={ errors }
                                    is_multiple={ true }
                                    on_change_select={ onChangeCareerServiceManager }
                                    fetch_data={ get_career_service_manager }
                                    fetch_data_list={ career_service_manager }
                                    class_name={ (errors.career_service_manager && !get_career_service_manager) ? "career_service_manager input_error" : "career_service_manager" } />
                            </div>
                        </div>

                        <div className="action_btn">
                            <button type="submit">Apply Filters</button>
                            <button type="button" onClick={ resetFilterForm }>Reset</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

export default AdvancedCandidateModal;