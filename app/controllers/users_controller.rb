include ApplicationHelper

class UsersController < ApplicationController
    # DOCU: This will render the login page and process login
    # Triggered by: (GET) / & (POST) /users/login
    def login
        if request.post?
            # Validate required fields
            validate_fields = validate_fields(params, [:email_address, :password])

            if validate_fields[:status]
                login_user = User.login_user(params)

                if login_user[:status]
                    # Set sessions here
                    set_user_session(login_user[:result])
                else
                    flash[:error_messages] = login_user[:error]
                    redirect_to "/"
                end
            else
                flash[:error_messages] = validate_fields[:error]
                redirect_to "/"
            end
        end
    end

    # DOCU: This will render the registration page and process registration
    # Triggered by: (GET) /users/register & (POST) /users/register
    def register
        if request.post?
            # Validate required fields
            validate_fields = validate_fields(params, [:first_name, :last_name, :email_address, :password, :confirm_password])

            if validate_fields[:status]
                create_user = User.create_user(params)

                if create_user[:status]
                    # Set sessions here
                    set_user_session(create_user[:result])
                else
                    flash[:error_messages] = create_user[:error]
                    redirect_to "/users/register"
                end
            else
                flash[:error_messages] = validate_fields[:error]
                redirect_to "/users/register"
            end
        end
    end

    # DOCU: This will reset session and logouts a user
    # Triggered by: (GET) /users/logout
    def logout
        reset_session
        redirect_to "/"
    end

    private
        # DOCU: This function will set session and redirect user to /dashboard
        def set_user_session(params)
            session[:user_id]    = params[:user_id]
            session[:first_name] = params[:first_name]

            redirect_to "/dashboard"
        end
end
