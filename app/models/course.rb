class Course < ActiveRecord::Base
  has_many :subscriptions, dependent: :destroy
  has_many :posts, dependent: :destroy
  belongs_to :university

  validates_uniqueness_of :university_id, scope: :department, :course_number, :year, :semester
end
