class NotifySubscribedBuyers
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(course_id, post_id, seller_id)
    SmsNotification.notify_buyers_available_posts(course_id, post_id, seller_id)
  end
end



