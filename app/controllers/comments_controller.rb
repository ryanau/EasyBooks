class CommentsController < ApplicationController
  before_action :authentication, only: [:index, :create]

  def index
    comments = Post.find(params[:post_id]).comments
    render :json => comments, :include => {:user => {:only => :first_name}}
  end

  def create
    post = Post.find(params[:post_id])
    post.comments.create(content: params[:comment], user_id: current_user.id)
    render json: {message: "success"}
  end

end
