class PostAlert
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(post_id)
    SmsNotification.create_post_alert(post_id)
  end
end



