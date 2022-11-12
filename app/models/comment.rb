class Comment < ApplicationRecord
    # DOCU: This will process the inserting of comments in the database
    # Triggered by: CommentsController.create_comment
    def self.create_comment(params)
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            insert_comment_id = insert_record([
                "INSERT INTO comments (post_id, user_id, message, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
                 params[:post_id], params[:user_id], params[:message]
            ])

            if insert_comment_id > 0
                response_data[:status] = true
                response_data[:result] = { :post_id => params[:post_id], :comment_id => insert_comment_id}
            end
        rescue => exception
            response_data[:error] = exception.message
        end

        return response_data
    end

    # DOCU: This will process the deleting of comments in the database
    # Triggered by: CommentsController.delete_comment
    def self.delete_comment(params)
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            # Check if the comment belongs to the logged in user
            check_delete_comment_owner = query_record(["SELECT id FROM comments WHERE user_id =? AND id=?", params[:user_id], params[:comment_id]])

            if check_delete_comment_owner.present? && check_delete_comment_owner["id"].present?
                delete_comment = delete_record(["DELETE FROM comments WHERE id =?", params[:comment_id]])
                response_data[:status] = (delete_comment > 0)
            else
                response_data[:error] = "You cannot delete a comment, you don't own."
            end
        rescue => exception
            response_data[:error] = exception.message
        end

        return response_data
    end
end
