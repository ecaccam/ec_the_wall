import { createSlice } from '@reduxjs/toolkit';
import Moment from "moment"

export const candidateProfileManagement = createSlice({
    name: "candidate_list",
    initialState: {
        candidate_list_data: [],
    },
    reducers: {
        updateSelectedCandidateProfileData: (state, action) => {
            localStorage.setItem("candidate_list_data", JSON.stringify(action.payload));
            action.payload.map(option_item => {
                option_item.candidate_information.start_date = Moment(option_item.candidate_information.start_date).format();
                option_item.education.graduate_date = Moment(option_item.education.graduate_date).format();
            });

            state.candidate_list_data = action.payload;
        },
        successSearchCandidates: (state, action) => {
            state.candidate_list_data = action.payload.result;
        }
    },
})

export const { updateSelectedCandidateProfileData, successSearchCandidates } = candidateProfileManagement.actions;
export default candidateProfileManagement.reducer;