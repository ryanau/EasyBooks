class NotifySubscribedBuyers
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(course_id, post_id, post_pickup, post_title, post_price, seller)
    notify_buyers_available_posts(course_id, post_id, post_pickup, post_title, post_price, seller)
  end

  def twilio_subscribed_notification(phone, course, seller, pick_up, post_title, post_price)
    phone = '+1' + phone.to_s
    course_name = course.department + " " + course.course_number
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    @client = Twilio::REST::Client.new account_sid, auth_token
    @client.messages.create(
      from: ENV['TWILIO_PHONE'],
      to: phone,
      body: "EasyBooks: A post for #{course_name} is available! The post titled: #{post_title}, is asking for $#{post_price} by #{seller} to be picked up at #{pick_up}!"
    )
  end

  def notify_buyers_available_posts(course_id, post_id, post_pickup, post_title, post_price, seller)
    Subscription.where(course_id: course_id).each do |subscription|
      course = Course.find(subscription.course_id)
        twilio_subscribed_notification(subscription.user.phone, course, seller, post_pickup, post_title, post_price)
        Notification.create(subscription_id: subscription.id, post_id: post_id)
    end
  end
end



