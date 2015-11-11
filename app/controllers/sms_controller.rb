class SmsController < ApplicationController
  def approve
    action = SmsInbound.new(params)
    action.proceed
  end
end
