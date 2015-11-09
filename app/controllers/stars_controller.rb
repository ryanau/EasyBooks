class StarsController < ApplicationController
  before_action :authentication, only: [:index, :create, :destroy, :count, :starred, :position]

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
    star.conversation.update_attributes(active: false)
    star.update_attributes(active: false)
    render json: {message: "Unstarred"}
  end

  def create
    action = StarCreator.new(params, current_user)
    if action.ok?
      PostAlert.perform_async(action.star.post.id)
      render json: {message: "Starred"}
    else
      render json: 'failed to star', status: 400
    end
  end

  def count
    post_id = params[:post_id]
    post = Post.find(post_id)
    star_count = Star.where(post_id: post.id, active: true).where.not(user_id: post.seller.id).count
    render json: {star_count: star_count}
  end

  def starred
    if current_user.stars.where(active: true).count > 0
      response = true
    else
      response = false
    end
    render json: {starred: response}
  end

  def position
    post_id = params[:post_id]
    star = Post.find(post_id).stars.find_by(user_id: current_user.id)
    star_position = Star.where(post_id: post_id).index(star) + 1
    render json: {star_position: star_position}
  end
end



