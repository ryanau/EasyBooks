class Course < ActiveRecord::Base
  has_many :subscriptions, dependent: :destroy
  has_many :posts, dependent: :destroy
  belongs_to :university

end
