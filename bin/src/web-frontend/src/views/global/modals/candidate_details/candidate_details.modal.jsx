import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./candidate_details.modal.scss";

function CandidateDetailsModal({ candidate_data, set_show, set_hide }) {
    const   { first_name, last_name, profile_picture_url } = candidate_data;
    const   { city, country, get_region, resume_file, short_bio, project_urls } = candidate_data.candidate_information;
    const   { highest_degree, university_name, coding_dojo_program_item, professional_skills } = candidate_data.education;
    const   { years_experience, sponsorship_employment } = candidate_data.work_experience;

    return (
        <React.Fragment>
            <Modal className="candidate_details_modal" show={ set_show } onHide={ set_hide }>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="block_details">
                        <img src={ profile_picture_url } alt="" />
                        <div className="user_details">
                            <h2>{ first_name } { last_name }</h2>
                            <span>Software Developer</span>
                            <p>{ short_bio }</p>

                            <div className="action_btn">
                                <a href={ resume_file } download="resume.pdf">Download Resume</a>
                                <button className="disabled">Contact Candidate</button>
                            </div>

                            <div className="links details">
                                <h3>Links</h3>
                                <ul className="with_list_style">
                                    { project_urls.length > 0 &&
                                        project_urls.map(portfolio_item => {
                                            return (
                                                <li key={portfolio_item}>{ portfolio_item }</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="location details">
                                <h3>Location</h3>
                                <p>{ city }{  get_region && ", " + get_region }, { country }</p>
                            </div>
                        </div>
                    </div>

                    <div className="block_details">
                        <div className="user_details">
                            <div className="educational_background details">
                                <h3>Educational Background</h3>
                                <p>{ highest_degree }</p>
                            </div>

                            <div className="school details">
                                <h3>School</h3>
                                <p>{ university_name }</p>
                            </div>

                            <div className="coding_dojo_history details">
                                <h3>Coding Dojo History</h3>
                                <p>{ (coding_dojo_program_item) ? coding_dojo_program_item + "Program" : "--" } </p>
                            </div>

                            { /* TODO: To uncomment specialty once update specialty is available */
                            /* <div className="specialty details">
                                <h3>Specialty</h3>
                                <p>Software Development</p>
                            </div> */}
                        </div>
                    </div>

                    <div className="block_details">
                        <div className="user_details">
                            <div className="location details">
                                <h3>Sponsorship Status</h3>
                                <p>{ (sponsorship_employment) ? "Authorized to work in the US" : "Will Require Sponsorship in the future" }</p>
                            </div>

                            <div className="location details">
                                <h3>Work Experience</h3>
                                <p>{ years_experience }</p>
                            </div>

                            <div className="links details">
                                <h3>Professional Skills</h3>
                                <ul>
                                    { (professional_skills) &&
                                        professional_skills.map(skills => {
                                            return (
                                                <li key={ skills }>{ skills }</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

export default CandidateDetailsModal;