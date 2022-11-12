import { CandidateService } from "../__services/candidate.services";
import { setSaveAndExit, successBackForm, successGetCandidateProfile, successCandidateInformation, errorCandidateInformation, addBackground, errorBackground, successCandidateOnboarding, successUploadHeadshotUser, errorUploadHeadshotUser, successUploadResumeUser, errorUploadResumeUser, successUpdateResumeLinks, errorUpdateResumeLinks } from '../__reducers/candidate.reducer';
import { setSuccessCandidateProfile, successUpdateCandidateProfile, errorUpdateCandidateProfile, successUploadResumeProfileInformationPage, successUploadHeadshotProfileInformationPage, successUpdateResumeLinksProfile } from '../__reducers/candidate_profile_information.reducer'
import { ONBOARDING_PAGE_ID } from "../__config/constants";

class CandidateActionApi{
    /**
    * Default constructor.
    */
    constructor() { }

    /**
    * DOCU: Function to update value for is_save_and_exit in Onboarding page. <br>
    * Triggered: When user clicks save and exit <br>
    * Last Updated Date: August 19, 2022
    * @function
    * @memberof CandidateActionApi
    * @author Jovic, Updated by: CE
    */
    saveAndExitForm = function saveAndExitForm(is_save_and_exit){
        return async dispatch => { dispatch(setSaveAndExit(is_save_and_exit)) };
    }

    /**
    * DOCU: Function to update current_page_id in session. <br>
    * Triggered: When user clicks Back in Onboaring page <br>
    * Last Updated Date: August 25, 2022
    * @function
    * @memberof CandidateActionApi
    * @author Jovic
    */
    backForm = function backForm(current_page_id){
        return async dispatch => {
            return await CandidateService.backForm(current_page_id).then((response_data) => {
                if(response_data.status === true){
                    dispatch(successBackForm(response_data));
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to fetch candidate-related data. <br>
    * Triggered: When user visits Onboaring page <br>
    * Last Updated Date: August 12, 2022
    * @function
    * @memberof CandidateActionApi
    * @author Jovic
    */
    getCandidateProfile = function getCandidateProfile(){
        return async dispatch => {
            return await CandidateService.getCandidateProfile().then((response_data) => {
                if(response_data.status === true){
                    dispatch(successGetCandidateProfile(response_data));
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to update candidate-related data in the Onboaring page. <br>
    * Triggered: When user submits the form in Onboaring page. <br>
    * Last Updated Date: August 22, 2022
    * @function
    * @memberof CandidateActionApi
    * @author Jovic, Updated by: Erick, Fitz, CE
    */
    updateOnboardingDetails = function updateOnboardingDetails(form_values){
        return async dispatch => {
            return await CandidateService.updateOnboardingDetails(form_values).then((response_data) => {
                switch(form_values.current_page_id){
                    case ONBOARDING_PAGE_ID.candidate_information:
                        (response_data.status) ? dispatch(successCandidateInformation(response_data)) : dispatch(errorCandidateInformation(response_data));
                        break;
                    case ONBOARDING_PAGE_ID.background:
                        (response_data.status) ? dispatch(addBackground(response_data)) : dispatch(errorBackground(response_data));
                        break;
                    case ONBOARDING_PAGE_ID.more_about_you:
                        if(!response_data.status){
                            alert(response_data.message);
                        }
                        break;
                }

                /* Check If have redirect_url THEN direct the user either "/sign-out" or "/profile-information" */
                if(response_data.result?.redirect_url){
                    window.location.href = response_data.result.redirect_url;
                }
            }, 
            (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to update candidate-related data in the Candidate Profile page. <br>
    * Triggered: When user submits the form in Candidate Profile page. <br>
    * Last Updated Date: August 18, 2022
    * @function
    * @memberof CandidateActionApi
    * @author Jovic, Updated by: Erick
    */
    updateCandidateProfileDetails = function updateCandidateProfileDetails(form_values){
        return async dispatch => {
            return await CandidateService.updateCandidateProfileDetails(form_values).then((response_data) => {
                (response_data.status) ? dispatch(successUpdateCandidateProfile(response_data)) : dispatch(errorUpdateCandidateProfile(response_data));
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to get current user's candidate profile. <br>
    * Triggered: When current user enters profile-information page <br>
    * Last Updated Date: August 8, 2022
    * @function
    * @memberof CandidateActionApi
    * @author Fitz
    */
    getProfile = function getProfile(){
        return async dispatch => {
            return await CandidateService.getProfile().then((response_data) => {
                if(response_data.status){
                    dispatch(setSuccessCandidateProfile(response_data.result));
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to update user headshot. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 25, 2022
    * @function
    * @memberof
    * @author Adrian
    */
    uploadHeadshot = function uploadHeadshot(params){
        return dispatch => {
            return CandidateService.uploadHeadshot(params).then((response_data) => {
                if(response_data.status){
                    /* TODO: Add identitywgat reducer should be updated (candidate)*/
                    dispatch(successUploadHeadshotUser(response_data));
                    dispatch(successUploadHeadshotProfileInformationPage(response_data));
                }
                }, (error_response) => {
                    console.log(error_response);
                    dispatch(errorUploadHeadshotUser(error_response));
            });
        };
    }

    /**
    * DOCU: Function to update user resume. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 18, 2022
    * @function
    * @memberof
    * @author Adrian
    */
    uploadResume = function uploadResume(params){
        return dispatch => {
            return CandidateService.uploadResume(params).then((response_data) => {
                if(response_data.status){
                    /* TODO: add identifier what reducer should be updated (candidate) */
                    dispatch(successUploadResumeUser(response_data));
                    dispatch(successUploadResumeProfileInformationPage(response_data));
                }
                }, (error_response) => {
                    console.log(error_response);
                    dispatch(errorUploadResumeUser(error_response));
            });
        };
    }

    /**
    * DOCU: Function to update user resume. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 11, 2022
    * @function
    * @memberof
    * @author Adrian
    */
    updateResumeLinks = function updateResumeLinks(params){
        return dispatch => {
            return CandidateService.updateResumeLinks(params).then((response_data) => {
                if(response_data.status){
                    /* TODO: add identifier what reducer should be updated (candidate) */
                    dispatch(successUpdateResumeLinks(response_data));
                    dispatch(successUpdateResumeLinksProfile(response_data));
                }
                }, (error_response) => {
                    console.log(error_response);
                    dispatch(errorUpdateResumeLinks(error_response));
            });
        };
    }
}

/**
* @exports CandidateActions
* @type {object} UserActionApi Instance
* @const
* Last Updated Date: August 1, 2022
*/
export const CandidateActions = new CandidateActionApi();