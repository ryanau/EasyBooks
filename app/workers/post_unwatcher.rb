class PostUnwatcher
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(star_id, post_id)
    ConversationDestroyerControls.disengage_conversation_by_buyer_unwatch(star_id, post_id)
  end
end