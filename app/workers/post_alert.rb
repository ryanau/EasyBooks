class PostAlert
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(post_id)
    PostAlertControls.create_post_alert(post_id)
  end
end

