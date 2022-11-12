import jwt from 'jwt-decode';


/*  DOCU: handle http response from API
    Owner: Noah */
    export const  handleAPIResponse = (response) => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    data.is_logout = data.is_logout;
                }

                const error = data && data.message || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
    }
    
/*  DOCU: GET USER DETAILS FROM JWT TOKEN
    DECODE JWT TOKEN TO FETCH USER DETAILS
    Owner: Noah */
    export const getUserDetailsFromToken = () => {
        let v88token = localStorage.getItem("JWT88") || null;
        let userToken = localStorage.getItem("__BarioOtsoOtso__") || null;
        
        try{
            if(v88token !== null && userToken !== null){
                let user_details = jwt(userToken);
                return {status: true, user_details};
            }
            else{
                throw new Error("User not logged in!")
            }
        }
        catch(error){
            return {status: false, error: error};
        }    
    }

/*  DOCU: LOGOUT CURRENT USER
    Owner: Noah */
    export const clearUserSessionData = () => {
        // UserService.logout().then((reset_password_response) => {             
        //     cleanupSessionLocalStorage();

        // }, (error_response) => {      
        //     cleanupSessionLocalStorage();         
        // });
    }
    
/*  DOCU: Clear local storage if not logg
    Owner: Jerwin */
    export const cleanupSessionLocalStorage = () => {
        localStorage.removeItem('JWT88');
        localStorage.removeItem('__BarioOtsoOtso__');

        /* Resets browser and redirect to sign_in page */
        window.location.href = "/sign_in"; 
    }

    /**
    * DOCU: This will handle the rendering the selected dropdown data. <br>
    * Triggered: candidate_information.jsx <br>
    * Last Updated Date: August 11, 2022
    * @param {object} object_dropdown_data - To get the selected dropdown id and dropdown list.
    * @param {object} selectedDropdownFunction - To get the selected dropdown useState.
    * @author Ruelito
    */
    export const filterSelectedDropdownData = (object_dropdown_data, selectedDropdownFunction) => {
        // /* Get the object data from object_dropdown_data parameter. */
        let {dropdown_id, dropdown_list, is_country} = object_dropdown_data;
        let {dropdown_function, dropdown_data} = selectedDropdownFunction;

        /* Filter the selected dropdown data. */
        if(dropdown_list){
            let fetch_data = dropdown_list.filter(option => dropdown_id === ((is_country) ? option.id : option.value));
            return (fetch_data.length > 0) && dropdown_function(fetch_data);
        }
    }

    /**
    * DOCU: This will handle the selected dropdown on changed. <br>
    * Triggered: candidate_information.jsx <br>
    * Last Updated Date: August 11, 2022
    * @param {object} selected_dropdown_data - To get the selected dropdown data.
    * @param {object} dropdown_state_data - To get the dropdown state hook.
    * @author Ruelito
    */
    export const onChangeSelectedDropdown = (selected_dropdown_data, dropdown_state_data) => {
        let { dropdown_data, dropDropdownFunctionState } = dropdown_state_data;
        
        (selected_dropdown_data.length > 0) ? dropDropdownFunctionState(selected_dropdown_data) : dropDropdownFunctionState("");
    }

    /**
    * DOCU: This will handle the removing selected dropdown data. <br>
    * Triggered: candidate_information.jsx <br>
    * Last Updated Date: August 11, 2022
    * @param {object} selected_dropdown_data - To get the selected dropdown data.
    * @param {object} dropdown_state_data - To get the dropdown state hook.
    * @author Ruelito
    */
    export const removeSelectedItem = (selected_dropdown_data, dropdown_state_data) => {
        let { dropdown_data, dropDropdownFunctionState } = dropdown_state_data;
        let new_selected_item = (dropdown_data.length > 1) ? dropdown_data.filter(program_item => { return program_item.label !==  selected_dropdown_data.label }) : "";

        dropDropdownFunctionState(new_selected_item);
    }

    /**
    * DOCU: This will handle the selected radio input data. <br>
    * Triggered: candidate_information.jsx <br>
    * Last Updated Date: August 11, 2022
    * @param {object} selected_radio_item - To get the selected radio input data.
    * @param {object} state_hook_data - To get the radio input state hook.
    * @author Ruelito
    */
    export const selectRadioItem = (selected_radio_name, selected_radio_data, state_hook_data) => {
        let { radio_data, radioFunctionState } = state_hook_data;

        radioFunctionState(selected_radio_data.target.value);
    }

    /**
    * DOCU: This will handle the rendering of relevant urls. <br>
    * Triggered: candidate_information.jsx <br>
    * Last Updated Date: August 11, 2022
    * @param {object} relevant_urls - To get the relevant url list.
    * @param {object} state_hook_data - To get the radio input state hook.
    * @author Ruelito
    */
    export const renderRelevantUrls = (relevant_urls, state_hook_data) => {
        let { portfolio_link, setPortfolioLink } = state_hook_data;

        if((relevant_urls) && relevant_urls.length > 0){
            let new_relevant_urls_data = [];

            relevant_urls.map(item_url_data => {
                return(
                    new_relevant_urls_data.push({
                        item_url: item_url_data
                    })
                )
            });

            setPortfolioLink(new_relevant_urls_data);
        }
    }

    /**
    * DOCU: This will handle the selected dropdown on changed. <br>
    * Triggered: candidate_information.jsx <br>
    * Last Updated Date: August 12, 2022
    * @param {object} selected_dropdown_data - To get the selected dropdown data.
    * @param {object} state_hook_data - To get the radio input state hook.
    * @author Ruelito
    */
    export const renderMultipleDropdownValue = (selected_dropdown_data, state_hook_data) => {
        let { dropdown_selected_list, dropdown_list } = selected_dropdown_data;
        let { dropdownData, dropdownFunctionState } = state_hook_data;
        let current_desired_job_list_data = JSON.parse(dropdown_selected_list);
        let get_selected_desired_job_list_data = [];

        /* To get the data of selected dropdown item. */
        current_desired_job_list_data && current_desired_job_list_data.map(desired_job_id => {
            return get_selected_desired_job_list_data.push(...dropdown_list.filter(role_item => role_item.value === desired_job_id));
        });

        (get_selected_desired_job_list_data.length > 0) && dropdownFunctionState(get_selected_desired_job_list_data);
    }