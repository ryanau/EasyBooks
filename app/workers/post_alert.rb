class PostAlert
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(course_id, post_id, seller_id)
    
  end
end



