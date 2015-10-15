module SmsNotification

  def self.create_course_alert(course_id, post_id, seller_id)
    course = Course.find(course_id)
    post = Post.find(post_id)
    seller = User.find(seller_id)

    Subscription.where(course_id: course_id).each do |subscription| 
        #lib/sms_notifications.rb
        send_course_alert(subscription.user.phone, course, seller, post)
        Notification.create(subscription_id: subscription.id, post_id: post.id)
    end
  end

  def self.create_post_alert(post_id)
    post = Post.find(post_id)
    seller = post.seller
    accepted = post.stars.find_by(accepted: true)
    if !accepted
      star = post.stars.where(sent: false).where.not(user_id: seller.id).first
      if send_post_alert(star.user.phone, post)
        star.update_attributes(sent: true)
      end
    end
  end

  private

  def self.send_course_alert(to, course, seller, post)
    from = ENV['TWILIO_PHONE']
    to = '+1' + to.to_s
    course_name = course.department + " " + course.course_number
    body = "EasyBooks: New Post for #{course_name}! #{post.title} (#{post.condition}): $#{post.price} by #{seller.first_name}!"
    twilio_sms(from, to, body)
  end

  def self.send_post_alert(to, post)
    from = ENV['TWILIO_PHONE']
    to = '+1' + to.to_s
    seller = post.seller.first_name
    body = "Easybooks: #{seller} would like to know if you're interested in #{post.title} (#{post.condition}) for $#{post.price}. Reply with "
    twilio_sms(from, to, body)
  end

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