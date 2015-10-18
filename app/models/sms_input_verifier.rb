class SmsInputVerifier
  def initialize(params)
    @to = params[:To][2, params[:To].length]
    @from = params[:From][2, params[:From].length]
    @body = params[:Body]
    @command = {}
    @message = {}
    @star = {}
    @post = {}
    @phone = {}
  end

  def proceed
    if check_system_phone && verify_command
      check_input
    elsif check_private_channel_phone
      @recipient = User.find_by(phone: @from)
      if find_private_channel(@recipient)
        if @body == 'EXIT' || @body == 'DONE'
          proceed_user_action
        else
          SmsNotification.send_from_private_phone(@phone.number, @recipient.phone, @body)
        end
      else
        @message = "EasyBooks: You are not currently engaged in any transaction."
        SmsNotification.send_from_private_phone(@phone.number, @from, @message)
      end
    else
      @message = "EasyBooks: Didn't recognize that command. Did you mistype?"
      SmsNotification.send_from_main_phone(@from, @message)
    end
  end

  private

  def check_system_phone
    '+1' + @to == ENV['TWILIO_PHONE']
  end

  def check_private_channel_phone
    @phone = Phone.find_by(number: '+1' + @to)
  end

  def verify_command
    @command = Command.find_by(random_num: @body)
  end

  def proceed_user_action
    if @body == 'EXIT'
      @message = 'EasyBooks: This transaction has been terminated by the other party. This private channel is now closed.'
      SmsNotification.send_from_private_phone(@phone.number, @from, @message)
    elsif @body == 'DONE'
      @message = 'EasyBooks: This transaction is marked as completed by the other party. This private channel is now closed.'
      SmsNotification.send_from_private_phone(@phone.number, @from, @message)
    end
  end

  def check_input
    @star = Star.find(@command.star_id)
    @post = Post.find(@star.post_id)
    if @command.action == 'approve_post_alert'
      approve_post
      release_private_channel
    end
  end

  def find_private_channel(user)
    if conversation = Conversation.find_by(seller_phone_id: @phone.id, seller_id: user.id)
      @recipient = User.find(conversation.buyer_id)
    elsif conversation = Conversation.find_by(buyer_phone_id: @phone.id, buyer_id: user.id)
      @recipient = User.find(conversation.buyer_id)
    end
  end

  def approve_post
    @star.update_attributes(sent: true, accepted: true)
    @command.destroy
    @message = "EasyBooks: A message will arrive soon from #{@post.seller.first_name}, the seller of #{@post.title}. You can text the seller directly through that private number."
    SmsNotification.send_from_main_phone(@from, @message)
  end

  def release_private_channel
    buyer = User.find_by(phone: @from)
    seller = @post.seller

    seller_numbers = Conversation.where(seller_id: seller.id).includes(:seller_phone).pluck(:number)
    buyer_numbers = Conversation.where(buyer_id: buyer.id).includes(:buyer_phone).pluck(:number)

    seller_phone = Phone.where.not(number: seller_numbers).first
    buyer_phone = Phone.where.not(number: buyer_numbers).first
    Conversation.create(seller_id: seller.id, buyer_id: buyer.id, seller_phone_id: seller_phone.id, buyer_phone_id: buyer_phone.id, star_id: @star.id)

    system = ENV['TWILIO_PHONE']
    to_buyer_message = "EasyBooks: This is a private channel between you and #{seller.first_name}, the seller of #{@post.title}: $#{@post.price} (#{@post.condition}). Start texting!\n\nTo terminate this conversation, reply with 'EXIT'.\n\nTo mark this transaction as completed, reply with 'DONE'."
    SmsNotification.send_from_private_phone(buyer_phone.number, buyer.phone, to_buyer_message)

    # to_seller_message = "EasyBooks: This is a private channel between you and #{buyer.first_name}, who is interested in buying #{@post.title}. Start texting!\n\nTo terminate this conversation, reply with 'EXIT'.\n\nTo mark this transaction as completed, reply with 'DONE'."
    # SmsNotification.send_from_private_phone(seller_phone.number, seller.phone, to_seller_message)
  end
end







