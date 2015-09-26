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

    classes = []
    events.each do |event|
      classes << event[0..(event.reverse.index(/\s{1}/, 1) * -1 -2)]
    end

    class_arr = []
    classes.uniq!.each do |clas|
      arr = []
      arr.unshift(clas[clas.reverse.index(/\s{1}/, 1) * -1.. -1])
      total = clas.length - clas[clas.reverse.index(/\s{1}/, 1) * -1.. -1].length - 2
      arr.unshift(clas[0..total])
      class_arr << arr
    end
    render json: {courses: class_arr}
  end
end
