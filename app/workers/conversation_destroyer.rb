class ConversationDestroyer
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(star_id, post_id)
    ConversationDestroyerControls.disengage_conversation_by_seller_post_deletion(star_id, post_id)
  end
end