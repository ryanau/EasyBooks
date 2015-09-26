require 'icalendar'

class SubscriptionsController < ApplicationController
  before_action :authentication, only: [:index, :create, :parse_calendar]

  def index
    subscriptions = current_user.subscriptions.all
  end

  def create
    courses = params[:courses]
    if courses != nil
      courses.each do |course|
        department = course[1][0]
        course_number = course[1][1]
        selected = Course.where(department: department, course_number: course_number).first
        if current_user.subscriptions.where(course_id: selected.id).count == 0
          current_user.subscriptions.create(course_id: selected.id)
        end
      end
    end
    render json: {message: "success"}
  end

  def parse_calendar
    file = params["calendar"].open()
    calendar = File.open(file)
    cals = Icalendar.parse(calendar)
    cal = cals.first

    events = []
    if cal.events != nil
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
    end
    render json: {courses: class_arr}
  end
end
