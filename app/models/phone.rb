class Phone < ActiveRecord::Base
  has_many :conversations

  has_many :selling_conversations,  -> { where(selling_conversations: {active: true}) }, :class_name => "Conversation", :foreign_key => :seller_phone_id
  has_many :inactive_selling_conversations,  -> { where(selling_conversations: {active: false}) }, :class_name => "Conversation", :foreign_key => :seller_phone_id
  has_many :buying_conversations,  -> { where(buying_conversations: {active: true}) }, :class_name => "Conversation", :foreign_key => :buyer_phone_id
  has_many :inactive_buying_conversations,  -> { where(buying_conversations: {active: false}) }, :class_name => "Conversation", :foreign_key => :buyer_phone_id

end