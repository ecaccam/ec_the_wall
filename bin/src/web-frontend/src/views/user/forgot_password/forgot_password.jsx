/* React */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { isUserLogin } from '../../../__reducers/users.reducer';
import { useState } from 'react';

/* CSS */
import "../global/assets/scss/login_page.scss";

library.add(faEye, faCheck);
function ForgotPassword(props) {
    const { register,  handleSubmit, formState: { errors, isSubmitSuccessful }, } = useForm();

    const [no_user, invalidUser] = useState(false);
    const dispatch               = useDispatch();
    const { user_list }          = useSelector(state => state.users);
    const navigate               = useNavigate();

    const onSubmit = (user_details_sign_in) => {
        let user_login = user_list.filter(user_item => {
            return user_item.email === user_details_sign_in.email;
        });

        // if(user_login.length){
        //     invalidUser(false);
        //     dispatch(isUserLogin(user_login));
        //     navigate("/onboarding");
        // }
        // else{
        //     invalidUser(true);
        // }
    };

    React.useEffect(() => {
    }, [isSubmitSuccessful]);

    return (
        <div id="login_wrapper">
            <Link to="https://codingdojo.com/" target="_blank" className="cd_logo"><img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/cd_blue_logo.png" alt="Coding Dojo Logo" /></Link>
            <div className="talent_book_block">
                <img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/talent_book_logo.png" alt="Talent Book Logo" />
                <span>Sign In</span>
            </div>
            <form id="sign_in_form" onSubmit={ handleSubmit(onSubmit) } autoComplete="off">
                { no_user && <span className="no_user_found">NO USER FOUND</span> }
                {/* Candidate Email */}
                <label htmlFor="email">
                    <input type="email" name="email" id="email" className={ errors.email && "input_error" } {...register("email", { 
                        required: "Please enter your email address",
                        pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Invalid email address"
                        }
                    } )} placeholder="Email Address"/>
                    { errors.email && <span className="message_error">{errors.email?.message}</span> }
                </label>

                <button id="submit_sign_in_btn" type="submit">SIGN IN</button>
            </form>

            <p>Don’t have an account? <Link to="/sign-up">Sign Up</Link></p>
        </div>
    );
}

export default ForgotPassword;