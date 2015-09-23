class Course < ActiveRecord::Base
  has_many :subscriptions
  has_many :posts
  has_many :suggestedbook
  belongs_to :university

end
