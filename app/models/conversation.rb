class Conversation < ActiveRecord::Base
  has_one :paymentcode

  belongs_to :star

  belongs_to :seller_phone, :class_name => "Phone", :foreign_key => :seller_phone_id
  belongs_to :buyer_phone, :class_name => "Phone", :foreign_key => :buyer_phone_id

  belongs_to :seller, :class_name => "User", :foreign_key => :seller_id
  belongs_to :buyer, :class_name => "User", :foreign_key => :buyer_id

  # doesn't fucking work
  validates_uniqueness_of :seller_id, :scope => :seller_phone_id, conditions: -> { where(active: true) }
  validates_uniqueness_of :buyer_id, :scope => :buyer_phone_id, conditions: -> { where(active: true) }
  validates_uniqueness_of :buyer_id, :scope => :star_id, conditions: -> { where(active: true) }
  validates_uniqueness_of :seller_id, :scope => :star_id, conditions: -> { where(active: true) }
end
