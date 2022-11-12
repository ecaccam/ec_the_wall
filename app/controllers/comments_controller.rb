include ApplicationHelper

class CommentsController < ApplicationController
    # DOCU: This will process the creation of comment per post.
    # Triggered by: (POST) /comments/create
    def create_comment
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            validate_fields = validate_fields(params, [:post_id, :message])

            if validate_fields[:status]
                response_data = Comment.create_comment(params.merge!({ :user_id => session[:user_id] }))
                
                if response_data[:status]
                    response_data[:result][:html] = render_to_string :partial => "posts/partials/comment_lists",
                        :locals => {
                            :comments => [{
                                "comment_id" => response_data[:result][:comment_id],
                                "commenter_user_id" => session[:user_id],
                                "commenter_first_name" => session[:first_name],
                                "commenter_message" => params[:message],
                            }]
                        }
                end
            else
                response_data[:error] = "Please enter your comment."
            end
        rescue => exception
            response_data[:error] = exception.message
        end

        render :json => response_data
    end

    # DOCU: This will process the deletion of comment per post.
    # Triggered by: (POST) /comments/delete
    def delete_comment
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            validate_fields = validate_fields(params, [:comment_id])

            if validate_fields[:status]
                response_data = Comment.delete_comment(params.merge!({ :user_id => session[:user_id] }))
            else
                response_data[:error] = "Comment id is required."
            end
        rescue => exception
            response_data[:error] = exception.message
        end

        render :json => response_data
    end
end
