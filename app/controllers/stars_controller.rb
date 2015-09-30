class StarsController < ApplicationController
  before_action :authentication, only: [:index, :create, :destroy]

  def index
    post_id = params[:post_id]
    star = Post.find(post_id).stars.find_by(user_id: current_user.id)
    if star
      render json: {starred: true}
    else
      render json: {starred: false}
    end
  end

  def destroy
    post_id = params[:post_id]
    star = Post.find(post_id).stars.find_by(user_id: current_user.id)
    star.destroy
    render json: {message: "Unstarred"}
  end

  def create
    post_id = params[:post_id]
    star = Post.find(post_id).stars.find_by(user_id: current_user.id)
    if !star
      Post.find(post_id).stars.create(user_id: current_user.id)
      render json: {message: "Starred"}
    end
  end
end
