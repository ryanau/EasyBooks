class Star < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
  has_one :conversation, -> { where(conversations: {active: true}) }
  has_many :commands

  validates_uniqueness_of :post_id, :scope => :user_id, conditions: -> { where(active: true) }
end
