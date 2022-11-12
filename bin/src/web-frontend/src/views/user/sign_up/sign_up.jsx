/* React */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';

import { UserActions } from '../../../__action/user.action';

/* CSS */
import "../global/assets/scss/login_page.scss";

library.add(faEye, faCheck);
function SignUp(props) {
    const dispatch      = useDispatch();
    
    const { register,  handleSubmit, formState: { errors, isSubmitSuccessful }, } = useForm();
    const { error_message } = useSelector(state => state.users);

    const onSubmit = (added_user_data) => {
        dispatch(UserActions.register(added_user_data));
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
                <span>Sign Up</span>
            </div>
            <form id="sign_up_form" onSubmit={ handleSubmit(onSubmit) } autoComplete="off">
                { error_message && <span className="no_user_found">{error_message}</span> }
                {/* Candidate First Name */}
                <label htmlFor="first_name">
                    <input type="text" name="first_name"  defaultValue="test"  id="first_name" className={ errors.first_name && "input_error" } {...register("first_name", { required: true })} placeholder="First Name"/>
                    { errors.first_name && <span className="message_error">This field is required</span> }
                </label>

                {/* Candidate Last Name */}
                <label htmlFor="last_name">
                    <input type="text" name="last_name" defaultValue="test" id="last_name" className={ errors.last_name && "input_error" } {...register("last_name", { required: true })} placeholder="Last Name"/>
                    { errors.last_name && <span className="message_error">This field is required</span> }
                </label>

                {/* Candidate Email */}
                <label htmlFor="email">
                    <input type="email" defaultValue="test@gmail.com" name="email" id="email" className={ errors.email && "input_error" } {...register("email", { 
                        required: "Please enter your email address",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Invalid email address"
                        }
                    } )} placeholder="Email Address"/>
                    { errors.email && <span className="message_error">{errors.email?.message}</span> }
                </label>

                <label htmlFor="candidate_password">
                    <input type="password" defaultValue="123123" id="candidate_password" name="candidate_password" className={ errors.candidate_password && "input_error" } {...register("password", { required: true })} placeholder="Password"/>
                    <button type="button" onClick={ showPassword } className="show_password_btn"><FontAwesomeIcon icon="eye" /></button>
                    { errors.candidate_password && <span className="message_error">This field is required</span> }
                </label>

                <label htmlFor="terms_condition">
                    <input type="checkbox" name="terms_condition" className="hidden" id="terms_condition" {...register("terms_condition", { required: true })}/>
                    <span className={ "checkbox_style " + (errors.terms_condition ? "no_check" : "") }><FontAwesomeIcon icon="check" /></span>
                    <p>I accept the <Link to="#" target="_blank">Terms and conditions</Link></p>
                </label>

                <button id="submit_sign_up_btn" type="submit">SIGN UP</button>
            </form>

            <p>Already have an account? <Link to="/sign-in">Log in</Link></p>
        </div>
    );
}

export default SignUp;