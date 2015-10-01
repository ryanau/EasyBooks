class CoursesController < ApplicationController
  before_action :authentication, only: [:index]
  def index
    university_id = current_user.university.id
    courses = []
    Course.where(university_id: university_id, semester: "FALL", year: "2015").each do |course|
      courses.push({value: course.department + " " + course.course_number, label: course.department + " " + course.course_number})
    end
    render json: {courses: courses}
  end
end
