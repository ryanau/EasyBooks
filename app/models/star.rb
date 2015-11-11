class Star < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
  has_one :conversation, -> { where(conversations: {active: true}) }
  has_many :commands
  # validates_uniqueness_of :post_id, :scope => :user_id, if: Proc.new { |star| star.active? }
  # validates_uniqueness_of :post_id, :scope => :user_id
  # validates :post_id, :uniqueness => { :scope => :user_id }, :if => :active
  # validates :post, uniqueness: { scope: :user }, if: Proc.new { |star| star.active? }

  # validates :user_id, uniqueness: {scope: :post_id}, if: Proc.new { |star| star.active? }
end
