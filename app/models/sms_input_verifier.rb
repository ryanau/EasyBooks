class SmsInputVerifier
  def initialize(params)
    @from = params[:From][2, params[:From].length]
    @body = params[:Body]
    @command = {}
    @message = {}
    @star = {}
    @post = {}
  end

  def proceed
    if verify_command
      check_input
    else
      @message = "EasyBooks: Didn't recognize that command. Did you mistype?"
      SmsNotification.send_from_main_phone(@from, @message)
    end
  end

  def verify_command
    @command = Command.find_by(random_num: @body)
  end

  def check_input
    @star = Star.find(@command.star_id)
    @post = Post.find(@star.post_id)
    if @command.action == 'approve_post_alert'
      approve_post
      release_private_channel
    end
  end

  def approve_post
    @star.update_attributes(sent: true, accepted: true)
    @command.destroy
    @message = "EasyBooks: A message will arrive soon from #{@post.seller.first_name}, the seller of #{@post.title}. You can text the seller directly through that private number.\n\nTo terminate the conversation, reply with 'EXIT' to this number.\n\nTo mark the transaction as completed, reply with 'DONE' to this number."
    SmsNotification.send_from_main_phone(@from, @message)
  end

  def release_private_channel
    buyer = User.find_by(phone: @from)
    seller = @post.seller

    seller_numbers = []
    Conversation.where(seller_id: seller.id).each do |c|
      seller_numbers << c.seller_phone.number
    end
    buyer_numbers = []
    Conversation.where(buyer_id: buyer.id).each do |c|
      buyer_numbers << c.buyer_phone.number
    end

    seller_phone = Phone.where.not(number: seller_numbers).first
    buyer_phone = Phone.where.not(number: buyer_numbers).first
    Conversation.create(seller_id: seller.id, buyer_id: buyer.id, seller_phone_id: seller_phone.id, buyer_phone_id: buyer_phone.id, star_id: @star.id)

    system = ENV['TWILIO_PHONE']
    to_buyer_message = "EasyBooks: This is a private channel between you and #{seller.first_name}, the seller of #{@post.title}: $#{@post.price} (#{@post.condition}). Start texting!\n\nFor help, refer to the instructions from #{system}."
    SmsNotification.send_from_private_phone(buyer_phone.number, buyer.phone, to_buyer_message)

    # to_seller_message = "EasyBooks: This is a private channel between you and #{buyer.first_name}, who is interested in buying #{@post.title}. Start texting!\n\nFor help, refer to the instructions from #{system}."
    # SmsNotification.send_from_private_phone(seller_phone.number, seller.phone, to_seller_message)
  end
end








