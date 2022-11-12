module ApplicationHelper
    # DOCU: This global function is used to validate required fields if they are present
    # Triggered by: All Controllers
    def validate_fields(params, required_params)
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            response_data[:status] = (params.permit!.require(required_params).length === required_params.length)    
        rescue => exception
            response_data[:error]  = "All fields are required!"
        end

        return response_data
    end
end
