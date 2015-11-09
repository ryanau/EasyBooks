class Course < ActiveRecord::Base
  has_many :subscriptions, -> { where(subscriptions: {active: true}) }
  has_many :inactive_subscriptions, -> { where(subscriptions: {active: false}) }, :class_name => "Subscription", :foreign_key => :course_id
  has_many :posts, -> { where(posts: {active: true}) }
  belongs_to :university

  validates_uniqueness_of :university_id, scope: [:department, :course_number, :year, :semester]
end
