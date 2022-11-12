/* REACT */
import React, { useState, useEffect } from 'react';

/* VENDOR */
import { useDispatch, useSelector } from "react-redux/es/exports";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FileUploader } from "react-drag-drop-files";

/* REDUCER */
import { updateResumeLinks } from '../../../../__reducers/candidate_profile_information.reducer';

/* CSS */
import "./resume_links_content.scss";

/* ACTIONS */
import { CandidateActions } from '../../../../__action/candidate.action'

/* FONT AWESOME ICON USED */
library.add(faPen, faFloppyDisk);

const resume_file_types = ["PDF"];
const head_file_types = ["JPG", "PNG"];

function ResumeLinksContents(props) {
    /* This will e use to dispatch the data in reducer. */
    const dispatch = useDispatch();

    /* This will be used in react hook form to submit, set value and validate the data from form. */
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    const { candidate_profile_data:{candidate_information:{portfolio_link_item}}, candidate_profile_data: {upload_data: {profile_picture_url, resume_url}} } = useSelector(state => state.candidate_profile);
    const [is_show_update_all, setUpdateAll]     = useState(false);
    const [fetch_resume_file, setResumeFile]     = useState(resume_url);
    const [fetch_headshot_file, setHeadShotFile] = useState(profile_picture_url);

    const [fetch_portfolio_link_item, setPortfolioLink] = useState([""]);

    let new_portfolio_link_item = [...portfolio_link_item].map(selected_item => ({item_url: selected_item}));

    /**
    * DOCU: This will handle the resume data file upload. <br>
    * Triggered: ResumeLinksContents <br>
    * Last Updated Date: August 15, 2022
    * @param {object} resume_file_data - To get the uploaded resume file data.
    * @author Ruelito
    */
    const handleResumeFileUpload = (resume_file_data) => {
        (resume_file_data.size <= 40000000) ? dispatch(CandidateActions.uploadResume(resume_file_data)) : setResumeFile(false);
    };

    /**
    * DOCU: This will handle the input change in portforlio link. <br>
    * Triggered: ResumeLinksContents <br>
    * Last Updated Date: August 15, 2022
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
    * Triggered: ResumeLinksContents <br>
    * Last Updated Date: August 15, 2022
    * @param {object} link_item_index - To get the index of selected link item.
    * @author Ruelito
    */
    const handleRemoveClickPortfolioLink = (link_item_index) => {
        const list = [...fetch_portfolio_link_item];

        list.splice(link_item_index, 1);
        setPortfolioLink(list);
    };

    /**
    * DOCU: This will handle the headshot file upload. <br>
    * Triggered: ResumeLinksContents <br>
    * Last Updated Date: August 11, 2022
    * @param {object} headshot_file_data - To get the uploaded headshot file raw data.
    * @author Ruelito
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
    * DOCU: This will submit the resume link form data. <br>
    * Triggered: ResumeLinksContents <br>
    * Last Updated Date: August 15, 2022
    * @param {object} candidate_information - To get the submitted resume link form data.
    * @author Ruelito
    */
    const onSubmitResumeLinksFormData = (resume_links_data) => {
        setUpdateAll(false);
        dispatch(CandidateActions.updateResumeLinks(resume_links_data.fetch_portfolio_links));
    };

    useEffect(() => {
            setValue("resume_file", fetch_resume_file);
            setValue("fetch_portfolio_links", fetch_portfolio_link_item && fetch_portfolio_link_item.map(added_link => added_link.item_url));
        },
        [
            isSubmitting,
            setValue,
            fetch_resume_file,
            fetch_headshot_file,
            fetch_portfolio_link_item
        ]
    );

    useEffect(() => {
            dispatch(CandidateActions.getProfile());
        },
        []
    );

    useEffect(() => {
            setPortfolioLink(new_portfolio_link_item);
        },
        [portfolio_link_item]
    );

    return (
        <div className="resume_links_block">
            <div className="header_update_information">
                <button type="button" className={ !is_show_update_all ? "update_all_resume_links" : "hidden" } onClick={ () => {  setUpdateAll(true) } }><FontAwesomeIcon icon="pen" /> EDIT</button>
                { is_show_update_all && <button type="submit" form="resume_links_form" className="update_all_resume_links"><FontAwesomeIcon icon="floppy-disk" /> SAVE</button> }
            </div>

            <form id="resume_links_form" onSubmit={ handleSubmit(onSubmitResumeLinksFormData) } >
                <div className="resume_links details_wrapper">
                    { is_show_update_all ?
                            <React.Fragment>
                                <div className="details_block">
                                    { !is_show_update_all && <button className="submit_details_btn" type="submit">SAVE CHANGES</button> }

                                    <div className={ "resume_file upload_block " + ((fetch_resume_file === false || (errors.resume_file && !fetch_resume_file)) ? "upload_error" : "") }>
                                        <h3>Attach Your Résumé/CV</h3>
                                        <input type="hidden" name="resume_file" value={ resume_url ? resume_url : "" } {...register("resume_file", { required: false })} />
                                        <FileUploader handleChange={ handleResumeFileUpload } children={ <p className={ (fetch_resume_file) ? "" : "placeholder_file_upload" }>{ (resume_url) ? resume_url.substring(resume_url.lastIndexOf('/')+1) : "Select or drag a file" }</p> } name="resume_file" types={ resume_file_types } refs={ register("resume_file", { required: "Please check the file uploaded." }) } />
                                        <p>Please upload a .pdf file that does not exceed 40mb</p>
                                    </div>

                                    <div className={ "headshot_file upload_block " + ((fetch_headshot_file === false || (errors.headshot_file && !fetch_headshot_file)) ? "upload_error" : "") }>
                                        <h3>Upload a Headshot*</h3>
                                        <input type="hidden" name="headshot_file" value={ profile_picture_url ? profile_picture_url : "" } {...register("headshot_file", { required: false })} />
                                        <FileUploader handleChange={ handleHeadshotFileUpload } children={ <p className={ (profile_picture_url) ? "" : "placeholder_file_upload" }>{ (profile_picture_url) ? profile_picture_url.substring(profile_picture_url.lastIndexOf('/')+1) : "Select or drag a file" }</p> } name="headshot_file" types={ head_file_types } refs={ register("headshot_file", { required: "Please check the file uploaded." }) } />
                                        <p>Minimum of 1500x1500px</p>
                                    </div>

                                    <div className="portfolio_links">
                                        <h3>Add Any Relevant Links to Your Portfolio, Projects, or GitHub</h3>
                                        <input type="hidden" name="fetch_portfolio_links" value={ portfolio_link_item } {...register("fetch_portfolio_links", { required: true })} />
                                        {fetch_portfolio_link_item.map((link_item, link_item_index) => {
                                            return (
                                                <div className="porfolio_link_block" key={ link_item_index }>
                                                    <input
                                                        type="text"
                                                        name="item_url"
                                                        className={ (errors.fetch_portfolio_links) ? "input_error" : "" }
                                                        placeholder="URL"
                                                        value={ link_item.item_url }
                                                        onChange={ event => handleInputChangePortfolioLink(event, link_item_index) }
                                                    />
                                                    <div className="action_button">
                                                        { (fetch_portfolio_link_item.length !== 1 ) &&
                                                            <button type="button" className="remove_url" onClick={ () => handleRemoveClickPortfolioLink(link_item_index) }></button>
                                                        }
                                                        { (fetch_portfolio_link_item && fetch_portfolio_link_item.length - 1 === link_item_index) &&
                                                            <button type="button" className={ (link_item.item_url) ? "add_url" : "add_url no_data" } onClick={ () => setPortfolioLink([...fetch_portfolio_link_item, { item_url: "" }]) }>Add</button>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        { (!fetch_portfolio_link_item.length && errors.fetch_portfolio_links) && <span className="message_error">This field is required</span> }
                                    </div>
                                </div>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <div className="show_details">
                                    <div className="show_details_block">
                                        <h3>Résumé/CV*</h3>
                                        <a href={ resume_url } target="_blank" download="resume.pdf">{ (resume_url) ? resume_url.substring(resume_url.lastIndexOf('/')+1) : "" }</a>
                                    </div>
                                    <div className="show_details_block">
                                        <h3>Upload a Headshot*</h3>
                                        <a href={ profile_picture_url } target="_blank" download="resume.pdf">{ (profile_picture_url) ? profile_picture_url.substring(profile_picture_url.lastIndexOf('/')+1) : "" }</a>
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
                            </React.Fragment>
                    }
                </div>
            </form>
        </div>
    );
}

export default ResumeLinksContents;