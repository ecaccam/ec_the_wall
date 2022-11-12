import { Router }         from "express";
import regeneratorRuntime from "regenerator-runtime";

/* Imports for controllers */
import AdminController from "../controllers/admins.controller";

/**
* Express router to mount admins related functions on.
* @type {object}
* @const
* @namespace AdminRoute
*/
const AdminRoute = Router();

/**
* DOCU: Route to export candidate list. <br>
* When user clicks on EXPORT TO .XLS button. <br>
* Triggered by candidate_list.jsx - exportCandidateList <br>
* Last updated at: August 11, 2022
* @function
* @memberof module:routes/admins~AdminRoute
* @author Erick
*/
AdminRoute.post("/export_candidate_lists", AdminController.exportCandidateList);

/**
* DOCU: Route to fetching candidates list. <br>
* When candidate management loads or when user puts text on search box. <br>
* Triggered by candidate_list.jsx - search_candidate <br>
* Last updated at: August 16, 2022
* @function
* @memberof module:routes/admins~AdminRoute
* @author Adrian
*/
AdminRoute.post("/search_candidates", AdminController.searchCandidates);

/**
* DOCU: Route options allowed for admin route. <br>
* Triggered on every admin route. <br>
* Last updated at: August 4, 2022
* @function
* @memberof module:routes/options~AdminRoute
* @author Erick
*/
AdminRoute.options("*", function(req, res, next){
	next();
});

module.exports = AdminRoute;