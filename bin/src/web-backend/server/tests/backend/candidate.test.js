import regeneratorRuntime from "regenerator-runtime";
import { assert, expect, should as Should } from "chai";

/* Constants */
import { CURRENT_PAGE, CANDIDATE_PROFILE_UPDATE_TYPE } from "../../config/constants";
import { BOOLEAN_FIELD, USER_LEVELS, US_COUNTRY_ID } from "../../config/constants/shared.constants";

/* Models */
import { format as mysqlFormat } from "mysql";
import DatabaseModel from "../../models/database-query-model/lib/database.model.js";
import CandidateModel from "../../models/candidates.model";

const databaseModel  = new DatabaseModel();
const candidateModel = new CandidateModel();

/**
* DOCU: Unit test for Candidate features (Onboarding / Candidate Profile Page) <br>
* Triggered by: Use the run command below. <br>
* Last Updated Date: August 24, 2022
* @async
* @function
* @memberOf CandidateTestCases    
* @author Erick, Updated by: Jovic
*/
describe('Candidate Features - Onboarding Page', function(){
    /* Onboarding Page 1 - Candidate Information */
    /* Red */
    it("Should not be able to load Onboarding Page 1 because candidate_id cannot be find in database.", async function(){
        let candidate_data = await candidateModel.getCandidateProfileDetails({user_id: 0, current_page_id: CURRENT_PAGE.cand_information});

        expect(candidate_data.status).to.equal(false);
    });

    /* Green */
    it("Should be able to load Onboarding Page 1.", async function(){
        let candidate_data = await candidateModel.getCandidateProfileDetails({user_id: 26, current_page_id: CURRENT_PAGE.cand_information});

        expect(candidate_data.status).to.equal(true);
    });

    /* Red */
    it("Should not be able to update Onboarding Page 1 because of missing parameters.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({ user_id: 26, first_name: "Jovic", last_name: "Abengona", email: "jabengona@village88.com" });

        expect(candidate_data.status).to.equal(false);
    });

    /* Red */
    it("Should not be able to update Onboarding Page 1 because of email already exists.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({
            current_page_id: CURRENT_PAGE.cand_information,
            candidate_id: 26,
            user_id: 26,
            first_name: "Jovic", 
            last_name: "Abengona", 
            email: "johndoe@gmail.com",
            country_list: US_COUNTRY_ID,
            zip_code: 90210,
            current_desired_job_list: [1,2,3],
            stage_job_search_list: 2
        });

        expect(candidate_data.status).to.equal(false);
        expect(candidate_data.error).to.equal("email_err");
    });

    /* Red */
    it("Should not be able to update Onboarding Page 1 because of invalid zip code.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({
            current_page_id: CURRENT_PAGE.cand_information,
            candidate_id: 26,
            user_id: 26,
            first_name: "Jovic", 
            last_name: "Abengona", 
            email: "jabengona@village88.com",
            country_list: US_COUNTRY_ID,
            zip_code: 999999,
            current_desired_job_list: [1,2,3],
            stage_job_search_list: 2
        });

        expect(candidate_data.status).to.equal(false);
        expect(candidate_data.error).to.equal("zipcode_err");
    });

    /* Green */
    it("Should be able to update Onboarding Page 1 and proceed to next page.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({
            current_page_id: CURRENT_PAGE.cand_information,
            candidate_id: 26,
            user_id: 26,
            first_name: "Jovic", 
            last_name: "Abengona", 
            email: "jabengona@village88.com",
            country_list: US_COUNTRY_ID,
            zip_code: 90210,
            current_desired_job_list: [1,2,3],
            stage_job_search_list: 2,
            set_available_start_date: new Date(),
            open_relocation_checkbox: '0',
            open_contract_checkbox: '1',
            short_bio: 'Lorem ipsum dolor sit amet',
            security_clearance_list: '1',
            fetch_portfolio_links: ['sample_link_1', 'sample_link_2'],
            is_save_and_exit: false
        });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.current_page_id).to.equal(CURRENT_PAGE.background);
    });

    /* Green */
    it("Should be able to update Onboarding Page 1 and sign out candidate because save & exit is clicked.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({
            current_page_id: CURRENT_PAGE.cand_information,
            candidate_id: 26,
            user_id: 26,
            first_name: "Jovic", 
            last_name: "Abengona", 
            email: "jabengona@village88.com",
            country_list: US_COUNTRY_ID,
            zip_code: 90210,
            current_desired_job_list: [1,2,3],
            stage_job_search_list: 2,
            set_available_start_date: new Date(),
            open_relocation_checkbox: '0',
            open_contract_checkbox: '1',
            short_bio: 'Lorem ipsum dolor sit amet',
            security_clearance_list: '1',
            fetch_portfolio_links: ['sample_link_1', 'sample_link_2'],
            is_save_and_exit: true
        });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.is_save_and_exit).to.equal(true);
        expect(candidate_data.result.current_page_id).to.equal(CURRENT_PAGE.cand_information);
    });

    /* Onboarding Page 3 - More About You*/
    /* Red */
    it("Should not be able to load Onboarding Page 3 because candidate_id cannot be find in database.", async function(){
        let candidate_data = await candidateModel.getCandidateData({id: 0}, "vaccination_status_id, racial_group_ids, gender, is_veteran");

        expect(candidate_data.status).to.equal(false);
    });    

    /* Green */
    it("Should be able to load Onboarding Page 3.", async function(){
        let candidate_data = await candidateModel.getCandidateData({id: 1}, "vaccination_status_id, racial_group_ids, gender, is_veteran");

        expect(candidate_data.status).to.equal(true);
    });

    /* Red */
    it("Should not be able to update candidate info in Onboarding Page 3 because of missing parameters.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({ current_page_id: CURRENT_PAGE.more_about_you, candidate_id: 0 });

        expect(candidate_data.status).to.equal(false);
    });

    /* Green */
    it("Should be able to update candidate info in Onboarding Page 3.", async function(){
        let candidate_data = await candidateModel.updateOnboardingDetails({
            current_page_id: CURRENT_PAGE.more_about_you,
            candidate_id: 1,
            gender_identity: 1,
            is_save_and_exit: false,
            is_veteran: 0,
            racial_group: [1, 2],
            vaccination_status: 1,
        });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.current_page_id).to.equal(CURRENT_PAGE.cand_profile);
    });


    /* Red */
    it("Should not be able to update candidate profile - work experience because of missing parameters.", async function(){
        let candidate_data = await candidateModel.updateCandidateProfileDetails({
            update_type: CANDIDATE_PROFILE_UPDATE_TYPE.work_experience,
            years_experience: 1,
            authorize_work: 1,
            sponsorship_employment: 1
        });

        expect(candidate_data.status).to.equal(false);
    });

    /* Green */
    it("Should be able to update candidate profile - work experience.", async function(){
        let candidate_data = await candidateModel.updateCandidateProfileDetails({
            update_type: CANDIDATE_PROFILE_UPDATE_TYPE.work_experience,
            years_experience: 1,
            authorize_work: 1,
            sponsorship_employment: 1,
            candidate_id: 26
        });

        expect(candidate_data.status).to.equal(true);
    });

    /* Test case for updating candidate relevant_urls */
    /* Red test case */
    it("Should not be able the candidate relevant_urls when candidate_id is misisng", async () =>{
        let update_candidate_links = await candidateModel.updateCandidateRelevantLinks({
            relevant_urls: ['URL1@url.com', 'URL2@url.com'],
            candidate_id:  null
        });

        expect(update_candidate_links.status).to.equal(false);
    });

    it("Should not be able the candidate relevant_urls when relevant_url is misisng", async () =>{
        let update_candidate_links = await candidateModel.updateCandidateRelevantLinks({
            relevant_urls: undefined,
            candidate_id:  1
        });

        expect(update_candidate_links.status).to.equal(true);
    });

    /* Green test case */
    it("Should be able to update the relevant links.", async () =>{
        let update_candidate_links = await candidateModel.updateCandidateRelevantLinks({
            relevant_urls: ['URL1@url.com', 'URL2@url.com'],
            candidate_id:  1
        });

        expect(update_candidate_links.status).to.equal(true);
    });
});

after(() => {
    /* close DB connection */
});

/* Run using:  
   NODE_ENV=development && ./node_modules/.bin/mocha -r @babel/register -r regenerator-runtime/runtime server/tests/backend/candidate.test.js
*/