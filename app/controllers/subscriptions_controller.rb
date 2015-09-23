require 'icalendar'

class SubscriptionsController < ApplicationController
  before_action :authentication, only: [:index, :create, :parse_calendar]

  def index
    subscriptions = current_user.subscriptions.all
  end

  def create

  end

  def parse_calendar
    file = params["calendar"].open()
    calendar = File.open(file)
    cals = Icalendar.parse(calendar)
    cal = cals.first

    events = []
    cal.events.each do |event|
      events << event.summary
    end

    p events
    render json: {message: "success"}
  end
end
