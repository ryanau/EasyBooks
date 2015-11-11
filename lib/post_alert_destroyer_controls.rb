module PostAlertDestroyerControls
  def self.destroy_post_alert(star_id)
    star = Star.find_by(id: star_id, active: true)
    if star && star.sent
      Command.find_by(star_id: star.id).destroy
      star.update_attributes(active: false, expired: true)
      post_id = star.post.id
      PostAlert.perform_async(post_id)
    end
  end
end
