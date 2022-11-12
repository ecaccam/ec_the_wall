/** 
* @class 
* All method here are related to Fetch API. <br>
* Last Updated Date: April 16, 2021
*/
export class FetchApiClass {
    /**
    * Default constructor.
    */
    constructor () {
        this.api_header =  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ }),
            mode: 'cors',
            credentials: 'include'
        }
    }

    /**
    * DOCU: Function to send request to backend API via Fetch. <br>
    * Triggered: Being used by all Services. <br>
    * Last Updated Date: April 16, 2021
    * @function
    * @memberof FetchApiClass
    * @param {string} url - Requires the API Url
    * @param {object=} params={} - Optional params to be  sent
    * @param {boolean=} is_logged_in=false - Optional
    * @param {boolean=} is_upload=false - Optional
    * @param {Promise} promise_object - returns the fetch' promise object
    * @author Noah
    */
    sendRequest = (url, params={}, is_logged_in = false, is_upload = false) => {
        this.api_header.headers = is_upload === false ? { 'Content-Type': 'application/json' } : {};   
        this.api_header.body    = is_upload === false ? JSON.stringify(params) : params;   

        if(is_logged_in === true){
            this.api_header.headers["Authorization"] = `Bearer ${localStorage.getItem("JWT88")}`;
        }


        return fetch(`${url}`, this.api_header);
    }
}