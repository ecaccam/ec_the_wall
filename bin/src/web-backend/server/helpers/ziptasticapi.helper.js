/** 
* @class 
* Handles the Ziptasticapi process. <br>
* Last Updated Date: August 11, 2021
*/
const Superagent = require('superagent');

class ziptasticapiHelper{
    /**
    * Default constructor.
    * @memberOf ziptasticapiHelper
    */
    constructor(){ 
        
    }

    /**
    * DOCU: This is will make a get request to ziptasticapi to fetch US State and City information based on provided zip code. <br>
    * Triggered: candidates.model/updateCandidateProfileDetails <br>
    * Last Updated Date: August 15, 2022
    * @param {string} zip_code
    * @returns {object} status, result, error
    * @author Jovic
    */
    processZiptasticapiData = async (zip_code) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let ziptasticapi_result = await Superagent.get(`https://ziptasticapi.com/${zip_code}`);

            /* Check if ziptasticapi_result successfull */
            if(ziptasticapi_result.statusCode === 200){
                response_data.status = true;
                response_data.result = JSON.parse(ziptasticapi_result.text);
            }
            else{
                throw Error("ERROR: Ziptasticapi connection problem");
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fech data via Ziptasticapi.";
        }

        return response_data;
    }
}

export default ziptasticapiHelper;