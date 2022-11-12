import {APIConstants} from '../__config/constants';

import { FetchApiClass } from './lib/fetch.api';
import { handleAPIResponse }  from "../__helpers/index";

/** 
* @class 
* All method here are related to Users API. <br>
* Last Updated Date: August 1, 2022
* @extends FetchApiClass
*/
class UserServiceApi extends FetchApiClass{
    /**
    * Default constructor.
    */
    constructor() {
        super();
    }

    /**
    * DOCU: Function to login on the login page. <br>
    * Triggered: When user enters email address and password in the login page or autologin via API. <br>
    * Last Updated Date: August 1, 2022
    * @function
    * @memberof UserServiceApi
    * @author Erick
    */
    login = function login(email_address, password) {
        let userService = this;
        return userService.sendRequest(`${APIConstants.URL}/users/login`, { email_address, password })
        .then(handleAPIResponse)
        .then((user_response) => {
            return user_response;
        });
    }

    /**
    * DOCU: Function to register on the register page. <br>
    * Triggered: When user enters first name, last name, email address and password in the register page. <br>
    * Last Updated Date: August 1, 2022
    * @function
    * @memberof UserServiceApi
    * @author Erick
    */
    register = function register(params) {
        let userService = this;
        return userService.sendRequest(`${APIConstants.URL}/users/register`, params)
        .then(handleAPIResponse)
        .then((user_response) => {
            return user_response;
        });
    }

    /**
    * DOCU: Function to check if user is currently loggedin. <br>
    * Triggered: When user loads sign in or sign up page. <br>
    * Last Updated Date: August 1, 2022
    * @function
    * @memberof UserServiceApi
    * @author Erick
    */
     checkCurrentUser = function checkCurrentUser() {
        let userService = this;
        return userService.sendRequest(`${APIConstants.URL}/users/check_current_user`, {}, true)
        .then(handleAPIResponse)
        .then((user_response) => {
            return user_response;
        });
    }

    /**
    * DOCU: Function to logout user. <br>
    * Triggered: When user clicks on logout button. <br>
    * Last Updated Date: August 9, 2022
    * @function
    * @memberof UserServiceApi
    * @author Erick
    */
    logout = function logout() {
        let userService = this;
        return userService.sendRequest(`${APIConstants.URL}/users/logout`, {}, true)
        .then(handleAPIResponse)
        .then((user_response) => {
            return user_response;
        });
    }
}
/**
* @exports UserService
* @type {object} UserServiceApi Instance
* @const
* Last Updated Date: August 1, 2022
*/
export const UserService = new UserServiceApi();