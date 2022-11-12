class Post < ApplicationRecord
    # DOCU: This function will fetch all post with its corresponding comments
    # Triggered by: PostController.dashboard
    def self.get_all_posts()
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            response_data[:status] = true
            response_data[:result] = query_records([
                "SELECT 
                    posts.id AS post_id, posts.user_id AS post_owner_id, posts.message, users.first_name,
                    IF(
                        comments.id IS NOT NULL,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'comment_id', comments.id,
                                'commenter_user_id', comments.user_id,
                                'commenter_first_name', comment_users.first_name,
                                'commenter_message', comments.message
                            )
                        ),
                        NULL
                    ) AS post_comments
                FROM posts
                INNER JOIN users ON users.id = posts.user_id
                LEFT JOIN comments ON comments.post_id = posts.id
                LEFT JOIN users AS comment_users ON comment_users.id = comments.user_id
                GROUP BY posts.id"
            ])
        rescue => exception
            response_data[:error] = exception.message
        end

        return response_data
    end

    # DOCU: This function will process the saving of post in database
    # Triggered by: PostController.create_post
    def self.create_post(params)
        response_data = { :status => false, :result => {}, :error => nil }

        begin
            insert_post_id = insert_record([
                "INSERT INTO posts (user_id, message, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
                 params[:user_id], params[:message]
            ])

            if insert_post_id > 0
                response_data[:status] = true
                response_data[:result] = { :post_id => insert_post_id }
            end
        rescue => exception
            response_data[:error] = exception.message
        end

        return response_data
    end

    # DOCU: This function will process the deleting of a post
    # Triggered by: PostController.delete_post
    def self.delete_post(params)
        response_data = { :status => false, :result => {}, :error => nil }

        # begin
            # Validate first if the deleter really owns the post
            check_post_owner = self.check_post_owner(params)

            if check_post_owner
                # Check if post has comments, then delete comments in that posts
                post_comments = query_record(["SELECT JSON_ARRAYAGG(id) AS comment_ids_to_delete FROM comments WHERE post_id =?", params[:post_id]])

                if post_comments.present? && post_comments["comment_ids_to"].present?
                    delete_comment_records = delete_record(["DELETE FROM comments WHERE post_id IN (?)", JSON.parse(post_comments["comment_ids_to_delete"])])
                end

                delete_post = delete_record(["DELETE FROM posts WHERE id =?", params[:post_id]])
                response_data[:status] = true if delete_post > 0
            else
                response_data[:error] = "You cannot delete a post you don't own."
            end
        # rescue => exception
        #     response_data[:error] = exception.message
        # end

        return response_data
    end

    private
        # DOCU: This private function will check first if the deleter really owns the post to be deleted.
        # Triggered by: self.delete_post
        def self.check_post_owner(params)
            check_post_owner = query_record(["SELECT id FROM posts WHERE user_id =? AND id =?", params[:user_id], params[:post_id]])

            return check_post_owner.present? && check_post_owner["id"].present?
        end
end
