module PostAlertDestroyerControls
  def self.destroy_post_alert(star_id)
    star = Star.find_by(id: star_id, active: true)
    if star && star.sent && star.accepted
      star.update_attributes(active: false)
      PostAlert.perform_async(star.id)
    end
  end
end
