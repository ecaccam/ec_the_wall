import { UserService } from '../__services/user.services';
import { getUserDetailsFromToken, clearUserSessionData } from '../__helpers/index';

import { successLoginUser, errorLoginUser, successRegisterUser, errorRegisterUser } from '../__reducers/users.reducer';
/**
* @class
* All methods here are related to user actions on various places in the app. <br>
* Last Updated Date: August 1, 2022
*/
class UserActionApi{
    /**
    * Default constructor.
    */
    constructor() { }

    /**
    * DOCU: Function to login on the login page. <br>
    * Triggered: When user enters email address and password in the login page. <br>
    * Last Updated Date: August 1, 2022
    * @function
    * @memberof UserActionApi
    * @param {string} email - Email input
    * @param {string} password - Password input
    * @author Erick
    */
    login = function login(email, password) {
        return dispatch => {
            return UserService.login(email, password).then((response_data) => {
                if(response_data.auth === true){
                    /* store jwt token on local storage */        
                    localStorage.setItem('JWT88', response_data.token);
                    localStorage.setItem('__BarioOtsoOtso__', response_data.user_token);

                    /* Get session data from token */ 
                    let get_user_details = getUserDetailsFromToken();
                    
                    if(get_user_details.status){
                        dispatch(successLoginUser(get_user_details.user_details));
                        window.location.href = get_user_details.user_details.redirect_url;
                    }
                }
                else{
                    dispatch(errorLoginUser(response_data));
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to register on the register page. <br>
    * Triggered: When user enters first name, last name, email address and password in the register page. <br>
    * Last Updated Date: August 1, 2022
    * @function
    * @memberof UserActionApi
    * @param {object} params - (first name, last name, email address and password)
    * @author Erick
    */
    register = function register(params){
        return dispatch => {
            return UserService.register(params).then((response_data) => {
                if(response_data.status){
                    dispatch(successRegisterUser(response_data));
                    window.location.href = "/sign-in";
                }
                else{
                    dispatch(errorRegisterUser(response_data));
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to check if user is currently loggedin. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 1, 2022
    * @function
    * @memberof UserActionApi
    * @author Erick
    */
     checkCurrentUser = function checkCurrentUser(){
        return dispatch => {
            return UserService.checkCurrentUser().then((response_data) => {
                if(response_data.status){
                    window.location.href = response_data.result.redirect_url;
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to logout user. <br>
    * Triggered: When user clicks on logout button. <br>
    * Last Updated Date: August 9, 2022
    * @function
    * @memberof UserActionApi
    * @author Erick
    */
    logout = function logout(){
        return dispatch => {
            return UserService.logout().then((response_data) => {
                if(response_data.status){
                    window.location.href = "/sign-in";
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }
}

/** 
* @exports UserActions
* @type {object} UserActionApi Instance
* @const
* Last Updated Date: August 1, 2022
*/
export const UserActions = new UserActionApi();