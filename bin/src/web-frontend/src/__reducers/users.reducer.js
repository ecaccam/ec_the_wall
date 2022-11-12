import { createSlice } from '@reduxjs/toolkit';
import { getUserDetailsFromToken } from '../__helpers/index';

var get_user_details = getUserDetailsFromToken();

export const userManagement = createSlice({
    name: "users",
    initialState: {
        user_data: (get_user_details.status) ? get_user_details.user_details : {},
        error_message: "",
    },
    reducers: {
        /* Success Login Request */
        successLoginUser: (state, action) => {
            state.user_data = action.payload;
        },
        /* Error Login Request */
        errorLoginUser: (state, action) => {
            state.error_message = action.payload?.message;
        },
        /* Success Register Request */
        successRegisterUser: (state, action) => {
            state.user_data = action.payload;
        },
        /* Error Register Request */
        errorRegisterUser: (state, action) => {
            state.error_message = action.payload.message;
        },

    },
})

export const { successLoginUser, errorLoginUser, successRegisterUser, errorRegisterUser } = userManagement.actions;
export default userManagement.reducer;