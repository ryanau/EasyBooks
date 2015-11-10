class Star < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
  has_one :conversation, -> { where(conversations: {active: true}) }
  has_many :commands
  validates_uniqueness_of :user_id, :scope => :post_id, if: Proc.new { |star| star.active? }
end
