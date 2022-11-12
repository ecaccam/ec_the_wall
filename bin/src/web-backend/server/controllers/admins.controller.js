

/* HACK: fix for babel issue with async functions */
import regeneratorRuntime from "regenerator-runtime";
import Passport           from 'passport';
import Base64Url 		  from "base64-url";
import jwt 				  from "jsonwebtoken";
import { AsyncParser }    from 'json2csv';

/* Imports for helpers */
import { checkFields } from "../helpers/index.js";
import SessionHelper   from "../helpers/session.helper";

/* Imports for models */
import UserModel        from "../models/users.model.js";
import CandidatesModel  from "../models/candidates.model";


/**
* @class
* This controller is being called from the admins.routes.js <br>
* All method here are related to admin feature. <br>
* Last Updated Date: August 16, 2022
*/
class AdminController {
    /**
    * Default constructor.
    */
    constructor(){

    }

    /**
    * DOCU: Function for exporting candidate list. <br>
    * Triggered by api/admins.routes/export_candidate_lists <br>
    * Last updated at: August 11, 2022
    * @async
    * @function
    * @memberOf AdminController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Erick
    */
    exportCandidateList = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields = checkFields(["is_export"], ["search_keyword", "sort_order"], req);
            
            if(check_fields.status){
                let candidatesModel = new CandidatesModel();
                let export_candidate_list = await candidatesModel.getCandidates({...check_fields.result.sanitized_data});

                /* This will serve as the Column Headers */
                const fields = [
                    { label: 'Name', value: 'full_name' },
                    { label: 'Email Address', value: 'email' },
                    { label: 'Geographic Location ', value: 'cand_location' },
                    { label: 'Graduation Date', value: 'cd_graduated_at' },
                    { label: 'Technical Skills', value: 'technical_skills' },
                    { label: 'Experience Level', value: 'experience_level' }
                ];

                let candidate_list_csv = '';
                const asyncParser = new AsyncParser({ fields }, { highWaterMark: 8192 });

                asyncParser.processor
                    .on('data', chunk => (candidate_list_csv += chunk.toString()))
                    .on('end', () => {res.send(candidate_list_csv)})
                    .on('error', err => { throw Error(err) });
                
                /* Data to be populate in the csv file. */
                asyncParser.input.push(JSON.stringify(export_candidate_list.result));
                asyncParser.input.push(null); 
                
                response_data.status = true;
            }
            else{
                response_data.message = "Missing required fields.";
            }
        }
        catch(error){
            response_data.error = error;
        }
    }

    /**
    * DOCU: Function for Searching candidates list. <br>
    * Triggered by api/admins.routes/searchCandidates <br>
    * Last updated at: August 18, 2022
    * @async
    * @function
    * @memberOf AdminController
    * @returns response_data - { status: true/false, result: {}, error, message }
    * @author Adrian, Updated by: Erick
    */
    searchCandidates = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let candidatesModel = new CandidatesModel();
            response_data = await candidatesModel.getCandidates(req.body);

        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }
}

export default (function user(){
    return new AdminController();
})();