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
    @conversation = {}
  end

  def proceed
    if check_system_phone && verify_command
      check_input
    elsif check_private_channel_phone
      @recipient = User.find_by(phone: @from)
      if find_private_channel(@recipient)
        if @body.upcase == 'EXIT' || @body.upcase == 'DONE'
          proceed_user_action_in_private_channel
        else
          SmsNotification.send_from_private_phone(@phone.number, @recipient.phone, @body)
        end
      else
        @message = "EasyBooks: You are not currently engaged in a transaction."
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

  def proceed_user_action_in_private_channel
    if @body.upcase == 'EXIT'
      proceed_user_action_in_private_channel_exit
    elsif @body.upcase == 'DONE'
      proceed_user_action_in_private_channel_done
    end
  end

  def proceed_user_action_in_private_channel_exit
    message = 'EasyBooks: This transaction has been terminated by the other party. This private channel is now closed.'
    star = Star.find_by(id: @conversation.star_id, active: true)
    PostAlert.perform_async(star.post.id)
    star.update_attributes(active: false)
    SmsNotification.send_from_private_phone(@phone.number, @conversation.seller.phone, message)
    SmsNotification.send_from_private_phone(@phone.number, @conversation.buyer.phone, message)
  end

  def proceed_user_action_in_private_channel_done
    message = 'EasyBooks: This transaction is marked as completed by the other party. This private channel is now closed.'
    SmsNotification.send_from_private_phone(@phone.number, @conversation.seller.phone, message)
    SmsNotification.send_from_private_phone(@phone.number, @conversation.buyer.phone, message)
    star = Star.find_by(id: @conversation.star_id, active: true)
    post = Post.find_by(id: star.post.id, active: true)
    post.update_attributes(sold: true, public: false, buyer_id: @conversation.buyer.id)
    post.stars.update_attributes(active: false)
  end

  def check_input
    if @command.action == 'approve_post_alert'
      @star = Star.find_by(id: @command.star_id, active: true)
      @post = Post.find_by(id: @star.post_id, active: true)
      approve_post
      release_private_channel(@post)
    elsif @command.action == 'stop_post_alert'
      @subscription = Subscription.find_by(id: @command.subscription_id, active: true)
      stop_post_alert
    end
  end

  def stop_post_alert
    department = @subscription.course.department
    course_number = @subscription.course.course_number
    @subscription.update_attributes(active: false)
    message = "EasyBooks: Your subscription to #{department} #{course_number} has been cancelled. You will no longer receive text alerts when new posts for this course is available.\n\nTo resubscribe, visit: https://easybooks.herokuapp.com/subscriptions"
    SmsNotification.send_from_main_phone(@from, message)
  end

  def find_private_channel(user)
    if @conversation = Conversation.find_by(seller_phone_id: @phone.id, seller_id: user.id, active: true)
      @recipient = User.find(@conversation.buyer_id)
    elsif @conversation = Conversation.find_by(buyer_phone_id: @phone.id, buyer_id: user.id, active: true)
      @recipient = User.find(@conversation.seller_id)
    end
  end

  def approve_post
    @star.update_attributes(sent: true, accepted: true)
    @command.destroy
    @message = "EasyBooks: You will soon receive a message from #{@post.seller.first_name}, the seller of #{@post.title}."
    SmsNotification.send_from_main_phone(@from, @message)
  end

  def release_private_channel(post)
    buyer = User.find_by(phone: @from)
    seller = post.seller
    course_name = post.course.department + " " + post.course.course_number

    seller_numbers = Conversation.where(seller_id: seller.id, active: true).includes(:seller_phone).pluck(:number)
    buyer_numbers = Conversation.where(buyer_id: buyer.id, active: true).includes(:buyer_phone).pluck(:number)

    seller_phone = Phone.where.not(number: seller_numbers).first
    buyer_phone = Phone.where.not(number: buyer_numbers).first

    Conversation.create(seller_id: seller.id, buyer_id: buyer.id, seller_phone_id: seller_phone.id, buyer_phone_id: buyer_phone.id, star_id: @star.id)

    to_buyer_message = "Hi #{buyer.first_name}! It's #{seller.first_name} selling #{post.title} for $#{post.price} (#{post.condition}). You still interested?\n\nIf you're no longer interested in buying my book, feel free to reply with 'EXIT'."
    SmsNotification.send_from_private_phone(buyer_phone.number, buyer.phone, to_buyer_message)

    to_seller_message = "EasyBooks: You just matched with #{buyer.first_name} who is interested in #{post.title} for #{course_name}.\n\nTo terminate this conversation and wait for the next buyer, reply with 'EXIT'.\n\nTo mark this transaction as completed, reply with 'DONE'."
    SmsNotification.send_from_private_phone(seller_phone.number, seller.phone, to_seller_message)
  end
end








