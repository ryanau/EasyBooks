class University < ActiveRecord::Base
  has_many :courses, dependent: :destroy
  has_many :students
end
