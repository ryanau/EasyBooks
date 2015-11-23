require 'httparty'
class SmsInbound
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
    @seller = {}
  end

  def proceed
    if check_system_phone?
      if verify_command
        check_system_phone_inbound
      else
        send_system_phone_error_message
      end
    elsif check_private_channel_phone
      inbound_user = User.find_by(phone: @from)
      @conversation = Conversation.find_by(seller_phone_id: @phone.id, seller_id: inbound_user.id, active: true) || @conversation = Conversation.find_by(buyer_phone_id: @phone.id, buyer_id: inbound_user.id, active: true)
      @star = @conversation.star
      @post = Post.find_by(id: @star.post_id, active: true)
      if check_private_channel_conversation(inbound_user)
        if @seller #seller
          if @body.upcase == 'EXIT' || payment_code = Paymentcode.find_by(random_num: @body, conversation_id: @conversation.id)
            proceed_seller_action_in_private_channel(payment_code)
          else
            outbound_phone = Phone.find(@conversation.buyer_phone_id).number
            SmsOutbound.send_from_private_phone(outbound_phone, @recipient.phone, @body)
          end
        else #buyer
          if @body.upcase == 'EXIT'
            proceed_buyer_action_in_private_channel
          else
            outbound_phone = Phone.find(@conversation.seller_phone_id).number
            SmsOutbound.send_from_private_phone(outbound_phone, @recipient.phone, @body)
          end
        end
      else
        @message = "EasyBooks: You are not currently engaged in a transaction."
        SmsOutbound.send_from_private_phone(@phone.number, @from, @message)
      end
    end
  end

  private

  def send_system_phone_error_message
    message = "EasyBooks: Didn't recognize that command. Did you mistype?"
    SmsOutbound.send_from_main_phone(@from, message)
  end

  def check_system_phone?
    '+1' + @to == ENV['TWILIO_PHONE']
  end

  def check_private_channel_phone
    @phone = Phone.find_by(number: '+1' + @to)
  end

  def verify_command
    @command = Command.find_by(random_num: @body)
  end

  def proceed_seller_action_in_private_channel(payment_code)
    if @body.upcase == 'EXIT'
      proceed_user_action_in_private_channel_exit
    else
      proceed_seller_action_in_private_channel_complete(payment_code)
    end
  end

  def proceed_buyer_action_in_private_channel
    if @body.upcase == 'EXIT'
      proceed_user_action_in_private_channel_exit
    end
  end

  def proceed_user_action_in_private_channel_exit
    message = 'EasyBooks: This transaction has been terminated by the other party. This private channel is now closed.'
    star = Star.find_by(id: @conversation.star_id, active: true)
    PostAlert.perform_async(star.post.id)
    star.update_attributes(active: false)
    @conversation.update_attributes(active: false)
    @conversation.paymentcode.destroy
    SmsOutbound.send_from_private_phone(@phone.number, @conversation.seller.phone, message)
    SmsOutbound.send_from_private_phone(@phone.number, @conversation.buyer.phone, message)
  end

  def proceed_seller_action_in_private_channel_complete(payment_code)
    #venmo transaction here
    token = @conversation.buyer.venmo_account.token
    note = "EasyBooks transaction of #{@post.title} for $#{@post.price}0"
    seller_venmo_uid = @conversation.seller.venmo_account.venmo_uid
    amount = @post.price.to_s + "0"
    # disable Venmo charge
    # response = create_venmo_charge(token, note, seller_venmo_uid, amount)

    # payment_id = response.parsed_response["data"]["payment"]["id"]
    # venmo_amount = response.parsed_response["data"]["payment"]["amount"]

    # entry = Entry.create(seller_id: @conversation.seller.id, buyer_id: @conversation.buyer.id, post_id: @post.id, venmo_transaction_id: payment_id, amount: venmo_amount)

    entry = Entry.create(seller_id: @conversation.seller.id, buyer_id: @conversation.buyer.id, post_id: @post.id, venmo_transaction_id: "Completed through Demo", amount: amount)
    
    if entry
      buyer_message = "EasyBooks: The Payment Code was verified. You should see a transfer of $#{@post.price}0 from your Venmo to #{@conversation.seller.first_name}'s account.\n\nThank you for using EasyBooks!"
      seller_message = "EasyBooks: The Payment Code was verified. You should see a transfer of $#{@post.price}0 from #{@conversation.buyer.first_name}'s Venmo to yours.\n\nThank you for using EasyBooks!"
      SmsOutbound.send_from_private_phone(@phone.number, @conversation.seller.phone, seller_message)
      SmsOutbound.send_from_private_phone(@phone.number, @conversation.buyer.phone, buyer_message)

      @post.update_attributes(sold: true, public: false, buyer_id: @conversation.buyer.id)
      @post.stars.update_all(active: false)
      @conversation.update_attributes(active: false)
      @conversation.paymentcode.destroy

      if @conversation.seller.selling_posts.count > 0
      activiate_post_alerts(@conversation.seller_id)
      end
    end
  end

  def create_venmo_charge(token, note, user_id, amount)
    HTTParty.post("https://api.venmo.com/v1/payments",
      :body => { "amount" => amount, 
                  "access_token" => token,
                  "note" => note,
                  "user_id" => user_id
                }
    )
  end

  def activiate_post_alerts(seller_id)
    seller = User.find(seller_id)
    phone_total_count = Phone.all.count
    seller_engaged_count = seller.buying_conversations.count + seller.selling_conversations.count
    if phone_total_count > seller_engaged_count
      posts_id = []
      seller.selling_posts.each do |selling_post|
        if !selling_post.stars.where(sent: false).empty?
          posts_id << selling_post.id
        end
      end
      number_of_posts_to_send = phone_total_count - seller_engaged_count - 1
      posts_id[0..number_of_posts_to_send].each do |post|
        PostAlert.perform_async(post.id)
      end
    end
  end

  def check_system_phone_inbound
    if @command.action == 'approve_post_alert'
      star = Star.find_by(id: @command.star_id, active: true)
      post = Post.find_by(id: star.post_id, active: true)
      approve_post(star)
      release_private_channel(post, star)
    elsif @command.action == 'stop_post_alert'
      @subscription = Subscription.find_by(id: @command.subscription_id, active: true)
      stop_post_alert
    end
  end

  def stop_post_alert
    department = @subscription.course.department
    course_number = @subscription.course.course_number
    @subscription.update_attributes(active: false)
    message = "EasyBooks: You have cancelled your subscription to #{department} #{course_number}. You will no longer receive text alerts when new posts for this course are available.\n\nTo resubscribe, visit: https://easybooks.herokuapp.com/subscriptions"
    SmsOutbound.send_from_main_phone(@from, message)
  end

  def check_private_channel_conversation(inbound_user)
    p 'inside check private channel conversation'
    if @conversation = Conversation.find_by(seller_phone_id: @phone.id, seller_id: inbound_user.id, active: true)
      p 'its a seller'
      p @conversation.id
      @recipient = User.find(@conversation.buyer_id)
      @seller = true
      true
    elsif @conversation = Conversation.find_by(buyer_phone_id: @phone.id, buyer_id: inbound_user.id, active: true)
      p 'its a buyer'
      @recipient = User.find(@conversation.seller_id)
      @seller = false
      true
    end
  end

  def approve_post(star)
    star.update_attributes(accepted: true)
    post = star.post
    @command.destroy
    department = post.course.department
    course_number = post.course.course_number
    @message = "EasyBooks: You will soon receive a message from #{post.seller.first_name}, the seller of #{post.title} for #{department} #{course_number}."
    SmsOutbound.send_from_main_phone(@from, @message)
  end

  def release_private_channel(post, star)
    buyer = User.find_by(phone: @from)
    seller = post.seller
    course_name = post.course.department + " " + post.course.course_number

    seller_numbers = Conversation.where(seller_id: seller.id, active: true).includes(:seller_phone).pluck(:number)
    buyer_numbers = Conversation.where(buyer_id: buyer.id, active: true).includes(:buyer_phone).pluck(:number)

    seller_phone = Phone.where.not(number: seller_numbers).first
    buyer_phone = Phone.where.not(number: buyer_numbers).first


    conversation = Conversation.create(seller_id: seller.id, buyer_id: buyer.id, seller_phone_id: seller_phone.id, buyer_phone_id: buyer_phone.id, star_id: star.id)

    payment_code = new_paymentcode(conversation.id).random_num

    to_buyer_message = "Hi #{buyer.first_name}! It's #{seller.first_name} selling #{post.title} for $#{post.price}0 (#{post.condition}). You still interested?\n\nIf you're no longer interested in buying my book, feel free to reply with 'EXIT' to terminate this conversation.\n\nEasyBooks says: Please tell seller the Payment Code AFTER you have received the book from the seller. The venmo transfer will be initiated once the seller text the Payment Code to this conversation.\n\n*** Payment Code ***\n#{payment_code}"

    SmsOutbound.send_from_private_phone(buyer_phone.number, buyer.phone, to_buyer_message)

    to_seller_message = "EasyBooks: You just got matched with #{buyer.first_name} who wants to buy #{post.title} for #{course_name} at $#{post.price}0.\n\nTo terminate this conversation and talk to the next buyer interested, reply with 'EXIT'.\n\nAsk the buyer for the Payment Code after you handover the book. Text it to this number to start the Venmo transfer and complete the transaction."
    SmsOutbound.send_from_private_phone(seller_phone.number, seller.phone, to_seller_message)
  end

  def new_paymentcode(conversation_id)
    conversation = Conversation.find(conversation_id)
    random = Faker::Number.number(6)
    payment_code = Paymentcode.new(conversation_id: conversation_id, random_num: random, seller_id: conversation.seller.id, buyer_id: conversation.buyer.id)
    if payment_code.save
      payment_code
    else
      new_paymentcode(conversation_id)
    end
  end
end








