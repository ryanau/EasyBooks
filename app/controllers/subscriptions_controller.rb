require 'icalendar'

class SubscriptionsController < ApplicationController
  before_action :authentication, only: [:index, :create, :parse_calendar, :update]

  def index
    subscriptions = current_user.subscriptions.all.includes(:course)
    render json: subscriptions.to_json(include: [:course])
  end

  def update
    courses = params[:courses]
    if courses != nil
      courses.each do |course|
        department = course[1][0]
        course_number = course[1][1]
        for_deletion = current_user.subscriptions.find_by(course_id: Course.find_by(department: department, course_number: course_number).id)
        for_deletion.destroy
      end
    end
    render json: {message: "success"}
  end

  def create
    if params[:course_selected]
      course_selected = params[:course_selected]
      arr = []
      arr.unshift(course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1])
      total = course_selected.length - course_selected[course_selected.reverse.index(/\s{1}/, 1) * -1.. -1].length - 2
      arr.unshift(course_selected[0..total])
      course_id = Course.find_by(department: arr[0], course_number: arr[1]).id
      if current_user.subscriptions.where(course_id: course_id).count == 0
        current_user.subscriptions.create(course_id: course_id)
        render json: {message: "success"}
      else
        render json: {message: "this course has already been subscribed to"}
      end
    elsif params[:courses]
      courses = params[:courses]
      if courses != nil
        courses.each do |course|
          department = course[1][0]
          course_number = course[1][1]
          selected = Course.find_by(department: department, course_number: course_number)
          if current_user.subscriptions.where(course_id: selected.id).count == 0
            current_user.subscriptions.create(course_id: selected.id)
          end
        end
      render json: {message: "success"}
      end
    else
      render json: "Course not found", status: 400
    end
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
      render json: {courses: class_arr}
    else
      render json: "Failed to parse .ics file", status: 400
    end
  end
end
