class SmsController < ApplicationController
  def approve
    action = SmsInputVerifier.new(params)
    if action.ok?
      SmsNotification.create_post_alert_approval_reply(action.from, action.message)
    end
  end
end
