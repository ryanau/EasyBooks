class University < ActiveRecord::Base
  has_many :courses, -> { where(courses: {active: true}) }
  has_many :inactive_courses,  -> { where(courses: {active: true}) }, :class_name => "Course", :foreign_key => :course_id

  has_many :users
end
