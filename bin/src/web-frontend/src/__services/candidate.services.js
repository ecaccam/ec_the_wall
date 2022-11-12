import {APIConstants} from '../__config/constants';

import { FetchApiClass } from './lib/fetch.api';
import { handleAPIResponse }  from "../__helpers/index";


class CandidateServiceApi extends FetchApiClass{
    /**
    * Default constructor.
    */
    constructor() {
        super();
    }

    /**
    * DOCU: Function to fetch candidate details based on onboarding page. <br>
    * Triggered: When user visits onboarding page <br>
    * Last Updated Date: August 4, 2022
    * @function
    * @memberof CandidateServiceApi
    * @author Jovic
    */
    getCandidateProfile = function getCandidateProfile() {
        let candidateService = this;

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/get_onboarding`, {}, true)
        .then(handleAPIResponse)
        .then((response_data) => {
            return response_data;
        });
    }

    /**
    * DOCU: Function to update candidate details based on onboarding page. <br>
    * Triggered: When user submits form in onboarding page <br>
    * Last Updated Date: August 12, 2022
    * @function
    * @memberof CandidateServiceApi
    * @author Jovic
    */
    updateOnboardingDetails = function updateOnboardingDetails(form_values) {
        let candidateService = this;

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/save_onboarding`, form_values, true)
        .then(handleAPIResponse)
        .then((response_data) => {
            return response_data;
        });
    }

    /**
    * DOCU: Function to update current_page_id in session. <br>
    * Triggered: When user clicks Back in Onboaring page <br>
    * Last Updated Date: August 25, 2022
    * @function
    * @memberof CandidateServiceApi
    * @author Jovic
    */
    backForm = function backForm(current_page_id){
        let candidateService = this;

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/back_onboarding`, { current_page_id: current_page_id }, true)
            .then(handleAPIResponse)
            .then((user_response) => {
                return user_response;
        });
    }
    
    /**
    * DOCU: Function to update Candidate Profile page. <br>
    * Triggered: When user submits form in Candidate Profile page <br>
    * Last Updated Date: August 16, 2022
    * @function
    * @memberof CandidateServiceApi
    * @author Jovic
    */
    updateCandidateProfileDetails = function updateCandidateProfileDetails(form_values) {
        let candidateService = this;

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/update_profile`, form_values, true)
        .then(handleAPIResponse)
        .then((response_data) => {
            return response_data;
        });
    }

    /**
    * DOCU: Function to get candidate profile on load. <br>
    * Triggered: When candidate enters to profile-information page.<br>
    * Last Updated Date: August 4, 2022
    * @function
    * @memberof CandidateServiceApi
    * @author Fitz
    */
    getProfile = function getProfile() {
        let candidateService = this;
        return candidateService.sendRequest(`${APIConstants.URL}/candidates/profile`, {}, true)
        .then(handleAPIResponse)
        .then((candidate_response) => {
            return candidate_response;
        });
    }

    /** DOCU: Function to upload user headshot. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 9, 2022
    * @function
    * @memberof
    * @author Adrian
    */
    uploadHeadshot = function uploadHeadshot(profile_headshot) {
        let candidateService = this;
        let user_pic_data    = new FormData();

        user_pic_data.append('profile_headshot', profile_headshot);

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/upload_headshot`, user_pic_data, true, true)
            .then(handleAPIResponse)
            .then((user_response) => {
                return user_response;
        });
    }

    /** DOCU: Function to upload user headshot. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 9, 2022
    * @function
    * @memberof
    * @author Adrian
    */
    uploadResume = function uploadResume(user_resume) {
        let candidateService = this;
        let user_resume_data = new FormData();

        user_resume_data.append('user_resume', user_resume);

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/upload_resume`, user_resume_data, true, true)
            .then(handleAPIResponse)
            .then((user_response) => {
                return user_response;
        });
    }
    /** DOCU: Function to upload user headshot. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 12, 2022
    * @function
    * @memberof
    * @author Adrian
    */
    updateResumeLinks = function updateResumeLinks(user_portfolio_links) {
        let candidateService = this;

        return candidateService.sendRequest(`${APIConstants.URL}/candidates/update_candidate_links`, {user_portfolio_links}, true)
            .then(handleAPIResponse)
            .then((user_response) => {
                return user_response;
        });
    }

}

/**
* @exports CandidateService
* @type {object} CandidateServiceApi Instance
* @const
* Last Updated Date: August 1, 2022
*/
export const CandidateService = new CandidateServiceApi();