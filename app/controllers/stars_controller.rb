class StarsController < ApplicationController
  before_action :authentication, only: [:index, :create, :destroy, :count]

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
    action = StarCreator.new(params, current_user)
    if action.ok?
      render json: {message: "Starred"}
    else
      render json: 'failed to star', status: 400
    end
  end

  def count
    post_id = params[:post_id]
    post = Post.find(post_id)
    star_count = Star.where(post_id: post.id).where.not(user_id: post.seller.id).count
    render json: {star_count: star_count}
  end
end
