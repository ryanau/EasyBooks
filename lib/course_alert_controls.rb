module CourseAlertControls
  def self.create_course_alert(course_id, post_id, seller_id)
    course = Course.find(course_id)
    post = Post.find(post_id)
    seller = User.find(seller_id)
    phone_total_count = Phone.all.count

    # only send course alert if subscriber is not at max for concurrent conversation and if the conversation he's currenlty is not of this course
    Subscription.where(course_id: course_id, active: true).each do |subscription|
      subscriber_engaged_count = subscription.user.buying_conversations.count + subscription.user.selling_conversations.count
      if subscriber_engaged_count < phone_total_count
        conversation_course_array = []
        subscription.user.buying_conversations.each do |conversation|
          conversation_course_array << conversation.star.post.course_id == course_id
        end
        if conversation_course_array.empty?
          command = new_post_alert_stop_command(subscription.id)
          send_course_alert(subscription.user.phone, course, seller, post, command.random_num)
        end
      end
    end
  end

  private

  def self.new_post_alert_stop_command(subscription_id)
    random = Faker::Number.number(6)
    command = Command.new(subscription_id: subscription_id, random_num: random, action: 'stop_post_alert')
    if command.save
      command
    else
      new_post_alert_stop_command(subscription_id)
    end
  end

  def self.send_course_alert(to, course, seller, post, random_num)
    course_name = course.department + " " + course.course_number
    post_id = post.id.to_s
    root = "https://easybooks.herokuapp.com/posts/#{post_id}"
    message = "EasyBooks says: New post for #{course_name}! #{post.title} (#{post.condition}): $#{post.price} by #{seller.first_name}!\n\nClick here to watch the post: #{root}\n\nTo stop getting alert from #{course_name}, reply with '#{random_num}'."
    SmsOutbound.send_from_main_phone(to, message)
  end
end










