module SmsNotifications
  def post_available_notification(phone, course, seller, post)
    phone = '+1' + phone.to_s
    course_name = course.department + " " + course.course_number
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    @client = Twilio::REST::Client.new account_sid, auth_token
    @client.messages.create(
      from: ENV['TWILIO_PHONE'],
      to: phone,
      body: "EasyBooks: A post for #{course.name} is available! The post titled: #{post.title}, is asking for $#{post.price} by #{seller} to be picked up at #{post.pickup}!"
    )
  end

  def notify_buyers_available_posts(course_id, post_id, seller_id)
    course = Course.find(course_id)
    post = Post.find(post_id)
    seller = User.find(seller_id)

    Subscription.where(course_id: course_id).each do |subscription|      
        #lib/sms_notifications.rb
        post_available_notification(subscription.user.phone, course, seller, post)
        Notification.create(subscription_id: subscription.id, post_id: post.id)
    end
  end
end