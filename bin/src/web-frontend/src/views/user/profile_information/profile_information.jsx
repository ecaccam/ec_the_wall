/* REACT */
import React from 'react';

/* CSS */
import "./profile_information.scss";

/* COMPONENTS */
import CandidateProfile from '../../global/components/candidate_profile/candidate_profile';
import UserSideBar from '../global/components/user_sidebar/user_sidebar';
import UserNavigationMenu from '../global/components/user_navigation_menu/user_navigation_menu';

function ProfileInformation(props) {
    return (
        <div id="profile_information_wrapper">
            <UserNavigationMenu></UserNavigationMenu>

            <div id="profile_information_content">
                <UserSideBar active={ "profile_information" }></UserSideBar>
                <CandidateProfile></CandidateProfile>
            </div>
        </div>
    );
}

export default ProfileInformation;