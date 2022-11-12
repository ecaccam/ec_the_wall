/* REACT */
import React from 'react';

/* COMPONENTS */
import UserSideBar from '../global/components/user_sidebar/user_sidebar';
import UserNavigationMenu from '../global/components/user_navigation_menu/user_navigation_menu';
import ResumeLinksContents from './components/resume_links_content';

/* CSS */
import "./resume_links.scss";

function ResumeLinks(props) {
    return (
        <div id="resume_links_wrapper">
            <UserNavigationMenu></UserNavigationMenu>

            <div id="resume_links_content">
                <UserSideBar active={ "resume_links" }></UserSideBar>
                <ResumeLinksContents></ResumeLinksContents>
            </div>
        </div>
    );
}

export default ResumeLinks;