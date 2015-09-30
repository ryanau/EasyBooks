class CommentsController < ApplicationController
  before_action :authentication, only: [:index, :create]

  def index
    post = Post.find(params[:post_id])
    comments = post.comments
    # respond_to do |format|
    #   render :json => comments.to_json(:include => { :user => {:only => :first_name}})
    # end
    # render json: {comments: comments}

    render :json => comments, :include => {:user => {:only => :first_name}}
  end

  def create
    post = Post.find(params[:post_id])
    post.comments.create(content: params[:comment], user_id: current_user.id)
    render json: {message: "success"}
  end

end
