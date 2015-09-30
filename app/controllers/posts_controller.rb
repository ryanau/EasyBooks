class PostsController < ApplicationController
  before_action :authentication, only: [:index, :create, :show, :image_upload, :active_posts]

  def index
    posts = Post.where(public: true)
    render json: {data: posts}
  end

  def create
    p params[:pic_url]
    post = Post.create(price: params[:price], title: params[:title], pickup: params[:pickup], course_id: params[:course_id], seller_id: current_user.id, picture_url: params[:pic_url])
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

  def active_posts
    posts = current_user.selling_posts.where(sold: false, public: true)
    render json: {data: posts}
  end

  def image_upload
    file = params["pic_file"].open()
    pic_address = File.open(file)
    auth = {
      cloud_name: ENV['CLOUDINARY_NAME'],
      api_key:    ENV['CLOUDINARY_API_KEY'],
      api_secret: ENV['CLOUDINARY_API_SECRET'],
      width: 1000,
      height: 1000,
      crop: "limit",
    }
    response = Cloudinary::Uploader.upload(pic_address, auth)
    render json: {pic_url: response["url"]}
  end
end
