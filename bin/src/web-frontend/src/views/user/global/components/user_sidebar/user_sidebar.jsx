import React from 'react';
import { Link } from 'react-router-dom';

function UserSideBar({ active }) {
    return (
        <div className="sidebar">
            <ul>
                <li className={ (active === "profile_information") ? "active" : "" }><span className="sidebar_icon profile_icon"></span> <Link to="/profile-information">Profile</Link></li>
                <li className={ (active === "resume_links") ? "active" : "" }><span className="sidebar_icon resume_links_icon"></span> <Link to="/resume-links">Resume & Links</Link></li>
                <li><span className="sidebar_icon logout_icon"></span> <Link to="/sign-out">Log Out</Link></li>
            </ul>
        </div>
    );
}

export default UserSideBar;