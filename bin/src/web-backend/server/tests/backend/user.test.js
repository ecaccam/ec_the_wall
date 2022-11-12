import regeneratorRuntime from "regenerator-runtime";
import { assert, expect, should as Should } from "chai";

/* Constants */
import { CURRENT_PAGE }               from "../../config/constants";
import { BOOLEAN_FIELD, USER_LEVELS } from "../../config/constants/shared.constants";

/* Models */
import { format as mysqlFormat } from "mysql";
import DatabaseModel from "../../models/database-query-model/lib/database.model.js";
import UserModel from "../../models/users.model";

const databaseModel = new DatabaseModel();
const userModel     = new UserModel();

/**
* DOCU: Unit test for Users features (Signin / Signup / Logout) <br>
* Triggered by: Use the run command below. <br>
* Last Updated Date: August 2, 2022
* @async
* @function
* @memberOf UserTestCases    
* @author Erick
*/
describe('User Features - Signin / Signup / Logout', function(){
    let new_email   = "";
    let new_user_id = "";

    /* Red */
    it("Should not be able to signup user because of missing parameters.", async function(){
        let user_data = await userModel.createUserRecord({ email: "test@gmail.com" });
        
        expect(user_data.status).to.equal(false);
        expect(user_data.message).to.equal("Missing required fields.");
    });    

    /* Green */
    it("Should be able to signup user.", async function(){
        let random_user_id = Math.floor(Math.random() * 10000);

        let user_data = await userModel.createUserRecord({ 
            first_name: `FN Test ${random_user_id}`, 
            last_name: `LN Test ${random_user_id}`, 
            email: `test${random_user_id}@gmail.com`,
            password: "123123"
        });

        new_email = `test${random_user_id}@gmail.com`;

        expect(user_data.status).to.equal(true);
    });    

    /* Red */
    it("Should not be able to signin user because of missing parameters.", async function(){
        let user_data = await userModel.authenticateUser({ email: new_email });

        expect(user_data.status).to.equal(false);
        expect(user_data.message).to.equal("Please enter a valid email address and password.");
    });    

    /* Red */
    it("Should not be able to signin user because of wrong password.", async function(){
        let user_data = await userModel.authenticateUser({ email: new_email, password: "12223123" });

        expect(user_data.status).to.equal(false);
        expect(user_data.message).to.equal("The email or password you entered is incorrect.");
    });    

    /* Green */
    it("Should not be able to signin admin.", async function(){
        let check_user_data = await userModel.getUserData({ email: new_email }, "id");

        /* Update user_level_id to be admin in users table. */
        (check_user_data.status) && await userModel.updateUserRecord({ user_level_id: '?' }, [USER_LEVELS.admin, check_user_data.result.id]);
        

        let user_data = await userModel.authenticateUser({ email: new_email, password: "123123" });
        
        expect(user_data.status).to.equal(true);
        expect(user_data.result.redirect_url).to.equal("/candidate-management");

        /* Revert back to user_level_id to candidate again. */
        await userModel.updateUserRecord({ user_level_id: '?' }, [USER_LEVELS.candidate, check_user_data.result.id]);
    });   

    /* Green */
    it("Should be able to signin candidate.", async function(){
        let user_data = await userModel.authenticateUser({ email: new_email, password: "123123" });
        
        expect(user_data.status).to.equal(true);
        expect(user_data.result.redirect_url).to.equal("/onboarding");

        /* Delete record after success Unit test. */
        let delete_user_data = await userModel.getUserData({ email: new_email }, "id");
        
        if(delete_user_data.status){
            await databaseModel.executeQuery("User Test | delete_candidate_record", mysqlFormat(`DELETE FROM candidates WHERE user_id = ?;`, delete_user_data.result.id));
            await databaseModel.executeQuery("User Test | delete_user_record", mysqlFormat(`DELETE FROM users WHERE id = ?;`, delete_user_data.result.id));
        }
    });   
});

after(() => {
    /* close DB connection */
});

/* Run using:  
   NODE_ENV=development && ./node_modules/.bin/mocha -r @babel/register -r regenerator-runtime/runtime server/tests/backend/user.test.js
*/