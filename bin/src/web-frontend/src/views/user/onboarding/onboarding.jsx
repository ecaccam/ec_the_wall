import React, { useState, useEffect} from 'react';

/* SCSS */
import "./onboarding.scss";
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import CandidateInformation from './components/candidate_information/candidate_information';
import Background from './components/background/background';
import MoreAboutYou from './components/more_about_you/more_about_you';
import SaveExitModal from './modals/save_exit/save_exit.modal';

/* Actions */
import { CandidateActions } from '../../../__action/candidate.action';

/* Constants */

import { ONBOARDING_PAGE_ID, ONBOARDING_PAGE_FORM } from '../../../__config/constants';

function OnBoarding(props) {
    const [ set_show_save_exit_modal, setSaveExitModal ] = useState(false);
    const dispatch = useDispatch();

    const handleClose = async (is_save_and_exit) => {
        await dispatch(CandidateActions.saveAndExitForm(is_save_and_exit));
        setSaveExitModal(false);
    };

    /* Function to trigger dispatch backForm Action and make API call to backend */
    const handleBackForm = async (current_page_id) => {
        await dispatch(CandidateActions.backForm(current_page_id));
    }
    
    let { candidate_data } = useSelector(state => state.candidate);
    const [active_onboarding_steps, setActiveOnBoardingSteps] = useState(candidate_data.current_page);

    const setActiveBoardingSteps = (active_steps) => {
        setActiveOnBoardingSteps(active_steps);
    }

    const isSaveExitModalShow = (set_modal_show_data) => {
        setSaveExitModal(set_modal_show_data);
    }

    useEffect(() => {
        /* Fetch current_page_id of candidate */
        dispatch(CandidateActions.getCandidateProfile());
        
        /* Update active_onboarding_steps */
        if(candidate_data.current_page){
            setActiveOnBoardingSteps(candidate_data.current_page);
        }
    }, [candidate_data.current_page]);

    return (
        <div id="onboard_wrapper">
            <div id="onboard_container">
                <div id="cd_logo">
                    <a href="https://codingdojo.com/" target="_blank" className="cd_logo_link"><img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/cd_blue_logo.png" alt="Coding Dojo Logo" /></a>
                    <img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/talent_book_logo.png" alt="Talent Book Logo" />
                </div>

                <div className="onboard_block">
                    <ul className="onboard_steps">
                        <li className={ (active_onboarding_steps === ONBOARDING_PAGE_ID.candidate_information) ? "active" : "" }>
                            <span className="circle_style">1</span>
                            <span className="onboard_steps_text">Candidate Information</span>
                        </li>
                        <li className={ (active_onboarding_steps === ONBOARDING_PAGE_ID.background) ? "active" : "" }>
                            <span className="circle_style">2</span>
                            <span className="onboard_steps_text">Background</span>
                        </li>
                        <li className={ (active_onboarding_steps === ONBOARDING_PAGE_ID.more_about_you) ? "active" : "" }>
                            <span className="circle_style">3</span>
                            <span className="onboard_steps_text">More About You</span>
                        </li>
                    </ul>

                    { (active_onboarding_steps === ONBOARDING_PAGE_ID.candidate_information) &&
                        <CandidateInformation set_show_modal={ isSaveExitModalShow } active_onboarding_steps={ setActiveBoardingSteps } candidate_data={ candidate_data } ></CandidateInformation>
                    }
                    
                    { (active_onboarding_steps === ONBOARDING_PAGE_ID.background) &&
                        <Background set_show_modal={ isSaveExitModalShow } active_onboarding_steps={ setActiveBoardingSteps } candidate_data={ candidate_data } back_form={ handleBackForm } ></Background>
                    }

                    { (active_onboarding_steps === ONBOARDING_PAGE_ID.more_about_you) &&
                        <MoreAboutYou set_show_modal={ isSaveExitModalShow } active_onboarding_steps={ setActiveBoardingSteps } candidate_data= { candidate_data.more_about_you } back_form={ handleBackForm } ></MoreAboutYou>
                    }

                    <SaveExitModal set_show={ set_show_save_exit_modal } set_hide={ handleClose } onboarding_page_form={ ONBOARDING_PAGE_FORM[active_onboarding_steps] }></SaveExitModal>
                </div>
            </div>
        </div>
    );
}

export default OnBoarding;