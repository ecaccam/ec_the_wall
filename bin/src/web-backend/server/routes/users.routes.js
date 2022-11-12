import { Router }        	from "express";
import regeneratorRuntime from "regenerator-runtime";

/* Imports for controllers */
import UsersController from "../controllers/users.controller";

/**
* Express router to mount users related functions on.
* @type {object}
* @const
* @namespace UserRoute
*/
const UserRoute = Router();

/**
* DOCU: Route to login user. <br>
* When user submits the login form. <br>
* Triggered by sign_in.jsx - onSubmit <br>
* Last updated at: July 28, 2022
* @function
* @memberof module:routes/users~UserRoute
* @author Erick
*/
UserRoute.post("/login", UsersController.loginUser);

/**
* DOCU: Route to register user. <br>
* When user submits the register form. <br>
* Triggered by sign_up.jsx - onSubmit <br>
* Last updated at: July 28, 2022
* @function
* @memberof module:routes/users~UserRoute
* @author Erick
*/
UserRoute.post("/register", UsersController.createUser);

/**
* DOCU: Route to check current user. <br>
* When user submits the register form. <br>
* Triggered by sign_in.jsx - onLoad and sign_up.jsx - onLoad  <br>
* Last updated at: August 1, 2022
* @function
* @memberof module:routes/users~UserRoute
* @author Erick
*/
UserRoute.post("/check_current_user", UsersController.checkCurrentUser);
/** DOCU: Route to check current user. <br>
* When user submits the register form. <br>
* Triggered by logout.jsx - onLoad  <br>
* Last updated at: August 1, 2022
* @function
* @memberof module:routes/users~UserRoute
* @author Erick
*/
UserRoute.post("/logout", UsersController.logoutUser);
/**
* DOCU: Route options allowed for user route. <br>
* Triggered on every user route. <br>
* Last updated at: August 4, 2022
* @function
* @memberof module:routes/options~UserRoute
* @author Erick
*/
UserRoute.options("*", function(req, res, next){
	next();
});

module.exports = UserRoute;