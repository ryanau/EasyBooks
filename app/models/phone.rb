class Phone < ActiveRecord::Base
  has_many :conversations

  has_many :selling_conversations, :class_name => "Conversation", :foreign_key => :seller_phone_id
  has_many :buying_conversations, :class_name => "Conversation", :foreign_key => :buyer_phone_id
end
