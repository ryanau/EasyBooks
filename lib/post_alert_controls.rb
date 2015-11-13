module PostAlertControls
  def self.create_post_alert(post_id)
    post = Post.find(post_id)
    seller = post.seller
    accepted = post.stars.where(sent: true, active: true).count
    if accepted == 0
      star = find_subscribed_idle_user(post, seller)
      if star
        command = new_post_alert_command(star.id)
        star.update_attributes(sent: true)
        send_post_alert(star.user.phone, post, command.random_num)
        PostAlertDestroyer.perform_in(1.minutes, star.id)
      end
    end
  end

  private

  def self.find_subscribed_idle_user(post, seller)
    seller_engaged_count = current_user.buying_conversations.count + current_user.selling_conversations.count
    phone_total_count = Phone.all.count
    
    if seller_engaged_count < phone_total_count
      subscribers_id = post.stars.where(active: true).pluck(:user_id)
      occupied = []
      subscribers_id.each do |subscriber_id|
        subscriber_engaged_count = User.find(subscriber_id).buying_conversations.count + User.find(subscriber_id).selling_conversations.count
        if subscriber_engaged_count > phone_total_count
          occupied << subscriber_id
        end
      end
      post.stars.where(sent: false, active: true).where.not(user_id: seller.id).where.not(user_id: occupied).first
    else
      return false
    end
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
    SmsOutbound.send_from_main_phone(to, message)
  end
end










