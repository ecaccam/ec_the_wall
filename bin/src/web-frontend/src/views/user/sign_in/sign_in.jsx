/* React */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';

import {APIConstants} from '../../../__config/constants';

import { UserService } from '../../../__services/user.services';
import { UserActions } from '../../../__action/user.action';

import { getUserDetailsFromToken } from '../../../__helpers/index';

/* CSS */
import "../global/assets/scss/login_page.scss";

library.add(faEye, faCheck);

function SignIn(props) {
    const dispatch = useDispatch();

    const { register,  handleSubmit, reset, formState: { errors, isSubmitSuccessful }, } = useForm();
    const { error_message } = useSelector(state => state.users);

    const onSubmit = ({email, candidate_password}) => {
        dispatch(UserActions.login(email, candidate_password));
    };

    const showPassword = () => {
        let candidate_password = document.getElementById("candidate_password");

        (candidate_password.type === "password") ? candidate_password.setAttribute("type", "text") : candidate_password.setAttribute("type", "password");
    }
    
    useEffect(() => {
        (async () => { 
            await dispatch(UserActions.checkCurrentUser()); 
        })();
    }, []);

    return (
        <div id="login_wrapper">
            <Link to="https://codingdojo.com/" target="_blank" className="cd_logo"><img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/cd_blue_logo.png" alt="Coding Dojo Logo" /></Link>
            <div className="talent_book_block">
                <img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/talent_book_logo.png" alt="Talent Book Logo" />
                <span>Sign In</span>
            </div>
            <form id="sign_in_form" onSubmit={ handleSubmit(onSubmit) } autoComplete="off">
                { error_message && <span className="no_user_found">{error_message}</span> }
                {/* Candidate Email */}
                <label htmlFor="email">
                    <input type="email" name="email" id="email" defaultValue="test@gmail.com" className={ errors.email && "input_error" } {...register("email", { 
                        required: "Please enter your email address",
                        pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Invalid email address"
                        }
                    } )} placeholder="Email Address"/>
                    { errors.email && <span className="message_error">{errors.email?.message}</span> }
                </label>

                <label htmlFor="candidate_password">
                    <input type="password" id="candidate_password" defaultValue="123123" name="candidate_password" className={ errors.candidate_password && "input_error" } {...register("candidate_password", { required: true })} placeholder="Password"/>
                    <button type="button" className="show_password_btn" onClick={ showPassword }><FontAwesomeIcon icon="eye" /></button>
                    { errors.candidate_password && <span className="message_error">This field is required</span> }
                    <button className="forgot_password_btn" ype="button">Forgot Password?</button>
                </label>

                <button id="submit_sign_in_btn" type="submit">SIGN IN</button>
            </form>

            <p>Don’t have an account? <Link to="/sign-up">Sign Up</Link></p>
        </div>
    );
}

export default SignIn;