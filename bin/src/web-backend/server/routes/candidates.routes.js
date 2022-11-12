import { Router }        	from "express";
import regeneratorRuntime from "regenerator-runtime";

/* Imports for controllers */
import CandidateController from "../controllers/candidates.controller";
import multer from "multer"

const upload = multer({dest: "uploads/"})
/**
* Express router to mount users related functions on.
* @type {object}
* @const
* @namespace CandidateRoute
*/
const CandidateRoute = Router();

/**
* DOCU: Route to get candidate profile. <br>
* When candidate goes to profile-information page. <br>
* Triggered by profile.jsx - onLoad <br>
* Last updated at: August 11, 2022
* @function
* @memberof module:routes/candidate~CandidateRoute
* @author Fitz, Updated by: Jovic
*/
CandidateRoute.post("/get_onboarding", CandidateController.getCandidateProfile);
CandidateRoute.post("/save_onboarding", CandidateController.updateOnboarding);
CandidateRoute.post("/back_onboarding", CandidateController.backOnboarding);
CandidateRoute.post("/profile", CandidateController.getCandidateProfile);
CandidateRoute.post("/update_profile", CandidateController.updateCandidateProfile);

/**
* DOCU: Route to update user headshot. <br>
* When user uploads a headshot in onboarding page or resume and links page. <br>
* Triggered by  - onLoad  <br>
* Last updated at: August 15, 2022
* @function
* @memberof  module:routes/candidate~CandidateRoute
* @author Adrian
*/
CandidateRoute.post("/upload_headshot", upload.single('profile_headshot'), CandidateController.uploadHeadshot);

/**
* DOCU: Route to update user headshot. <br>
* When user uploads a resume in onboarding page or resume and links page. <br>
* Triggered by  - onLoad  <br>
* Last updated at: August 15, 2022
* @function
* @memberof  module:routes/candidate~CandidateRoute
* @author Adrian
*/
CandidateRoute.post("/upload_resume", upload.single('user_resume'), CandidateController.uploadResume);

/**
* DOCU: Route to update user relevant_links. <br>
* When user adds or removes a relevant_urls in onboarding page or resume and links page. <br>
* Triggered by  - onLoad  <br>
* Last updated at: August 15, 2022
* @function
* @memberof  module:routes/candidate~CandidateRoute
* @author Adrian
*/
CandidateRoute.post("/update_candidate_links", CandidateController.updateCandidateLinks);

module.exports = CandidateRoute;