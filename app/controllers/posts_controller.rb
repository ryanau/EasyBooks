class PostsController < ApplicationController
  before_action :authentication, only: [:index, :create, :show]

  def index
    posts = Post.where(public: true)
    render json: {data: posts}
  end

  def create
    post = Post.create(price: params[:price], title: params[:title], pickup: params[:pickup], course_id: params[:course_id], seller_id: current_user.id, picture_url: "https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg")
    render json: {post_id: post.id}
  end

  def show
    post_id = params[:post_id]
    post = Post.find(post_id)
    seller = Post.find(post_id).seller
    seller_id = seller.id
    seller_name = seller.first_name
    render json: {post: post, seller_id: seller_id, seller_name: seller_name}
  end
end
