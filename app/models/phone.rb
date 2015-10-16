class Phone < ActiveRecord::Base
  has_many :conversations
end
