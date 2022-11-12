import { configureStore } from "@reduxjs/toolkit";
import userManagementReducer from "../__reducers/users.reducer";
import candidateManagementReducer from "../__reducers/candidate.reducer";
import candidateProfileManagement from "../__reducers/candidate_profile_information.reducer"
import candidateList from "../__reducers/candidate_list.reducer"

export const store = configureStore({
    reducer: {
        users: userManagementReducer,
        candidate: candidateManagementReducer,
        candidate_profile: candidateProfileManagement,
        candidate_list: candidateList,
    },
});