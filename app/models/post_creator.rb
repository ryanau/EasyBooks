class PostCreator
  attr_reader :post
  def initialize(params, current_user)
    @current_user = current_user
    @post = Post.new(allowed_params(params, @current_user))
  end

  def ok?
    unless @current_user.selling_posts.where(sold: false, public: true).count > 0
      save_post
    end
  end

  def save_post
    @post.save
    @current_user.credits.first.update_attributes(used: true)
  end

  private

  def allowed_params(params, current_user)
    if params[:pic_url] == ""
      pic_url = "https://img.memecdn.com/expensive-college-text-books_o_1040947.jpg"
    else
      pic_url = params[:pic_url]
    end
    course_selected = params[:course_selected]
    arr = []
    arr.unshift(course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1])
    total = course_selected.length - course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1].length - 2
    arr.unshift(course_selected[0..total])
    course_id = Course.find_by(department: arr[0], course_number: arr[1]).id
    {price: params[:price], title: params[:title].capitalize, pickup: params[:pickup].capitalize, course_id: course_id, seller_id: current_user.id, picture_url: pic_url, description: params[:description].capitalize, condition: params[:condition], university_id: current_user.university_id, author: params[:author]}
  end
end