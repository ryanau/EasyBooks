class Course < ActiveRecord::Base
  has_many :subscriptions
  has_many :posts
  belongs_to :university

end
