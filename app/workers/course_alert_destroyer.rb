class CourseAlertDestroyer
  include Sidekiq::Worker
  sidekiq_options :retry => false
  def perform(star_id)
    SmsNotification.destroy_course_alert(star_id)
  end
end



