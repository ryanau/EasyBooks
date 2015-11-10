class PostAlertDestroyer
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(star_id)
    PostAlertDestroyerControls.destroy_post_alert(star_id)
  end
end



