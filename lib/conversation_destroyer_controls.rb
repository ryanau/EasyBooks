module ConversationDestroyerControls
  def self.disengage_conversation_by_seller_post_deletion(star_id, post_id)
    message = 'EasyBooks: This post has been deleted by the seller. This private channel is now closed.'
    star = Star.find(star_id)
    post = Post.find(post_id)
    conversation = star.conversation
    conversation.update_attributes(active: false)
    conversation.paymentcode.destroy
    SmsOutbound.send_from_private_phone(Phone.find(conversation.seller_phone_id).number, conversation.seller.phone, message)
    SmsOutbound.send_from_private_phone(Phone.find(conversation.buyer_phone_id).number, conversation.buyer.phone, message)
    post.stars.update_all(active: false)
  end

  def self.disengage_conversation_by_buyer_unwatch(star_id, post_id)
    message = 'EasyBooks: The buyer has unwatched the post. This private channel is now closed.'
    star = Star.find(star_id)
    post = Post.find(post_id)
    conversation = star.conversation
    conversation.update_attributes(active: false)
    conversation.paymentcode.destroy
    SmsOutbound.send_from_private_phone(Phone.find(conversation.seller_phone_id).number, conversation.seller.phone, message)
    SmsOutbound.send_from_private_phone(Phone.find(conversation.buyer_phone_id).number, conversation.buyer.phone, message)
    PostAlert.perform_async(post_id)
  end
end
