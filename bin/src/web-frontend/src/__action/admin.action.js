import { AdminService } from "../__services/admin.services";

import { successSearchCandidates } from '../__reducers/candidate_list.reducer'

class AdminActionApi{
    /**
    * Default constructor.
    */
    constructor() { }

    /**
    * DOCU: Function to export candidate list in candidate management page. <br>
    * Triggered: When user clicks on EXPORT TO .XLS button <br>
    * Last Updated Date: August 11, 2022
    * @function
    * @memberof AdminActionApi
    * @author Erick
    */
    exportCandidateList = function exportCandidateList(params){
        return async dispatch => {
            return await AdminService.exportCandidateList(params).then((response_data) => {
                if(response_data.status === true){
                    
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }

    /**
    * DOCU: Function to export candidate list in candidate management page. <br>
    * Triggered: When admin loads candidate management page or searches candidatse in candidate management page <br>
    * Last Updated Date: August 18, 2022
    * @function
    * @memberof AdminActionApi
    * @author Adrian
    */
    searchCandidates = function searchCandidates(params){
        return async dispatch => {
            return await AdminService.searchCandidates(params).then((response_data) => {
                if(response_data.status === true){
                    dispatch(successSearchCandidates(response_data));
                }
            }, (error_response) => {
                console.log(error_response);
            });
        };
    }
}

/** 
* @exports AdminActions
* @type {object} AdminAction Instance
* @const
* Last Updated Date: August 11, 2022
*/
export const AdminActions = new AdminActionApi();