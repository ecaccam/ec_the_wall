import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

/* Components */
import CandidateManagement from '../admin/candidate_management/candidate_management';
import SignOut from '../user/sign_out/sign_out';

function AdminLayout(props){
    return (
        <React.Fragment>
            <Router>
                <Routes>
                    <Route path="candidate-management" element={ <CandidateManagement /> } />
                    <Route path="sign-out" element={ <SignOut /> } />
                </Routes>
            </Router>
        </React.Fragment>
    );
}

export default AdminLayout;