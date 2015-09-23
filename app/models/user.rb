class User < ActiveRecord::Base
  validates :email, uniqueness: true
  has_secure_password
end
