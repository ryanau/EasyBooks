class CommentsController < ApplicationController
  before_action :authentication, only: [:index, :create]

  def index
    post = Post.find(params[:post_id])
    comments = post.comments
    render json: {comments: comments}
  end

end
