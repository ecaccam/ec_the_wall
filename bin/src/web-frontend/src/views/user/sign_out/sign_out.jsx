/* React */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APIConstants } from '../../../__config/constants';

import { UserService } from '../../../__services/user.services';
import { UserActions } from '../../../__action/user.action';

import { getUserDetailsFromToken } from '../../../__helpers/index';
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";

/* CSS */
import "./sign_out.scss";

function SignOut(props) {
    const dispatch = useDispatch();
    
    useEffect(() => {
        (async () => { 
            await dispatch(UserActions.logout()); 
        })();
    }, []);

    return (
        <div id="signout_wrapper">
            <Link to="https://codingdojo.com/" target="_blank" className="cd_logo"><img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/cd_blue_logo.png" alt="Coding Dojo Logo" /></Link>
            <Modal className="logout_modal" show={ true }>
                <Modal.Body>
                    <h4>Loging out</h4>
                    <p>You will be redirected to the login screen shortly.</p>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default SignOut;