import regeneratorRuntime from "regenerator-runtime";
import { assert, expect, should as Should } from "chai";

/* Constants */
import { CURRENT_PAGE }               from "../../config/constants";
import { BOOLEAN_FIELD, USER_LEVELS } from "../../config/constants/shared.constants";

/* Models */
import { format as mysqlFormat } from "mysql";
import DatabaseModel from "../../models/database-query-model/lib/database.model.js";
import CandidateModel from "../../models/candidates.model";

const databaseModel  = new DatabaseModel();
const candidateModel = new CandidateModel();

/**
* DOCU: Unit test for Admin features (Candidate Management Page) <br>
* Triggered by: Use the run command below. <br>
* Last Updated Date: August 23, 2022
* @async
* @function
* @memberOf AdminTestCases    
* @author Erick, Updated by: CE
*/
describe('Admin Features - Candidate Management Page', function(){

    /* Green */
    it("Should be able export candidate list.", async function(){
        let candidate_data = await candidateModel.getCandidates({ is_export: true, sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
    });
    
    it("Should be able fetch candidate list without parameters.", async function(){
        let candidate_data = await candidateModel.getCandidates();

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able fetch candidate list Onload.", async function(){
        let candidate_data = await candidateModel.getCandidates({ is_export: false, sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able fetch candidate list without search keyword.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "", sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able fetch candidate list with first name search keyword.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "FN Test", sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able fetch candidate list with last name search keyword.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "LN Test 56", sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able fetch candidate list with email search keyword.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "test3442@gmail.com", sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able to fetch and sort candidates by Recently Added.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "", sort_order: 0 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able to fetch and sort candidates by Recently Updated.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "FN Test", sort_order: 1 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able to fetch and sort candidates by Alphabetical: A to Z.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "LN Test 56", sort_order: 2 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    it("Should be able to fetch and sort candidates by Alphabetical: Z to A.", async function(){
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "42@gmail.com", sort_order: 3 });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length).to.not.equal(0);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    /* Update test case once Pagination is done for page limit default */
    it("Should be able to fetch candidates with Limit.", async function(){
        let page_limit = 10;
        let candidate_data = await candidateModel.getCandidates({ search_keyword: "", sort_order: 0, page_limit });

        expect(candidate_data.status).to.equal(true);
        expect(candidate_data.result.length <= page_limit).to.equal(true);
        expect(candidate_data.error).to.equal(null);
        expect(candidate_data.message).to.equal(undefined);
    });

    /* TODO: Add test case for fetching candidates with Advanced Filters */
});

after(() => {
    /* close DB connection */
});

/* Run using:  
   NODE_ENV=development && ./node_modules/.bin/mocha -r @babel/register -r regenerator-runtime/runtime server/tests/backend/admin.test.js
*/