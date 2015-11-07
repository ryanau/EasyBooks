module PostAlertDestroyerControls
  def self.destroy_post_alert(star_id)
    star = Star.find(star_id)
    if star && star.sent && star.accepted
      star_id = star.id
      star.destroy!
      PostAlert.perform_async(star.post.id)
    end
  end
end
