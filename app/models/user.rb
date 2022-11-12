class User < ApplicationRecord
    # DOCU: This will process the saving in users table
    # Triggered by: UsersController.create_user
    def self.create_user(params)
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            # Validate fields (email, password, confirm password)
            validate_registration = self.validate_registration(params)

            if validate_registration[:status]
                # Check email if it is already registered
                check_email_exists = query_record(["SELECT id FROM users WHERE email_address =?", params[:email_address]])

                # Proceed in inserting users record if email is not yet registered
                if !check_email_exists.present?
                    new_user_id = insert_record([
                        "INSERT INTO users (first_name, last_name, email_address, password, created_at, updated_at)
                         VALUES (?, ?, ?, ?, NOW(), NOW())",
                         params[:first_name], params[:last_name], params[:email_address], Digest::MD5.hexdigest(params[:password])
                    ])

                    if new_user_id > 0
                        response_data[:status] = true
                        response_data[:result] = {
                            :user_id    => new_user_id,
                            :first_name => params[:first_name]
                        }
                    end
                else
                    response_data[:error] = "Email is already registered."
                end
            else
                response_data[:error] = validate_registration[:error]
            end
        rescue => exception
            
        end

        return response_data
    end

    # DOCU: This will process the login of a user
    # Triggered by: UsersController.login_user 
    def self.login_user(params)
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            # Check user record if is existing
            user_record = query_record([
                "SELECT id, first_name FROM users WHERE email_address =? AND password =?",
                 params[:email_address], Digest::MD5.hexdigest(params[:password])
            ])

            if user_record.present?
                response_data[:status] = true
                response_data[:result] = {
                    :user_id => user_record["id"],
                    :first_name => user_record["first_name"]
                }
            else
                response_data[:error] = "Email Address or Password is incorrect."
            end
        rescue => exception
            response_data[:error] = exception.message
        end

        return response_data
    end

    private
        def self.validate_registration(params)
            response_data = { :status => false, :result => {}, :error => nil }

            begin
                error_messages = []

                params.each do |key, value|
                    # Validate email format here
                    error_messages << "Invalid email format" if key === "email_address" && !(value =~ URI::MailTo::EMAIL_REGEXP)
                    
                    # Validate password length to be atleast 7 characters
                    error_messages << "Password must contain atleast 7 characters" if key === "password" && value.length <= 7

                    # Validate confirm password and password to be the same
                    error_messages << "Password and Confirm Password must be the same" if key === "comfirm_password" && value != params[:password]
                end

                response_data[:status] = !(error_messages.present?)
                response_data[:error]  = error_messages.join(", ")
            rescue => exception
                response_data[:error] = exception.message
            end

            return response_data
        end
end
