module SmsNotification
  def self.create_course_alert(course_id, post_id, seller_id)
    course = Course.find(course_id)
    post = Post.find(post_id)
    seller = User.find(seller_id)

    Subscription.where(course_id: course_id).each do |subscription|
        send_course_alert(subscription.user.phone, course, seller, post)
    end
  end

  def self.create_post_alert(post_id)
    post = Post.find(post_id)
    seller = post.seller
    accepted = post.stars.find_by(sent: true)
    if !accepted
      star = post.stars.where(sent: false).where.not(user_id: seller.id).first
      if star && new_post_alert_command(star.id) && send_post_alert(star.user.phone, post, @command.random_num)
        star.update_attributes(sent: true)
      end
    end
  end

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

  def self.new_post_alert_command(star_id)
    random = Faker::Number.number(6)
    @command = Command.new(star_id: star_id, random_num: random, action: 'approve_post_alert')
    if @command.save
      @command
    else
      new_post_alert_command(star_id)
    end
  end

  def self.send_course_alert(to, course, seller, post)
    from = ENV['TWILIO_PHONE']
    to = '+1' + to.to_s
    course_name = course.department + " " + course.course_number
    p '*' * 100
    root = Rails.root.join('posts/' + post.id.to_s)
    p root
    body = "EasyBooks: New post for #{course_name}! #{post.title} (#{post.condition}): $#{post.price} by #{seller.first_name}!\n\nClick here to star the post: #{root}"
    twilio_sms(from, to, body)
  end

  def self.send_post_alert(to, post, random_num)
    from = ENV['TWILIO_PHONE']
    to = '+1' + to.to_s
    seller = post.seller.first_name
    body = "EasyBooks: #{seller} would like to know if you're interested in #{post.title} (#{post.condition}) for $#{post.price}.\n\nTo proceed, reply with '#{random_num}'.\n\nThis offer expires in 30mins."
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