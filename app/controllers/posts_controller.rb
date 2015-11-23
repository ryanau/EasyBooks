class PostsController < ApplicationController
  require 'openssl'
  before_action :authentication, only: [:index, :create, :show, :image_upload, :active_posts, :destroy, :starred_posts, :mark_sold, :archived_posts, :mutual_friends, :sell_status, :follow_count, :starred_posts_count, :bought_posts, :post_sold]

  def index
    university_id = current_user.university_id
    start_point = params[:start_point].to_i
    end_point = params[:end_point].to_i
    course_selected = params[:course_selected]
    sorting = params[:sorting]
    if course_selected != nil && course_selected != ""
      result = find_course(course_selected)
      case sorting
        when "Oldest to Newest"
          posts = Post.where(university_id: university_id, public: true, active: true, course_id: result[:course_id]).order(created_at: :ASC)[start_point..end_point]
        when "$ Low to High"
          posts = Post.where(university_id: university_id, public: true, active: true, course_id: result[:course_id]).order(price: :ASC)[start_point..end_point]
        when "$ High to Low"
          posts = Post.where(university_id: university_id, public: true, active: true, course_id: result[:course_id]).order(price: :DESC)[start_point..end_point]
        else
          posts = Post.where(university_id: university_id, public: true, active: true, course_id: result[:course_id]).order(created_at: :DESC)[start_point..end_point]
      end
    else
      case sorting
        when "Oldest to Newest"
          posts = Post.where(university_id: university_id, public: true, active: true).order(created_at: :ASC)[start_point..end_point]
        when "$ Low to High"
          posts = Post.where(university_id: university_id, public: true, active: true).order(price: :ASC)[start_point..end_point]
        when "$ High to Low"
          posts = Post.where(university_id: university_id, public: true, active: true).order(price: :DESC)[start_point..end_point]
        else
          posts = Post.where(university_id: university_id, public: true, active: true).order(created_at: :DESC)[start_point..end_point]
      end
    end
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {except: :updated_at}, seller: {only: [:pic, :first_name, :last_name]}})
  end

  def create
    action = PostCreator.new(params, current_user)
    if action.ok?
      post = action.post
      CourseAlert.perform_async(post.course_id, post.id, current_user.id)
      render json: {post_id: action.post.id}
    else
      render json: {error_message: action.post}
    end
  end

  def show
    post = Post.find_by(id: params[:post_id], active: true)
    if post.seller_id == current_user.id || post.buyer_id == current_user.id || !post.sold
      render :json => post.as_json(include: {seller: {only: [:id, :first_name, :last_name, :pic]}, course: {only: [:department, :course_number]}, entry: {only: [:venmo_transaction_id, :created_at]}})
    else
      render json: {error_message: "Post not found"}
    end
  end

  def sell_status
    engaged_count = current_user.buying_conversations.count + current_user.selling_conversations.count
    if current_user.credits.count == 0
      status = true
      error_message = "Insufficient credit."
    elsif engaged_count > Phone.all.count
      status = true
      error_message = "You have reached the app's limit in concurrent transactions. Please complete all active transactions first."
    else
      status = false
      error_message = "Success"
    end
    render json: {status: status, error_message: error_message}
  end

  def follow_count
    count = current_user.stars.count
    render json: {count: count}
  end

  def mutual_friends
    result = find_mutual_friends(params[:post_id])
    render json: {mutual_friends_count: result[:count], mutual_friends: result[:friends]}
  end

  def destroy
    post_id = params[:post_id]
    current_user.selling_posts.find_by(id: post_id, active: true).update_attributes(active: false)
    if star = Post.find(post_id).stars.find_by(sent: true, accepted: true, active: true)
      ConversationDestroyer.perform_async(star.id, post_id)
    end
    render json: {message: "Post Deleted"}
  end

  def active_posts
    posts = current_user.selling_posts.where(sold: false, public: true, active: true).order(created_at: :DESC)
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name, :last_name]}})  
  end

  def starred_posts
    posts = current_user.posts.where(active: true).order(created_at: :DESC)
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name, :last_name]}})  
  end

  def starred_posts_count
    count = current_user.posts.where(active: true).order(created_at: :DESC).count
    render json: {starred_posts_count: count} 
  end

  def archived_posts
    posts = current_user.selling_posts.where(sold: true, public: false, active: true).order(created_at: :DESC)
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name, :last_name]}})  
  end

  def bought_posts
    posts = current_user.buying_posts.order(created_at: :DESC)
    render :json => posts.as_json(include: {stars: {only: :star_id}, course: {only: [:department, :course_number]}, seller: {only: [:pic, :first_name, :last_name]}})  
  end

  def post_sold
    post_id = params[:post_id]
    sold = Post.find(post_id).sold
    render json: {sold: sold}
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

  private

  def find_course(course_selected)
    # separate the department and course number to find from database
    # e.g. ESPM 50AC, POL SCI 231E, ECON 131
    arr = []
    arr.unshift(course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1])
    total = course_selected.length - course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1].length - 2
    arr.unshift(course_selected[0..total])
    course_id = Course.find_by(department: arr[0], course_number: arr[1]).id
    {course_id: course_id}
  end
  
  def find_mutual_friends(post_id)
    post_id = params[:post_id]
    post = Post.find(post_id)
    seller = post.seller

    key = ENV['FACEBOOK_SECRET']
    data = current_user.token

    appsecret_proof = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), key, data)
    response = HTTParty.get("https://graph.facebook.com/v2.5/#{seller.uid}?fields=context.fields%28all_mutual_friends%29&access_token=#{data}",
        :body => {
                  'access_token' => data,
                  'appsecret_proof' => appsecret_proof,
                  })
    begin
    count = response.parsed_response["context"]["all_mutual_friends"]["summary"]["total_count"]
    friends = []
    response.parsed_response["context"]["all_mutual_friends"]["data"].each do |el|
      arr = [el["name"], el["picture"]["data"]["url"]]
      friends << arr
    end
    rescue
      count = "0"
      friends = []
    end
    {count: count, friends: friends}
  end
end
