module PostAlertControls
  def self.create_post_alert(post_id)
    post = Post.find(post_id)
    seller = post.seller
    accepted = post.stars.find_by(sent: true, active: true)
    if !accepted
      star = find_subscribed_idle_user(post, seller)
      if star
        command = new_post_alert_command(star.id)
        send_post_alert(star.user.phone, post, command.random_num)
        star.update_attributes(sent: true)
        PostAlertDestroyer.perform_in(5.minutes, star.id)
      end
    end
  end

  private

  def self.find_subscribed_idle_user(post, seller)
    subscribers_id = post.stars.where(active: true).pluck(:user_id)
    occupied = []
    subscribers_id.each do |subscriber_id|
      if User.find(subscriber_id).stars.find_by(accepted: true, active: true)
        occupied << subscriber_id
      end
    end
    post.stars.where(sent: false, active: true).where.not(user_id: seller.id).where.not(user_id: occupied).first
  end

  def self.new_post_alert_command(star_id)
    random = Faker::Number.number(6)
    command = Command.new(star_id: star_id, random_num: random, action: 'approve_post_alert')
    if command.save
      return command
    else
      new_post_alert_command(star_id)
    end
  end

  def self.send_post_alert(to, post, random_num)
    seller = post.seller.first_name
    course_name = post.course.department + " " + post.course.course_number
    message = "EasyBooks says: #{post.title} for #{course_name} (#{post.condition}) is available for $#{post.price}.\n\nTo text the seller, reply with '#{random_num}'.\n\nThis offer expires in 5 mins."
    SmsNotification.send_from_main_phone(to, message)
  end
end










