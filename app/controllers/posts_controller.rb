class PostsController < ApplicationController
  before_action :authentication, only: [:index]

  def index
    posts = Post.where(public: true)
    render json: {data: posts}
  end
end
