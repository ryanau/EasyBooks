class Star < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
  has_one :conversation
  has_many :commands, dependent: :destroy
  validates_uniqueness_of :user_id, scope: :post_id
end
