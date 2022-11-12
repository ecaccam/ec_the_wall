Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "users#login"

  # DOCU: Routes for login and register
  scope "users" do
    get  "/register" => "users#register"
    post "/register" => "users#register"
    post "/login"    => "users#login"
    get "/logout"    => "users#logout"
  end

  # DOCU: Routes for dashboard page
  get "/dashboard" => "posts#dashboard"

  # DOCU: Routes for posting feature
  scope "posts" do
    post "/create" => "posts#create_post"
    post "/delete" => "posts#delete_post"
  end

  # DOCU: Routes for commenting feature
  scope "comments" do
    post "/create" => "comments#create_comment"
    post "/delete" => "comments#delete_comment"
  end
end
