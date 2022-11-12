import {APIConstants} from '../__config/constants';

import { FetchApiClass } from './lib/fetch.api';
import { handleAPIResponse }  from "../__helpers/index";


class AdminServiceApi extends FetchApiClass{
    /**
    * Default constructor.
    */
    constructor() {
        super();
    }

    /**
    * DOCU: Function to export candidate list in candidate management page. <br>
    * Triggered: When user clicks on EXPORT TO .XLS button <br>
    * Last Updated Date: August 18, 2022
    * @function
    * @memberof AdminServiceApi
    * @author Erick
    */
    exportCandidateList = function exportCandidateList(params) {
        return this.sendRequest(`${APIConstants.URL}/admins/export_candidate_lists`, params, true)
        .then((response) => response.blob())
        .then((blob) => {
            /* Create blob link to download */
            const url = window.URL.createObjectURL(new Blob([blob]),);
            const link = document.createElement('a');
            link.href = url;

            /* Format filename datestamp */
            let Moment = require("moment");
            link.setAttribute('download',`candidate-lists-export(${Moment().format("MMDDYYYY")}).csv`,);

            /* Simulate download */
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        });
    }

    /**
    * DOCU: Function to export candidate list in candidate management page. <br>
    * Triggered: When admin loads candidate management page or admin searches candidates<br>
    * Last Updated Date: August 18, 2022
    * @function
    * @memberof AdminServiceApi
    * @author Adrian
    */
    searchCandidates = function exportCandidateList(params) {
        return this.sendRequest(`${APIConstants.URL}/admins/search_candidates`, params, true)
            .then(handleAPIResponse)
            .then((user_response) => {
                return user_response;
        });
    }
}

/**
* @exports AdminService
* @type {object} AdminServiceApi Instance
* @const
* Last Updated Date: August 11, 2022
*/
export const AdminService = new AdminServiceApi();