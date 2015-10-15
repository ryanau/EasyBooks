class StarCreator
  attr_reader :star
  def initialize(params, current_user)
    @star = Star.new(allowed_params(params, current_user))
  end

  def ok?
    save_star
  end

  def save_star
    @star.save
  end

  private

  def allowed_params(params, current_user)
    {post_id: params[:post_id], user_id: current_user.id}
  end
end
