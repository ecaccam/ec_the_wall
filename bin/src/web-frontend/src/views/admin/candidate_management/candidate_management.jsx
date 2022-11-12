import React from 'react';
import AdminSideBar from '../global/components/admin_sidebar/admin_sidebar';
import AdminNavigationMenu from '../global/components/admin_navigation_menu/admin_navigation_menu';
import CandidateList from './components/candidate_list/candidate_list';

/* CSS */
import "./candidate_management.scss";

function CandidateManagement(props) {
    return (
        <div id="candidate_information_wrapper">
            <AdminNavigationMenu></AdminNavigationMenu>

            <div id="candidate_information_content">
                <AdminSideBar active={ "candidate_information" }></AdminSideBar>
                <CandidateList></CandidateList>
            </div>
        </div>
    );
}

export default CandidateManagement;