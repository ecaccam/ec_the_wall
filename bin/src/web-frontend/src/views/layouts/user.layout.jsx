import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserDetailsFromToken } from '../../__helpers/index';

/* Components */
import SignUp from '../user/sign_up/sign_up';
import SignIn from '../user/sign_in/sign_in';
import OnBoarding from '../user/onboarding/onboarding';
import ProfileInformation from '../user/profile_information/profile_information';
import ResumeLinks from '../user/resume_links/resume_links';
import SignOut from '../user/sign_out/sign_out';

function UserLayout(props){
    return (
        <React.Fragment>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/sign-in" replace />} />
                    <Route path="sign-up" element={ <SignUp /> } />
                    <Route path="sign-in" element={ <SignIn /> } />
                    <Route path="onboarding" element={ <OnBoarding /> } />
                    <Route path="profile-information" element={ <ProfileInformation /> } />
                    <Route path="resume-links" element={ <ResumeLinks /> } />
                    <Route path="sign-out" element={ <SignOut /> } />
                </Routes>
            </Router>
        </React.Fragment>
    );
}

export default UserLayout;