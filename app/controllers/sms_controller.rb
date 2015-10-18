class SmsController < ApplicationController
  def approve
    action = SmsInputVerifier.new(params)
    action.proceed
  end
end
