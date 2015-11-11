module SmsOutbound

  # def self.create_course_alert(course_id, post_id, seller_id)
  #   course = Course.find(course_id)
  #   post = Post.find(post_id)
  #   seller = User.find(seller_id)

  #   Subscription.where(course_id: course_id).each do |subscription|
  #     conversation = subscription.user.buying_conversations.first
  #     if conversation
  #       if conversation.star.post.course != subscription.course
  #         command = new_post_alert_stop_command(subscription.id)
  #         send_course_alert(subscription.user.phone, course, seller, post, command.random_num)
  #       end
  #     else
  #       command = new_post_alert_stop_command(subscription.id)
  #       send_course_alert(subscription.user.phone, course, seller, post, command.random_num)
  #     end
  #   end
  # end

  # def self.create_post_alert(post_id)
  #   post = Post.find(post_id)
  #   seller = post.seller
  #   accepted = post.stars.find_by(sent: true)
  #   if !accepted
  #     star = find_subscribed_idle_user(post, seller)
  #     if star
  #       command = new_post_alert_command(star.id)
  #       send_post_alert(star.user.phone, post, command.random_num)
  #       star.update_attributes(sent: true)
  #       PostAlertDestroyer.perform_in(5.minutes, star.id)
  #     end
  #   end
  # end

  # def self.destroy_post_alert(star_id)
  #   star = Star.find(star_id)
  #   if star && star.sent && star.accepted
  #     PostAlert.perform_async(star.post.id)
  #     star.destroy!
  #   end
  # end

  def self.send_from_main_phone(to, message)
    from = ENV['TWILIO_PHONE']
    to = '+1' + to.to_s
    twilio_sms(from, to, message)
  end

  def self.send_from_private_phone(from, to, message)
    to = '+1' + to.to_s
    twilio_sms(from, to, message)
  end

  private

  # def self.find_subscribed_idle_user(post, seller)
  #   subscribers_id = post.stars.pluck(:user_id)
  #   occupied = []
  #   subscribers_id.each do |subscriber_id|
  #     if User.find(subscriber_id).stars.find_by(accepted: true)
  #       occupied << subscriber_id
  #     end
  #   end
  #   post.stars.where(sent: false).where.not(user_id: seller.id).where.not(user_id: occupied).first
  # end

  # def self.new_post_alert_command(star_id)
  #   random = Faker::Number.number(6)
  #   command = Command.new(star_id: star_id, random_num: random, action: 'approve_post_alert')
  #   if command.save
  #     return command
  #   else
  #     new_post_alert_command(star_id)
  #   end
  # end

  # def self.new_post_alert_stop_command(subscription_id)
  #   random = Faker::Number.number(6)
  #   command = Command.new(subscription_id: subscription_id, random_num: random, action: 'stop_post_alert')
  #   if command.save
  #     command
  #   else
  #     new_post_alert_stop_command(subscription_id)
  #   end
  # end

  # def self.send_course_alert(to, course, seller, post, random_num)
  #   from = ENV['TWILIO_PHONE']
  #   to = '+1' + to.to_s
  #   course_name = course.department + " " + course.course_number
  #   post_id = post.id.to_s
  #   root = "https://easybooks.herokuapp.com/posts/#{post_id}"
  #   body = "EasyBooks: New post for #{course_name}! #{post.title} (#{post.condition}): $#{post.price} by #{seller.first_name}!\n\nClick here to watch the post: #{root}\n\nTo stop getting alert from #{course_name}, reply with '#{random_num}'."
  #   twilio_sms(from, to, body)
  # end

  # def self.send_post_alert(to, post, random_num)
  #   from = ENV['TWILIO_PHONE']
  #   to = '+1' + to.to_s
  #   seller = post.seller.first_name
  #   course_name = post.course.department + " " + post.course.course_number
  #   body = "EasyBooks: #{post.title} for #{course_name} (#{post.condition}) is available for $#{post.price}.\n\nTo talk to the seller, reply with '#{random_num}'.\n\nThis offer expires in 5 mins."
  #   twilio_sms(from, to, body)
  # end

  def self.twilio_sms(from, to, body)
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    @client = Twilio::REST::Client.new account_sid, auth_token
    @client.messages.create(
      from: from,
      to: to,
      body: body,
    )
  end
end