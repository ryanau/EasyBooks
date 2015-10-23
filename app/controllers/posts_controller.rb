class PostsController < ApplicationController
  require 'openssl'
  before_action :authentication, only: [:index, :create, :show, :image_upload, :active_posts, :destroy, :starred_posts, :mark_sold, :archived_posts, :mutual_friends]

  def index
    start_point = params[:start_point].to_i
    end_point = params[:end_point].to_i
    if params[:course_selected] != nil && params[:course_selected] != ""
      course_selected = params[:course_selected]
      arr = []
      arr.unshift(course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1])
      total = course_selected.length - course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1].length - 2
      arr.unshift(course_selected[0..total])
      course_id = Course.find_by(department: arr[0], course_number: arr[1]).id
      posts = Post.where(public: true, course_id: course_id)[start_point..end_point]
    else
      posts = Post.where(public: true).order(created_at: :DESC)[start_point..end_point]
    end
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {except: :updated_at}, seller: {only: [:pic, :first_name]}})
  end

  def create
    action = PostCreator.new(params, current_user)
    if action.ok?
      post = action.post
      # CourseAlert.perform_async(post.course_id, post.id, current_user.id)
      render json: {post_id: action.post.id}
    else
      render json: {error_message: action.post}
    end
  end

  def show
    post_id = params[:post_id]
    post = Post.find(post_id)
    seller = Post.find(post_id).seller
    seller_id = seller.id
    seller_name = seller.first_name

    
    render json: {post: post, seller_id: seller_id, seller_name: seller_name}
  end

  def mutual_friends
    post_id = params[:post_id]
    post = Post.find(post_id)
    seller = Post.find(post_id).seller

    key = ENV['FACEBOOK_SECRET']
    data = current_user.token

    appsecret_proof = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), key, data)

    response = HTTParty.get("https://graph.facebook.com/v2.5/#{seller.uid}?fields=context.fields%28all_mutual_friends%29&access_token=#{data}",
        :body => {
                  'access_token' => data,
                  'appsecret_proof' => appsecret_proof,
                  })
    count = response.parsed_response["context"]["all_mutual_friends"]["summary"]["total_count"]

    friends = []
    response.parsed_response["context"]["all_mutual_friends"]["data"].each do |el|
      arr = [el["name"], el["picture"]["data"]["url"]]
      friends << arr
    end
    render json: {mutual_friends_count: count, mutual_friends: friends}
  end

  def mark_sold
    post_id = params[:post_id]
    post = Post.find(post_id)
    if post.sold && !post.public
      post.update_attributes(sold: false, public: true)
      response = false
    else
      post.update_attributes(sold: true, public: false)
      response = true
    end
    render json: {sold: response}
  end

  def destroy
    post_id = params[:post_id]
    current_user.selling_posts.find(post_id).destroy
    render json: {message: "Post Deleted"}
  end

  def active_posts
    posts = current_user.selling_posts.where(sold: false, public: true)
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name]}})  
  end

  def starred_posts
    posts = current_user.posts
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name]}})  
  end

  def archived_posts
    posts = current_user.selling_posts.where(sold: true, public: false)
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name]}})  
  end

  def image_upload
    file = params["pic_file"].open()
    pic_address = File.open(file)
    params = {
      cloud_name: ENV['CLOUDINARY_NAME'],
      api_key:    ENV['CLOUDINARY_API_KEY'],
      api_secret: ENV['CLOUDINARY_API_SECRET'],
      width: 1000,
      height: 1000,
      crop: "limit",
    }
    response = Cloudinary::Uploader.upload(pic_address, params)
    render json: {pic_url: response["url"]}
  end
end
